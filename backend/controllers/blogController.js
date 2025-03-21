import BlogPost from '../models/BlogPost.js';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all blog posts
// @route   GET /api/blog
// @access  Public
export const getBlogPosts = async (req, res) => {
  try {
    // Get query parameters for filtering
    const { category, tag, published, exclude, limit } = req.query;
    
    // Build filter object
    const filter = {};
    
    if (category) {
      filter.category = category;
    }
    
    if (tag) {
      filter.tags = { $in: [tag] };
    }
    
    // Exclude specific post if needed
    if (exclude) {
      filter._id = { $ne: exclude };
    }
    
    // Only return published posts for public users
    if (published === 'true' || (!req.user || req.user.role !== 'admin')) {
      filter.published = true;
    }
    
    console.log('Blog posts filter:', filter);
    
    // Create query with filter
    let query = BlogPost.find(filter);
    
    // Apply sort
    query = query.sort({ publishedAt: -1, createdAt: -1 });
    
    // Apply limit if specified
    if (limit) {
      query = query.limit(parseInt(limit));
    }
    
    const posts = await query;
    console.log(`Returning ${posts.length} blog posts`);
    
    res.json(posts);
  } catch (err) {
    console.error('Error fetching blog posts:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get a blog post by ID
// @route   GET /api/blog/:id
// @access  Public
export const getBlogPostById = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    
    // Only allow admins to see unpublished posts
    if (!post.published && (!req.user || req.user.role !== 'admin')) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    
    res.json(post);
  } catch (err) {
    console.error('Error fetching blog post:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Create a new blog post
// @route   POST /api/blog
// @access  Private/Admin
export const createBlogPost = async (req, res) => {
  try {
    console.log('Creating blog post with body:', {
      title: req.body.title,
      excerpt: req.body.excerpt,
      contentLength: req.body.content?.length || 0,
      category: req.body.category,
      tags: req.body.tags,
      file: req.file ? `${req.file.originalname} (${req.file.size} bytes)` : 'No file uploaded'
    });
    
    const { title, excerpt, content, category, tags, published } = req.body;
    
    // Check for required fields
    if (!title || !excerpt || !content || !category) {
      console.error('Missing required fields:', { 
        title: !!title,
        excerpt: !!excerpt,
        content: !!content,
        contentLength: content?.length || 0,
        category: !!category 
      });
      return res.status(400).json({ msg: 'Title, excerpt, content, and category are required' });
    }
    
    // Extra validation for content
    if (content.trim() === '<p><br></p>' || content.trim() === '<p></p>') {
      console.error('Empty content detected:', content);
      return res.status(400).json({ msg: 'Content cannot be empty' });
    }
    
    // Process tags if they're a comma-separated string
    let processedTags = tags;
    if (typeof tags === 'string') {
      processedTags = tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
    
    // Handle file upload
    let coverImagePath = '';
    if (req.file) {
      console.log('Uploaded file:', {
        filename: req.file.filename,
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size
      });
      coverImagePath = `/uploads/${req.file.filename}`;
    }
    
    // Create new blog post
    const newPost = new BlogPost({
      title,
      excerpt,
      content,
      category,
      tags: processedTags,
      published: published === 'true' || published === true,
      publishedAt: (published === 'true' || published === true) ? new Date() : null,
      coverImage: coverImagePath
    });
    
    console.log('Trying to save blog post with data:', {
      title,
      excerptLength: excerpt.length,
      contentLength: content.length,
      category,
      tagsCount: processedTags?.length || 0,
      published: published === 'true' || published === true,
      coverImage: coverImagePath ? 'Present' : 'Not provided'
    });
    
    const post = await newPost.save();
    console.log('Blog post created successfully:', post._id);
    res.status(201).json(post);
  } catch (err) {
    console.error('Error creating blog post:', err);
    if (err.name === 'ValidationError') {
      const validationErrors = {};
      
      // Format mongoose validation errors
      for (const field in err.errors) {
        validationErrors[field] = err.errors[field].message;
      }
      
      return res.status(400).json({ 
        msg: 'Validation error', 
        errors: validationErrors 
      });
    }
    
    res.status(500).json({ msg: 'Server error: ' + err.message });
  }
};

// @desc    Update a blog post
// @route   PUT /api/blog/:id
// @access  Private/Admin
export const updateBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    
    // Update fields
    const { title, excerpt, content, category, tags, published } = req.body;
    
    if (title) post.title = title;
    if (excerpt) post.excerpt = excerpt;
    if (content) post.content = content;
    if (category) post.category = category;
    
    // Process tags if they're a comma-separated string
    if (tags) {
      if (typeof tags === 'string') {
        post.tags = tags.split(',').map(tag => tag.trim());
      } else {
        post.tags = tags;
      }
    }
    
    // Handle published status
    if (published !== undefined) {
      const wasPublished = post.published;
      post.published = published === 'true' || published === true;
      
      // Set publishedAt if being published for the first time
      if (!wasPublished && post.published && !post.publishedAt) {
        post.publishedAt = new Date();
      }
    }
    
    // Handle image update if provided
    if (req.file) {
      // Delete old image if exists
      if (post.coverImage) {
        const oldImagePath = path.join(__dirname, '..', post.coverImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      post.coverImage = `/uploads/${req.file.filename}`;
    }
    
    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Error updating blog post:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Delete a blog post
// @route   DELETE /api/blog/:id
// @access  Private/Admin
export const deleteBlogPost = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    
    // Delete image if exists
    if (post.coverImage) {
      const imagePath = path.join(__dirname, '..', post.coverImage);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    await BlogPost.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Blog post removed' });
  } catch (err) {
    console.error('Error deleting blog post:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Toggle published status of a blog post
// @route   PATCH /api/blog/:id/publish
// @access  Private/Admin
export const togglePublishedStatus = async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    
    // Toggle published status
    post.published = !post.published;
    
    // Set publishedAt if being published for the first time
    if (post.published && !post.publishedAt) {
      post.publishedAt = new Date();
    }
    
    await post.save();
    res.json(post);
  } catch (err) {
    console.error('Error toggling published status:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Blog post not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
}; 