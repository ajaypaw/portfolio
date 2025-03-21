import express from 'express';
import multer from 'multer';
import { auth, adminAuth } from '../middleware/auth.js';
import {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill
} from '../controllers/skillController.js';

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
router.get('/', getSkills);
router.get('/:id', getSkill);

// Protected routes (admin only)
router.post('/', [auth, adminAuth], createSkill);
router.put('/:id', [auth, adminAuth], updateSkill);
router.delete('/:id', [auth, adminAuth], deleteSkill);

export default router; 