import Property from "../mongodb/models/property.js";
import User from "../mongodb/models/user.js";
import mongoose from "mongoose";
import * as dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const getAllProperties = async (req, res) => {
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
    const count = await Property.countDocuments(query);
    const start = parseInt(_start) || 0;
    const limit = parseInt(_end) ? parseInt(_end) - start : 10;

    const properties = await Property.find(query)
      .sort({ [_sort]: _order })
      .skip(start)
      .limit(limit)
      .lean();

    res.header("x-total-count", count);
    res.header("Access-Control-Expose-Headers", "x-total-count");

    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Failed to fetch properties' });
  }
};

const getPropertyDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const propertyExists = await Property.findOne({ _id: id }).populate("creator").lean();

    if (propertyExists) {
      res.status(200).json(propertyExists);
    } else {
      res.status(404).json({ message: "Property not found" });
    }
  } catch (error) {
    console.error('Error fetching property details:', error);
    if (error.name === 'CastError') {
      res.status(400).json({ message: "Invalid property ID format" });
    } else {
      res.status(500).json({ message: "Failed to fetch property details" });
    }
  }
};

const createProperty = async (req, res) => {
  let session;
  try {
    const {
      title,
      description,
      propertyType,
      dealType,
      location,
      price,
      phone,
      photo,
      email,
      totalSquareFeet,
    } = req.body;

    if (!title || !description || !location || !price || !email || !totalSquareFeet) {
      return res.status(400).json({ message: "All fields are required." });
    }

    session = await mongoose.startSession();
    session.startTransaction();

    const user = await User.findOne({ email }).session(session);
    if (!user) throw new Error("User not found");

    let photoUrl = null;
    if (photo) {
      const uploadResponse = await cloudinary.uploader.upload(photo);
      photoUrl = uploadResponse.url;
    }

    const newProperty = await Property.create({
      title,
      description,
      propertyType,
      dealType,
      location,
      price,
      totalSquareFeet,
      phone,
      photo: photoUrl,
      creator: user._id,
    });

    user.allProperties.push(newProperty._id);
    await user.save({ session });

    await session.commitTransaction();
    res.status(201).json({ message: "Property created successfully" });
  } catch (error) {
    console.error('Error creating property:', error);
    if (session) await session.abortTransaction();
    if (error.message === "User not found") {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(500).json({ message: "Failed to create property" });
    }
  } finally {
    if (session) session.endSession();
  }
};

const updateProperty = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      propertyType,
      dealType,
      location,
      price,
      phone,
      photo,
      totalSquareFeet,
    } = req.body;

    if (!title || !description || !location || !price || !totalSquareFeet) {
      return res.status(400).json({ message: "All fields are required." });
    }

    let photoUrl = photo;
    if (photo && photo.startsWith('data:')) {
      const uploadResponse = await cloudinary.uploader.upload(photo);
      photoUrl = uploadResponse.url;
    }

    const updatedProperty = await Property.findByIdAndUpdate(
      { _id: id },
      {
        title,
        description,
        propertyType,
        dealType,
        phone,
        location,
        price,
        photo: photoUrl,
        totalSquareFeet,
      },
      { new: true, runValidators: true }
    );

    if (!updatedProperty) {
      return res.status(404).json({ message: "Property not found" });
    }

    res.status(200).json({ message: "Property updated successfully", property: updatedProperty });
  } catch (error) {
    console.error('Error updating property:', error);
    if (error.name === 'ValidationError') {
      res.status(400).json({ message: "Invalid input data", errors: error.errors });
    } else if (error.name === 'CastError') {
      res.status(400).json({ message: "Invalid property ID format" });
    } else {
      res.status(500).json({ message: "Failed to update property" });
    }
  }
};

const deleteProperty = async (req, res) => {
  let session;
  try {
    const { id } = req.params;

    const propertyToDelete = await Property.findById(id).populate("creator");

    if (!propertyToDelete) {
      return res.status(404).json({ message: "Property not found" });
    }

    const imageUrl = propertyToDelete.photo;
    const publicId = imageUrl.split('/').slice(-1)[0].split('.')[0];

    session = await mongoose.startSession();
    session.startTransaction();

    await cloudinary.uploader.destroy(publicId);

    await propertyToDelete.deleteOne({ session });
    propertyToDelete.creator.allProperties.pull(propertyToDelete);
    await propertyToDelete.creator.save({ session });

    await session.commitTransaction();

    res.status(200).json({ message: "Property and image deleted successfully" });
  } catch (error) {
    console.error('Error deleting property:', error);
    if (session) await session.abortTransaction();
    res.status(500).json({ message: "Failed to delete property" });
  } finally {
    if (session) session.endSession();
  }
};

const getTopLatestProperties = async (req, res) => {
  try {
    const latestProperties = await Property.find()
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();
    
    if (latestProperties.length === 0) {
      return res.status(404).json({ message: 'No properties found' });
    }

    const totalPropertiesCount = await Property.countDocuments();
    const commercialPropertiesCount = await Property.countDocuments({ propertyType: 'commercial' });
    const apartmentPropertiesCount = await Property.countDocuments({ propertyType: 'apartment' });

    res.status(200).json({
      properties: latestProperties,
      totalPropertiesCount,
      commercialPropertiesCount,
      apartmentPropertiesCount
    });
  } catch (error) {
    console.error('Error fetching latest properties:', error);
    res.status(500).json({ message: 'Failed to fetch latest properties' });
  }
};

export {
  getAllProperties,
  getPropertyDetail,
  createProperty,
  updateProperty,
  deleteProperty,
  getTopLatestProperties,
};