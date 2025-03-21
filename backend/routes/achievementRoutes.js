import express from 'express';
import multer from 'multer';
import { auth, adminAuth } from '../middleware/auth.js';
import {
  getAchievements,
  getAchievement,
  createAchievement,
  updateAchievement,
  deleteAchievement
} from '../controllers/achievementController.js';

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
router.get('/', getAchievements);
router.get('/:id', getAchievement);

// Protected routes (admin only)
router.post('/', [auth, adminAuth, upload.single('image')], createAchievement);
router.put('/:id', [auth, adminAuth, upload.single('image')], updateAchievement);
router.delete('/:id', [auth, adminAuth], deleteAchievement);

export default router; 