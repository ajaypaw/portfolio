import Project from '../models/Project.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json(projects);
  } catch (err) {
    console.error('Error fetching projects:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get a project by ID
// @route   GET /api/projects/:id
// @access  Public
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    
    res.json(project);
  } catch (err) {
    console.error('Error fetching project:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Create a new project
// @route   POST /api/projects
// @access  Private
export const createProject = async (req, res) => {
  try {
    const { title, category, description, featured, technologiesUsed, githubLink, demoLink } = req.body;
    
    // Create new project
    const newProject = new Project({
      title,
      category,
      description,
      featured: featured || false,
      technologiesUsed,
      githubLink,
      demoLink,
      image: req.file ? `/uploads/${req.file.filename}` : ''
    });
    
    const project = await newProject.save();
    res.status(201).json(project);
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Update a project
// @route   PUT /api/projects/:id
// @access  Private
export const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    
    // Update fields
    const { title, category, description, featured, technologiesUsed, githubLink, demoLink } = req.body;
    
    if (title) project.title = title;
    if (category) project.category = category;
    if (description) project.description = description;
    if (featured !== undefined) project.featured = featured;
    if (technologiesUsed) project.technologiesUsed = technologiesUsed;
    if (githubLink) project.githubLink = githubLink;
    if (demoLink) project.demoLink = demoLink;
    
    // Handle image update if provided
    if (req.file) {
      // Delete old image if exists
      if (project.image) {
        const oldImagePath = path.join(__dirname, '..', project.image);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      project.image = `/uploads/${req.file.filename}`;
    }
    
    await project.save();
    res.json(project);
  } catch (err) {
    console.error('Error updating project:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Delete a project
// @route   DELETE /api/projects/:id
// @access  Private
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    
    if (!project) {
      return res.status(404).json({ msg: 'Project not found' });
    }
    
    // Delete image if exists
    if (project.image) {
      const imagePath = path.join(__dirname, '..', project.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await Project.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Project removed' });
  } catch (err) {
    console.error('Error deleting project:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Project not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
}; 