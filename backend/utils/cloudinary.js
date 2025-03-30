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
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true // Always use HTTPS
  });
  console.log('Cloudinary configured successfully');
} else {
  console.warn('Cloudinary not configured. Using local file storage instead.');
}

// Upload file to Cloudinary or local storage
export const uploadToCloudinary = async (file) => {
  try {
    if (!file) {
      throw new Error('No file provided');
    }

    if (isCloudinaryConfigured) {
      // Upload to Cloudinary with optimizations
      const result = await cloudinary.uploader.upload(file.path, {
        folder: 'portfolio',
        resource_type: 'auto',
        quality: 'auto',
        fetch_format: 'auto',
        responsive: true,
        transformation: [
          { width: 1200, crop: 'limit' }, // Limit max width
        ]
      });

      // Delete local file after successful upload
      fs.unlinkSync(file.path);
      
      console.log(`File uploaded to Cloudinary: ${result.public_id}`);
      
      return {
        secure_url: result.secure_url,
        public_id: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        provider: 'cloudinary'
      };
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

      console.log(`File stored locally: ${fileName}`);
      
      // Return local file URL
      return {
        secure_url: `/uploads/${fileName}`,
        public_id: fileName,
        provider: 'local'
      };
    }
  } catch (error) {
    // Clean up local file if upload fails
    if (file && file.path && fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }
    console.error('Error uploading file:', error);
    throw new Error(`Error uploading file: ${error.message}`);
  }
};

// Delete file from Cloudinary or local storage
export const deleteFromCloudinary = async (publicId, provider = 'cloudinary') => {
  try {
    if (!publicId) return;
    
    if (provider === 'cloudinary' && isCloudinaryConfigured) {
      // Delete from Cloudinary
      await cloudinary.uploader.destroy(publicId);
      console.log(`File deleted from Cloudinary: ${publicId}`);
    } else if (provider === 'local') {
      // Delete from local storage
      const filePath = path.join(__dirname, '../uploads', path.basename(publicId));
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`File deleted locally: ${publicId}`);
      }
    }
    return true;
  } catch (error) {
    console.error('Error deleting file:', error);
    return false;
  }
}; 
