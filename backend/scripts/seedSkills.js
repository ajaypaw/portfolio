import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Skill from '../models/Skill.js';

dotenv.config();

const skills = [
  {
    name: 'React.js',
    category: 'Frontend',
    proficiency: 90,
    icon: '⚛️'
  },
  {
    name: 'Node.js',
    category: 'Backend',
    proficiency: 85,
    icon: '🟢'
  },
  {
    name: 'MongoDB',
    category: 'Database',
    proficiency: 80,
    icon: '🍃'
  },
  {
    name: 'TensorFlow',
    category: 'Other',
    proficiency: 75,
    icon: '🧠'
  },
  {
    name: 'Docker',
    category: 'DevOps',
    proficiency: 70,
    icon: '🐳'
  },
  {
    name: 'React Native',
    category: 'Mobile',
    proficiency: 85,
    icon: '📱'
  }
];

const seedSkills = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('Connected to MongoDB');

    // Clear existing skills
    await Skill.deleteMany({});
    console.log('Cleared existing skills');

    // Insert new skills
    const insertedSkills = await Skill.insertMany(skills);
    console.log(`Successfully inserted ${insertedSkills.length} skills`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding skills:', error);
    process.exit(1);
  }
};

seedSkills(); 