import mongoose from 'mongoose';
import RequirementModel from '../mongodb/models/requirment.js';
import User from '../mongodb/models/user.js';

const getAllRequirements = async (req, res) => {
  const {
    _end,
    _order,
    _start,
    _sort,
    title_like = "",
    propertyType = "",
  } = req.query;

  const query = {};

  if (title_like) {
    const regex = new RegExp(title_like, 'i');
    query.$or = [
      { title: regex },
      { location: regex }
    ];
  }

  if (propertyType) {
    query.propertyType = propertyType.toLowerCase();
  }

  try {
    const count = await RequirementModel.countDocuments(query);
    const start = parseInt(_start) || 0;
    const limit = parseInt(_end) ? parseInt(_end) - start : 10;

    const requirements = await RequirementModel.find(query)
      .sort({ [_sort]: _order })
      .skip(start)
      .limit(limit)
      .lean();

    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(requirements);
  } catch (error) {
    console.error('Error fetching requirements:', error);
    res.status(500).json({ message: 'Failed to fetch requirements' });
  }
};

const saveRequirement = async (req, res) => {
  const { title, description, propertyType, dealType, phone, askedPrice, location, email } = req.body;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = await User.findOne({ email }).session(session);
    if (!user) {
      throw new Error('User not found');
    }

    const requirement = await RequirementModel.create({
      title,
      description,
      propertyType,
      dealType,
      askedPrice,
      phone,
      location,
      creator: user._id,
    });

    user.allRequirement.push(requirement);
    await user.save({ session });

    await session.commitTransaction();
    res.status(201).json({ message: 'Requirement created successfully', requirement });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error saving requirement:', error);
    if (error.message === 'User not found') {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(500).json({ message: 'Failed to save requirement' });
    }
  } finally {
    session.endSession();
  }
};

const getRequirementById = async (req, res) => {
  try {
    const { id } = req.params;
    const requirement = await RequirementModel.findOne({ _id: id }).populate('creator').lean();

    if (requirement) {
      res.status(200).json(requirement);
    } else {
      res.status(404).json({ message: 'Requirement not found' });
    }
  } catch (error) {
    console.error('Error fetching requirement by ID:', error);
    if (error.name === 'CastError') {
      res.status(400).json({ message: 'Invalid requirement ID format' });
    } else {
      res.status(500).json({ message: 'Failed to fetch requirement' });
    }
  }
};

const deleteRequirement = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { id } = req.params;
    const propertyToDelete = await RequirementModel.findById(id).populate("creator");

    if (!propertyToDelete) {
      throw new Error('Property not found');
    }

    await propertyToDelete.deleteOne({ session });

    const user = propertyToDelete.creator;
    user.allRequirement.pull(propertyToDelete);
    await user.save({ session });

    await session.commitTransaction();
    res.status(200).json({ message: "Property deleted successfully" });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error deleting requirement:', error);
    if (error.message === 'Property not found') {
      res.status(404).json({ message: "Property not found" });
    } else {
      res.status(500).json({ message: "Failed to delete property" });
    }
  } finally {
    session.endSession();
  }
};

const updateRequirement = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, propertyType, dealType, askedPrice, phone, location } = req.body;
    
    const updatedRequirement = await RequirementModel.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        propertyType,
        dealType,
        phone,
        location,
        askedPrice,
      },
      { new: true, runValidators: true }
    );

    if (!updatedRequirement) {
      return res.status(404).json({ message: "Requirement not found" });
    }

    res.status(200).json({ message: "Requirement updated successfully", requirement: updatedRequirement });
  } catch (error) {
    console.error('Error updating requirement:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: "Invalid input data", errors: error.errors });
    } else if (error.name === 'CastError') {
      res.status(400).json({ message: "Invalid requirement ID format" });
    } else {
      res.status(500).json({ message: "Failed to update requirement" });
    }
  }
};

const getTopLatestRequirements = async (req, res) => {
  try {
    const latestRequirements = await RequirementModel.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    const totalRequirementsCount = await RequirementModel.countDocuments();

    res.status(200).json({ 
      requirements: latestRequirements,
      totalRequirementsCount 
    });
  } catch (error) {
    console.error('Error fetching latest requirements:', error);
    res.status(500).json({ message: 'Failed to fetch latest requirements' });
  }
};

export { 
  updateRequirement, 
  getTopLatestRequirements, 
  getRequirementById, 
  deleteRequirement,
  getAllRequirements,
  saveRequirement,
};