import Achievement from '../models/Achievement.js';
import { uploadToCloudinary } from '../utils/cloudinary.js';

// @desc    Get all achievements
// @route   GET /api/achievements
// @access  Public
export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().sort({ date: -1 });
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching achievements', error: error.message });
  }
};

// @desc    Get a single achievement
// @route   GET /api/achievements/:id
// @access  Public
export const getAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findById(req.params.id);
    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }
    res.status(200).json(achievement);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching achievement', error: error.message });
  }
};

// @desc    Create a new achievement
// @route   POST /api/achievements
// @access  Private/Admin
export const createAchievement = async (req, res) => {
  try {
    const { title, description, category, date } = req.body;
    let image = null;

    // Handle image upload if provided
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file);
      image = uploadResult.secure_url;
    }

    const achievement = await Achievement.create({
      title,
      description,
      category,
      date,
      image
    });

    res.status(201).json(achievement);
  } catch (error) {
    res.status(400).json({ message: 'Error creating achievement', error: error.message });
  }
};

// @desc    Update an achievement
// @route   PUT /api/achievements/:id
// @access  Private/Admin
export const updateAchievement = async (req, res) => {
  try {
    const { title, description, category, date } = req.body;
    let image = req.body.image; // Keep existing image by default

    // Handle image upload if new file is provided
    if (req.file) {
      const uploadResult = await uploadToCloudinary(req.file);
      image = uploadResult.secure_url;
    }

    const achievement = await Achievement.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        category,
        date,
        image
      },
      { new: true, runValidators: true }
    );

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    res.status(200).json(achievement);
  } catch (error) {
    res.status(400).json({ message: 'Error updating achievement', error: error.message });
  }
};

// @desc    Delete an achievement
// @route   DELETE /api/achievements/:id
// @access  Private/Admin
export const deleteAchievement = async (req, res) => {
  try {
    const achievement = await Achievement.findByIdAndDelete(req.params.id);

    if (!achievement) {
      return res.status(404).json({ message: 'Achievement not found' });
    }

    res.status(200).json({ message: 'Achievement deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting achievement', error: error.message });
  }
}; 