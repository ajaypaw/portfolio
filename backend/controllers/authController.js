import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Initialize admin user (first time only)
// @route   POST /api/init-admin
// @access  Public
export const initAdmin = async (req, res) => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ role: 'admin' });
    if (adminExists) {
      return res.status(400).json({ msg: 'Admin user already exists' });
    }

    const { email, password, name } = req.body;

    // Validate input
    if (!email || !password || !name) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create admin user
    const admin = new User({
      email,
      password: hashedPassword,
      name,
      role: 'admin'
    });

    await admin.save();

    // Create token
    const token = jwt.sign(
      { user: { id: admin._id, role: admin.role } },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      token,
      user: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (err) {
    console.error('Error initializing admin:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    console.log('Login attempt received:', {
      body: req.body,
      hasEmail: !!req.body.email,
      hasPassword: !!req.body.password,
      contentType: req.headers['content-type']
    });
    
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      console.log('Login failed: Missing email or password');
      return res.status(400).json({ msg: 'Please provide email and password' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Login failed: User not found with email:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Verify password
    console.log('Comparing password for user:', email);
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Login failed: Password does not match for user:', email);
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { user: { id: user._id, role: user.role } },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '24h' }
    );

    console.log('Login successful for user:', email);
    
    // Return user data and token
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get current user
// @route   GET /api/auth/user
// @access  Private
export const getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error getting current user:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    console.log('Updating profile, received:', req.body);
    const { name, email, phone, location, website, bio } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Check if trying to change email and if it already exists
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email, _id: { $ne: user._id } });
      if (emailExists) {
        return res.status(400).json({ 
          msg: 'Email already in use by another account',
          field: 'email' 
        });
      }
    }

    // Prepare updates object
    const updates = {};
    if (name) updates.name = name;
    if (email) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (location !== undefined) updates.location = location;
    if (website !== undefined) updates.website = website;
    if (bio !== undefined) updates.bio = bio;

    // Handle profile picture upload
    if (req.file) {
      updates.profilePic = `/uploads/${req.file.filename}`;
    }

    try {
      // Use findByIdAndUpdate to apply updates
      const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $set: updates },
        { new: true, runValidators: true }
      ).select('-password');

      return res.json(updatedUser);
    } catch (updateErr) {
      // Handle duplicate key error specifically
      if (updateErr.code === 11000 && updateErr.keyPattern && updateErr.keyPattern.email) {
        return res.status(400).json({
          msg: 'Email already in use by another account',
          field: 'email'
        });
      }
      throw updateErr; // Re-throw for general error handling
    }
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Change password
// @route   PUT /api/profile/password
// @access  Private
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Current password is incorrect' });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();

    res.json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error('Error changing password:', err);
    res.status(500).json({ msg: 'Server error' });
  }
}; 