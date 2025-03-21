import express from 'express';
import multer from 'multer';
import { auth, adminAuth } from '../middleware/auth.js';
import {
  getBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  togglePublishedStatus
} from '../controllers/blogController.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('Created uploads directory at:', uploadsDir);
}

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log('Uploading file to:', uploadsDir);
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'blog-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // Increased to 10MB limit
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
router.get('/', getBlogPosts);
router.get('/:id', getBlogPostById);

// Protected routes (admin only)
router.post('/', [auth, adminAuth, upload.single('coverImage')], createBlogPost);
router.post('/test', [auth, adminAuth], (req, res) => {
  console.log('Test blog creation received:', req.body);
  try {
    // Log the request details
    console.log('Headers:', req.headers);
    console.log('Content-Type:', req.headers['content-type']);
    console.log('Body keys:', Object.keys(req.body));
    
    if (!req.body.title || !req.body.content || !req.body.excerpt || !req.body.category) {
      return res.status(400).json({
        success: false,
        msg: 'Missing required fields',
        received: {
          title: !!req.body.title,
          excerpt: !!req.body.excerpt,
          content: !!req.body.content,
          category: !!req.body.category,
          tags: !!req.body.tags,
        }
      });
    }
    
    // Return success
    res.json({
      success: true,
      message: 'Test blog submission successful',
      receivedData: {
        title: req.body.title,
        contentLength: req.body.content.length,
        bodyKeys: Object.keys(req.body)
      }
    });
  } catch (err) {
    console.error('Error in test endpoint:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
router.put('/:id', [auth, adminAuth, upload.single('coverImage')], updateBlogPost);
router.delete('/:id', [auth, adminAuth], deleteBlogPost);
router.patch('/:id/publish', [auth, adminAuth], togglePublishedStatus);

export default router; 