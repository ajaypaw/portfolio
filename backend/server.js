import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { initAdminUser } from './utils/devHelper.js';

// Import models (to register with MongoDB)
import './models/User.js';
import './models/Project.js';
import './models/Skill.js';
import './models/Achievement.js';
import './models/BlogPost.js';
import './models/ContactSettings.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import achievementRoutes from './routes/achievementRoutes.js';
import contactRoutes from './routes/contact.js';
import blogRoutes from './routes/blogRoutes.js';

// Initialize environment variables
dotenv.config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Configure __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'http://localhost:5176',
    'http://localhost:5177',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware to log all requests
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request body:', JSON.stringify(req.body));
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Debug route to test API functionality
app.get('/api/debug', (req, res) => {
  res.json({
    message: 'API is working correctly',
    timestamp: new Date().toISOString(),
    routes: {
      auth: ['/auth/*', '/api/auth/*'],
      projects: ['/projects/*', '/api/projects/*'],
      skills: ['/skills/*', '/api/skills/*'],
      achievements: ['/achievements/*', '/api/achievements/*'],
      contact: ['/contact/*', '/api/contact/*'],
      blog: ['/blog/*', '/api/blog/*']
    }
  });
});

// Add the same debug endpoint without /api prefix
app.get('/debug', (req, res) => {
  res.json({
    message: 'API is working correctly',
    timestamp: new Date().toISOString(),
    routes: {
      auth: ['/auth/*', '/api/auth/*'],
      projects: ['/projects/*', '/api/projects/*'],
      skills: ['/skills/*', '/api/skills/*'],
      achievements: ['/achievements/*', '/api/achievements/*'],
      contact: ['/contact/*', '/api/contact/*'],
      blog: ['/blog/*', '/api/blog/*']
    }
  });
});

// Special debug route for auth endpoints
app.get('/api/auth/debug', (req, res) => {
  res.json({
    message: 'Auth routes are accessible',
    endpoints: {
      login: ['/auth/login [POST]', '/api/auth/login [POST]'],
      user: ['/auth/user [GET]', '/api/auth/user [GET]'],
      profile: ['/auth/profile [PUT]', '/api/auth/profile [PUT]'],
      password: ['/auth/profile/password [PUT]', '/api/auth/profile/password [PUT]'],
      initAdmin: ['/init-admin [POST]', '/api/init-admin [POST]']
    }
  });
});

// Add auth debug endpoint without /api prefix
app.get('/auth/debug', (req, res) => {
  res.json({
    message: 'Auth routes are accessible',
    endpoints: {
      login: ['/auth/login [POST]', '/api/auth/login [POST]'],
      user: ['/auth/user [GET]', '/api/auth/user [GET]'],
      profile: ['/auth/profile [PUT]', '/api/auth/profile [PUT]'],
      password: ['/auth/profile/password [PUT]', '/api/auth/profile/password [PUT]'],
      initAdmin: ['/init-admin [POST]', '/api/init-admin [POST]']
    }
  });
});

// Emergency direct login endpoint for troubleshooting
app.post('/api/direct-login', async (req, res) => {
  try {
    console.log('Direct login attempt received:', {
      body: req.body,
      contentType: req.headers['content-type']
    });
    
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }
    
    // Dynamically import User model
    const User = mongoose.model('User');
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Verify password with bcrypt
    const bcrypt = await import('bcryptjs');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Create token with jsonwebtoken
    const jwt = await import('jsonwebtoken');
    const token = jwt.sign(
      { user: { id: user._id, role: user.role } },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '24h' }
    );
    
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
    console.error('Direct login error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Add same emergency login endpoint without /api prefix
app.post('/direct-login', async (req, res) => {
  try {
    console.log('Direct login attempt received (no /api prefix):', {
      body: req.body,
      contentType: req.headers['content-type']
    });
    
    const { email, password } = req.body;
    
    // Validate input
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please provide email and password' });
    }
    
    // Dynamically import User model
    const User = mongoose.model('User');
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Verify password with bcrypt
    const bcrypt = await import('bcryptjs');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }
    
    // Create token with jsonwebtoken
    const jwt = await import('jsonwebtoken');
    const token = jwt.sign(
      { user: { id: user._id, role: user.role } },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '24h' }
    );
    
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
    console.error('Direct login error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes - new standard endpoints without /api prefix
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/skills', skillRoutes);
app.use('/achievements', achievementRoutes);
app.use('/contact', contactRoutes);
app.use('/blog', blogRoutes);

// Routes - backward compatibility with /api prefix
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/blog', blogRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Server startup
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://ajaypawar113307:0wi6QMAeKa4G2tYI@cluster0.2za6y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    console.log('MongoDB connected');
    
    // Initialize admin user in development
    if (process.env.NODE_ENV === 'development') {
      await initAdminUser();
    }
    
    // Start the server
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API available at http://localhost:${PORT}`);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        // Try fallback port
        const fallbackPort = PORT + 1;
        console.log(`Port ${PORT} is in use, trying port ${fallbackPort}...`);
        app.listen(fallbackPort, () => {
          console.log(`Server running on fallback port ${fallbackPort}`);
          console.log(`API available at http://localhost:${fallbackPort}`);
        });
      } else {
        console.error('Server error:', err);
      }
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  });
