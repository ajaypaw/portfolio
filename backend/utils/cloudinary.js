import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if Cloudinary is configured
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                              process.env.CLOUDINARY_API_KEY && 
                              process.env.CLOUDINARY_API_SECRET;

if (isCloudinaryConfigured) {
  // Configure Cloudinary
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
}

// Upload file to Cloudinary or local storage
export const uploadToCloudinary = async (file) => {
  try {
    if (isCloudinaryConfigured) {
      // Upload to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'portfolio',
        resource_type: 'auto'
      });

      // Delete local file after successful upload
      fs.unlinkSync(file.path);
      return result;
    } else {
      // Fallback to local storage
      const uploadsDir = path.join(__dirname, '../uploads');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }

      const fileName = `${Date.now()}-${file.originalname}`;
      const filePath = path.join(uploadsDir, fileName);
      
      // Move file to uploads directory
      fs.renameSync(file.path, filePath);

      // Return local file URL
      return {
        secure_url: `/uploads/${fileName}`,
        public_id: fileName
      };
    }
  } catch (error) {
    // Clean up local file if upload fails
    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    throw new Error('Error uploading file');
  }
}; 