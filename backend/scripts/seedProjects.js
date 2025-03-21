import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Project from '../models/Project.js';

dotenv.config();

const projects = [
  {
    title: 'AI Health Guardian',
    description: 'A comprehensive healthcare monitoring system using AI and IoT sensors for predictive health analysis.',
    category: 'Healthcare',
    featured: true,
    technologiesUsed: ['React Native', 'TensorFlow', 'Node.js', 'MongoDB', 'AWS'],
    githubLink: 'https://github.com/yourusername/ai-health-guardian',
    demoLink: 'https://ai-health-guardian.demo.com',
    image: '/uploads/health-guardian.jpg'
  },
  {
    title: 'Weather Forecast App',
    description: 'Real-time weather application providing detailed forecasts and severe weather alerts with location-based services.',
    category: 'Mobile App',
    featured: true,
    technologiesUsed: ['React Native', 'Node.js', 'Express', 'OpenWeatherAPI'],
    githubLink: 'https://github.com/yourusername/weather-app',
    demoLink: 'https://weather-app.demo.com',
    image: '/uploads/weather-app.jpg'
  },
  {
    title: 'Smart Home IoT Hub',
    description: 'Centralized IoT platform for managing smart home devices with automation capabilities and energy monitoring.',
    category: 'IoT',
    featured: true,
    technologiesUsed: ['React', 'Node.js', 'MQTT', 'MongoDB', 'ESP32'],
    githubLink: 'https://github.com/yourusername/smart-home-hub',
    demoLink: 'https://smart-home.demo.com',
    image: '/uploads/smart-home.jpg'
  },
  {
    title: 'E-Commerce Platform',
    description: 'Full-featured e-commerce solution with real-time inventory management and payment processing.',
    category: 'Web App',
    featured: false,
    technologiesUsed: ['React', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
    githubLink: 'https://github.com/yourusername/ecommerce-platform',
    demoLink: 'https://ecommerce.demo.com',
    image: '/uploads/ecommerce.jpg'
  },
  {
    title: 'Task Management System',
    description: 'Collaborative project management tool with real-time updates and team communication features.',
    category: 'Web App',
    featured: false,
    technologiesUsed: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    githubLink: 'https://github.com/yourusername/task-manager',
    demoLink: 'https://task-manager.demo.com',
    image: '/uploads/task-manager.jpg'
  },
  {
    title: 'Fitness Tracking App',
    description: 'Mobile application for tracking workouts, nutrition, and health metrics with AI-powered recommendations.',
    category: 'Mobile App',
    featured: false,
    technologiesUsed: ['React Native', 'Node.js', 'TensorFlow', 'MongoDB'],
    githubLink: 'https://github.com/yourusername/fitness-tracker',
    demoLink: 'https://fitness-tracker.demo.com',
    image: '/uploads/fitness-tracker.jpg'
  }
];

const seedProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('Connected to MongoDB');

    // Clear existing projects
    await Project.deleteMany({});
    console.log('Cleared existing projects');

    // Insert new projects
    const insertedProjects = await Project.insertMany(projects);
    console.log(`Successfully inserted ${insertedProjects.length} projects`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding projects:', error);
    process.exit(1);
  }
};

seedProjects(); 