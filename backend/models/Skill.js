import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Skill category is required'],
    enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Other', 'Machine Learning'],
    default: 'Other'
  },
  proficiency: {
    type: Number,
    required: [true, 'Proficiency level is required'],
    min: [0, 'Proficiency cannot be less than 0'],
    max: [100, 'Proficiency cannot be more than 100'],
    default: 0
  },
  icon: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add a virtual property for backward compatibility
skillSchema.virtual('level').get(function() {
  return this.proficiency;
});

// Handle level field in input data
skillSchema.pre('save', function(next) {
  if (this.isModified('level') && !this.isModified('proficiency')) {
    this.proficiency = this.level;
  }
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Skill', skillSchema); 