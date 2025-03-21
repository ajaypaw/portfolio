import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Define user schema to match your User model
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  profilePic: String,
  phone: String,
  location: String,
  website: String,
  bio: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a temporary model for direct manipulation
const User = mongoose.model('User', userSchema);

const fixAdminPassword = async () => {
  try {
    // Find admin user
    console.log('Looking for admin user...');
    const adminUser = await User.findOne({ email: 'admin@example.com' });
    
    if (!adminUser) {
      console.error('Admin user not found!');
      process.exit(1);
    }
    
    console.log('Admin user found:', adminUser.email);
    
    // Generate new password hash directly
    const salt = await bcrypt.genSalt(10);
    const newPasswordHash = await bcrypt.hash('admin123', salt);
    
    // Update user directly in database
    console.log('Updating password directly in database...');
    const result = await User.updateOne(
      { _id: adminUser._id },
      { $set: { password: newPasswordHash } }
    );
    
    if (result.modifiedCount === 1) {
      console.log('✅ Password updated successfully!');
    } else {
      console.log('⚠️ No document was modified.');
    }
    
    const verifyUser = await User.findOne({ _id: adminUser._id });
    console.log('Updated password hash:', verifyUser.password);

  } catch (error) {
    console.error('Error updating password:', error);
  } finally {
    // Close the MongoDB connection
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  }
};

// Run the password fix
fixAdminPassword(); 