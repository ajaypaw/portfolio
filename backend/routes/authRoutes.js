import express from 'express';
import { 
  initAdmin, 
  login, 
  getCurrentUser, 
  updateProfile, 
  changePassword 
} from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';
import multer from 'multer';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Not an image! Please upload an image.'), false);
    }
  }
});

// Public routes
router.post('/init-admin', initAdmin);
router.post('/login', login);

// Protected routes
router.get('/user', auth, getCurrentUser);
router.put('/profile', auth, upload.single('profilePic'), updateProfile);
router.put('/profile/password', auth, changePassword);

export default router; 