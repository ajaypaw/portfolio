import mongoose from 'mongoose';

const achievementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Achievement title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Achievement description is required'],
    trim: true,
  },
  category: {
    type: String,
    required: [true, 'Achievement category is required'],
    enum: ['Award', 'Certification', 'Medal', 'Other'],
    default: 'Other'
  },
  date: {
    type: Date,
    required: [true, 'Achievement date is required'],
    default: Date.now
  },
  image: {
    type: String,
    required: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
achievementSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('Achievement', achievementSchema); 