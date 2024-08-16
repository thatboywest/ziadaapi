const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const User = require('../models/User');
const cloudinary = require('../config/cloudinary');

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const signup = async (req, res) => {
  try {
    const { name, email, password, phone, gender, dob, jobTitle, jobDescription, county, town, role, companyName, companyDetails } = req.body;
    const profilePhoto = req.files['profilePhoto'] ? req.files['profilePhoto'][0].path : null;
    const backgroundPhoto = req.files['backgroundPhoto'] ? req.files['backgroundPhoto'][0].path : null;

    const hashedPassword = await bcrypt.hash(password, 10);

    let profilePhotoUrl = '';
    let backgroundPhotoUrl = '';

    if (profilePhoto) {
      const result = await cloudinary.uploader.upload(profilePhoto, { folder: 'profile_photos' });
      profilePhotoUrl = result.secure_url;
    }

    if (backgroundPhoto) {
      const result = await cloudinary.uploader.upload(backgroundPhoto, { folder: 'background_photos' });
      backgroundPhotoUrl = result.secure_url;
    }

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phone, 
      profilePhoto: profilePhotoUrl,
      backgroundPhoto: backgroundPhotoUrl,
      gender,
      dob,
      jobTitle,
      jobDescription,
      county,
      town,
      role,
      companyName: role === 'employer' ? companyName : undefined,
      companyDetails: role === 'employer' ? companyDetails : undefined,
    });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully!', data: newUser });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const updateUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    const { name, email, password, phone, gender, dob, jobTitle, jobDescription, county, town, role, companyName, companyDetails } = req.body;
    const profilePhoto = req.files['profilePhoto'] ? req.files['profilePhoto'][0].path : null;
    const backgroundPhoto = req.files['backgroundPhoto'] ? req.files['backgroundPhoto'][0].path : null;

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    let profilePhotoUrl;
    let backgroundPhotoUrl;

    if (profilePhoto) {
      const result = await cloudinary.uploader.upload(profilePhoto, { folder: 'profile_photos' });
      profilePhotoUrl = result.secure_url;
    }

    if (backgroundPhoto) {
      const result = await cloudinary.uploader.upload(backgroundPhoto, { folder: 'background_photos' });
      backgroundPhotoUrl = result.secure_url;
    }

    const updatedUser = await User.findByIdAndUpdate(userId, {
      name,
      email,
      password: hashedPassword || undefined,
      phone,  
      profilePhoto: profilePhotoUrl || undefined,
      backgroundPhoto: backgroundPhotoUrl || undefined,
      gender,
      dob,
      jobTitle,
      jobDescription,
      county,
      town,
      role,
      companyName: role === 'employer' ? companyName : undefined,
      companyDetails: role === 'employer' ? companyDetails : undefined,
    }, { new: true });

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User updated successfully!', data: updatedUser });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ data: user });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    if (!isValidObjectId(userId)) {
      return res.status(400).json({ error: 'Invalid User ID' });
    }

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ message: 'User deleted successfully!' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let userProfile = {
      name: user.name,
      email: user.email,
      profilePhoto: user.profilePhoto,
      backgroundPhoto: user.backgroundPhoto,
      gender: user.gender,
      dob: user.dob,
      role: user.role,
      jobTitle: user.jobTitle,
      jobDescription: user.jobDescription,
      county: user.county,
      town: user.town,
      phone:user.phone
    };

    // Add role-specific details
    if (user.role === 'employer') {
      userProfile = {
        ...userProfile,
        companyName: user.companyName,
        companyDetails: user.companyDetails,
      };
    }

    res.status(200).json({ data: userProfile });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee' }).select('-password -companyName -companyDetails');

    if (!employees.length) {
      return res.status(404).json({ error: 'No employees found' });
    }

    res.status(200).json({ data: employees });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { signup, getUserById, updateUserById, deleteUserById, getUserProfile, getAllEmployees };
