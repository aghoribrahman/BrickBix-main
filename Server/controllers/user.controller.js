import User from "../mongodb/models/user.js";


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).lean();


    res.status(200).json(users);
  } catch (error) {
    console.error('Error in getAllUsers:', error);
    res.status(500).json({ message: 'An error occurred while fetching users' });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, avatar } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    const userExists = await User.findOne({ email }).lean();

    if (userExists) return res.status(200).json(userExists);

    const newUser = await User.create({
      name,
      email,
      avatar,
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Error in createUser:', error);
    res.status(500).json({ message: 'An error occurred while creating the user' });
  }
};


const updateUser = async (req, res) => {
  try {
    const { name, email, phoneNumber, workLocation, reraNumber } = req.body;


    if (!email) {
      console.log('Email is required for updating user details');
      return res.status(400).json({ message: 'Email is required' });
    }


    const userExists = await User.findOne({ email }).lean();


    if (userExists) {
      const updatedUser = await User.findByIdAndUpdate(userExists._id, {
        name,
        phoneNumber,
        workLocation,
        reraNumber,
      }, { new: true });


      console.log(`User updated successfully`);
      return res.status(200).json(updatedUser);
    } else {
      console.log(`User with email: ${email} does not exist`);
      return res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error('Error in updateUser:', error);
    res.status(500).json({ message: 'An error occurred while updating the user' });
  }
};


const getUserInfoByID = async (req, res) => {
  try {
    const { id } = req.params;


    if (!id) {
      return res.status(400).json({ message: 'User ID is required' });
    }


    const user = await User.findOne({ _id: id }).populate("allProperties").lean();


    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error('Error in getUserInfoByID:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid user ID format' });
    }
    res.status(500).json({ message: 'An error occurred while fetching user information' });
  }
};


export { getAllUsers, createUser, getUserInfoByID, updateUser };

