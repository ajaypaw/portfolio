import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

const resetAdminPassword = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Find admin user
    const adminEmail = 'admin@example.com';
    const admin = await User.findOne({ email: adminEmail });

    if (!admin) {
      console.error('Admin user not found with email:', adminEmail);
      process.exit(1);
    }

    // Generate new password hash
    const salt = await bcrypt.genSalt(10);
    const newPassword = 'admin123';
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update admin password
    admin.password = hashedPassword;
    await admin.save();

    console.log('✅ Admin password successfully reset to:', newPassword);
    console.log('You can now log in with:');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${newPassword}`);

  } catch (error) {
    console.error('Error resetting admin password:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
};

// Execute the function
resetAdminPassword(); 