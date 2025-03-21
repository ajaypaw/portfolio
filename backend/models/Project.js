import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  featured: {
    type: Boolean,
    default: false
  },
  technologiesUsed: [{
    type: String,
    trim: true
  }],
  githubLink: {
    type: String,
    trim: true
  },
  demoLink: {
    type: String,
    trim: true
  },
  image: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Update the updatedAt field on save
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Project', projectSchema); 