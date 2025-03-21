import express from 'express';
import { initAdmin, login, getCurrentUser, updateProfile, changePassword } from '../controllers/authController.js';
import auth from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

// Configure __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
  } 
});

// @route   POST /api/init-admin
// @desc    Initialize admin user (first time only)
// @access  Public
router.post('/init-admin', initAdmin);

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/auth/login', login);

// @route   GET /api/auth/user
// @desc    Get current user
// @access  Private
router.get('/auth/user', auth, getCurrentUser);

// @route   PUT /api/profile
// @desc    Update profile
// @access  Private
router.put('/profile', auth, upload.single('avatarImage'), updateProfile);

// @route   PUT /api/profile/password
// @desc    Change password
// @access  Private
router.put('/profile/password', auth, changePassword);

export default router; 