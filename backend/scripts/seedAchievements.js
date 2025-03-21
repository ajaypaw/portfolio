import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Achievement from '../models/Achievement.js';

dotenv.config();

const achievements = [
  {
    title: 'Best Healthcare Innovation Award',
    description: 'Awarded for developing AI Health Guardian, an innovative solution for predictive healthcare monitoring.',
    category: 'Award',
    date: new Date('2023-12-15'),
    image: '/uploads/healthcare-award.jpg'
  },
  {
    title: 'AWS Certified Solutions Architect',
    description: 'Professional certification for designing distributed applications and systems on AWS platform.',
    category: 'Certification',
    date: new Date('2023-10-20'),
    image: '/uploads/aws-cert.jpg'
  },
  {
    title: 'TensorFlow Developer Certificate',
    description: 'Google certification for demonstrating practical machine learning skills with TensorFlow.',
    category: 'Certification',
    date: new Date('2023-09-05'),
    image: '/uploads/tensorflow-cert.jpg'
  },
  {
    title: 'Hackathon Winner - Smart City Solutions',
    description: 'First place in the Smart City Hackathon for developing an innovative IoT-based traffic management system.',
    category: 'Award',
    date: new Date('2023-08-15'),
    image: '/uploads/hackathon-winner.jpg'
  },
  {
    title: 'React Native Specialist',
    description: 'Advanced certification in mobile app development using React Native and related technologies.',
    category: 'Certification',
    date: new Date('2023-07-10'),
    image: '/uploads/react-native-cert.jpg'
  },
  {
    title: 'Outstanding Open Source Contributor',
    description: 'Recognized for significant contributions to open-source projects in the healthcare and IoT domains.',
    category: 'Award',
    date: new Date('2023-06-01'),
    image: '/uploads/opensource-award.jpg'
  }
];

const seedAchievements = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('Connected to MongoDB');

    // Clear existing achievements
    await Achievement.deleteMany({});
    console.log('Cleared existing achievements');

    // Insert new achievements
    const insertedAchievements = await Achievement.insertMany(achievements);
    console.log(`Successfully inserted ${insertedAchievements.length} achievements`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding achievements:', error);
    process.exit(1);
  }
};

seedAchievements(); 