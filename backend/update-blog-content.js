import mongoose from 'mongoose';
import dotenv from 'dotenv';
import BlogPost from './models/BlogPost.js';

dotenv.config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

const updateBlogContent = async () => {
  try {
    const postId = '67dbed4b9d79a77096f03175';
    console.log('Updating content of blog post with ID:', postId);
    
    const post = await BlogPost.findById(postId);
    
    if (!post) {
      console.log('Blog post not found');
      return;
    }
    
    // Display current content
    console.log('Current content:', post.content);
    console.log('Current title:', post.title);
    console.log('Current excerpt:', post.excerpt);
    
    // Update with more substantial content
    post.title = 'Introduction to Machine Learning Techniques';
    post.excerpt = 'An overview of key machine learning algorithms and their applications in healthcare and beyond.';
    post.content = `
      <h2>Introduction to Machine Learning</h2>
      <p>Machine learning is a subfield of artificial intelligence that focuses on developing systems that can learn from and make decisions based on data.</p>
      
      <h3>Key Machine Learning Algorithms</h3>
      <ul>
        <li><strong>Supervised Learning</strong>: Algorithms trained on labeled data to predict outputs for unseen inputs.</li>
        <li><strong>Unsupervised Learning</strong>: Algorithms that find patterns in unlabeled data.</li>
        <li><strong>Reinforcement Learning</strong>: Algorithms that learn optimal actions through trial and error.</li>
      </ul>
      
      <h3>Applications in Healthcare</h3>
      <p>Machine learning is revolutionizing healthcare in numerous ways:</p>
      <ol>
        <li>Diagnosis assistance through medical imaging analysis</li>
        <li>Prediction of patient outcomes and readmission risks</li>
        <li>Drug discovery and development</li>
        <li>Personalized treatment recommendations</li>
      </ol>
      
      <h3>Challenges and Future Directions</h3>
      <p>Despite its promise, machine learning in healthcare faces challenges including:</p>
      <ul>
        <li>Data privacy and security concerns</li>
        <li>Model interpretability and transparency</li>
        <li>Integration with existing clinical workflows</li>
        <li>Regulatory approval processes</li>
      </ul>
      
      <p>As these challenges are addressed, we can expect machine learning to play an increasingly important role in improving healthcare outcomes and efficiency.</p>
    `;
    
    // Save the updated post
    await post.save();
    
    console.log('Blog post updated successfully');
    console.log('New content length:', post.content.length);
    
  } catch (error) {
    console.error('Error updating blog post:', error);
  } finally {
    mongoose.connection.close();
  }
};

updateBlogContent(); 