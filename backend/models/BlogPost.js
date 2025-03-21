import mongoose from 'mongoose';

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: String, required: true },
  coverImage: { type: String },
  category: { type: String, required: true },
  tags: [{ type: String }],
  published: { type: Boolean, default: false },
  publishedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Update the updatedAt field on save
blogPostSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('BlogPost', blogPostSchema); 