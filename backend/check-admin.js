import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

// Load environment variables
dotenv.config();

// Configure __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import the User model schema to ensure it's registered
import './models/User.js';

const User = mongoose.model('User');

const checkAdminUser = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('MongoDB connected successfully');

    // Find the admin user
    const adminEmail = 'admin@example.com';
    const testPassword = 'admin123';
    
    const admin = await User.findOne({ email: adminEmail });
    
    if (!admin) {
      console.log(`No admin user found with email: ${adminEmail}`);
      console.log('Creating a new admin user...');
      
      // Create a new admin user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(testPassword, salt);
      
      const newAdmin = new User({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      
      await newAdmin.save();
      console.log('New admin user created with:');
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${testPassword}`);
      
    } else {
      console.log('Admin user found:');
      console.log(`ID: ${admin._id}`);
      console.log(`Name: ${admin.name}`);
      console.log(`Email: ${admin.email}`);
      console.log(`Role: ${admin.role}`);
      
      // Check if the password matches
      const isMatch = await bcrypt.compare(testPassword, admin.password);
      
      if (isMatch) {
        console.log('Test password is correct. You can login with:');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${testPassword}`);
      } else {
        console.log('Test password does not match!');
        console.log('Updating password to the test password...');
        
        // Update the password
        const salt = await bcrypt.genSalt(10);
        admin.password = await bcrypt.hash(testPassword, salt);
        await admin.save();
        
        console.log('Password updated. You can now login with:');
        console.log(`Email: ${adminEmail}`);
        console.log(`Password: ${testPassword}`);
      }
    }

  } catch (error) {
    console.error('Error checking admin user:', error);
  } finally {
    // Close the database connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

// Run the check
checkAdminUser(); 