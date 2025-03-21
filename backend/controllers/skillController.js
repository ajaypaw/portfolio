import Skill from '../models/Skill.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @route   GET /api/skills
// @desc    Get all skills
// @access  Public
export const getSkills = async (req, res) => {
  try {
    const skills = await Skill.find().sort({ category: 1, name: 1 });
    res.json(skills);
  } catch (err) {
    console.error('Error fetching skills:', err);
    res.status(500).json({ msg: 'Error fetching skills' });
  }
};

// @route   GET /api/skills/:id
// @desc    Get a single skill
// @access  Public
export const getSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ msg: 'Skill not found' });
    }
    res.json(skill);
  } catch (err) {
    console.error('Error fetching skill:', err);
    res.status(500).json({ msg: 'Error fetching skill' });
  }
};

// @route   POST /api/skills
// @desc    Create a new skill
// @access  Private/Admin
export const createSkill = async (req, res) => {
  try {
    const { name, category, proficiency, level, icon } = req.body;

    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({ msg: 'Please provide name and category' });
    }
    
    // Use either proficiency or level, preferring proficiency
    const skillLevel = proficiency !== undefined ? proficiency : (level !== undefined ? level : 0);

    // Create new skill
    const skill = new Skill({
      name,
      category,
      proficiency: skillLevel,
      icon
    });

    await skill.save();
    res.status(201).json(skill);
  } catch (err) {
    console.error('Error creating skill:', err);
    res.status(500).json({ msg: 'Error creating skill' });
  }
};

// @route   PUT /api/skills/:id
// @desc    Update a skill
// @access  Private/Admin
export const updateSkill = async (req, res) => {
  try {
    const { name, category, proficiency, level, icon } = req.body;

    // Find skill
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ msg: 'Skill not found' });
    }

    // Update fields
    skill.name = name || skill.name;
    skill.category = category || skill.category;
    
    // Use either proficiency or level, preferring proficiency
    if (proficiency !== undefined) {
      skill.proficiency = proficiency;
    } else if (level !== undefined) {
      skill.proficiency = level;
    }
    
    skill.icon = icon || skill.icon;

    await skill.save();
    res.json(skill);
  } catch (err) {
    console.error('Error updating skill:', err);
    res.status(500).json({ msg: 'Error updating skill' });
  }
};

// @route   DELETE /api/skills/:id
// @desc    Delete a skill
// @access  Private/Admin
export const deleteSkill = async (req, res) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) {
      return res.status(404).json({ msg: 'Skill not found' });
    }

    await skill.deleteOne();
    res.json({ msg: 'Skill removed' });
  } catch (err) {
    console.error('Error deleting skill:', err);
    res.status(500).json({ msg: 'Error deleting skill' });
  }
}; 