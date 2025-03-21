import User from '../models/User.js';
import bcrypt from 'bcryptjs';

/**
 * Initialize an admin user for development purposes
 * This should ONLY be used in development environment
 */
export const initAdminUser = async () => {
  if (process.env.NODE_ENV !== 'development') {
    console.warn('initAdminUser should only be called in development environment');
    return null;
  }

  try {
    // Check if admin user already exists
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    let admin = await User.findOne({ email: adminEmail });

    if (admin) {
      console.log('Admin user already exists:', adminEmail);
      return admin;
    }

    // Create default admin password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', salt);

    // Create new admin user
    admin = new User({
      name: 'Admin User',
      email: adminEmail,
      password: hashedPassword,
      role: 'admin'
    });

    await admin.save();
    console.log('Admin user created:', adminEmail);
    return admin;
  } catch (error) {
    console.error('Error initializing admin user:', error);
    return null;
  }
};

/**
 * Get admin credentials for development
 * This is useful for displaying login info in development mode
 */
export const getDevAdminCredentials = () => {
  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'admin123'
  };
}; 