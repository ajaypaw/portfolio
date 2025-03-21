import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
} from '../controllers/projectController.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Public routes
router.get('/', getProjects);
router.get('/:id', getProjectById);

// Protected routes (admin only)
router.post('/', [auth, adminAuth, upload.single('image')], createProject);
router.put('/:id', [auth, adminAuth, upload.single('image')], updateProject);
router.delete('/:id', [auth, adminAuth], deleteProject);

export default router; 