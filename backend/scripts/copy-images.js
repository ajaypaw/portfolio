import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceDir = path.join(__dirname, '../../src/assets/images');
const targetDir = path.join(__dirname, '../uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// List of images to copy
const images = [
  'ecommerce.jpg',
  'task-manager.jpg',
  'fitness-tracker.jpg',
  'health-guardian.jpg',
  'smart-home.jpg',
  'weather-app.jpg'
];

// Copy each image
images.forEach(image => {
  const sourcePath = path.join(sourceDir, image);
  const targetPath = path.join(targetDir, image);

  if (fs.existsSync(sourcePath)) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied ${image} to uploads directory`);
  } else {
    console.warn(`Warning: ${image} not found in assets directory`);
  }
});

console.log('Image copy process completed'); 