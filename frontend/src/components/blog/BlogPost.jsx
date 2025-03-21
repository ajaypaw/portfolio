import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../utils/axios';
import { motion } from 'framer-motion';

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedPosts, setRelatedPosts] = useState([]);

  // Helper function to get full URL for image paths
  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    
    // If path starts with '/uploads/', ensure we add the API base URL
    if (path.startsWith('/uploads/')) {
      return `${import.meta.env.VITE_API_URL || 'https://ajay-portfolio-017w.onrender.com'}${path}`;
    }
    
    // Otherwise, assume it's a relative path from API
    return `${import.meta.env.VITE_API_URL || 'https://ajay-portfolio-017w.onrender.com'}/uploads/${path}`;
  };

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        setLoading(true);
        console.log('Fetching blog post with ID:', id);
        
        // Fetch blog post from the API
        const response = await api.get(`/blog/${id}`);
        console.log('API Response:', {
          status: response.status,
          data: response.data,
          headers: response.headers
        });
        
        if (!response.data) {
          throw new Error('No data received from API');
        }
        
        setPost(response.data);
        
        // Fetch related posts based on category or tags
        if (response.data.category) {
          console.log('Fetching related posts for category:', response.data.category);
          const relatedResponse = await api.get('/blog', { 
            params: { 
              published: true,
              category: response.data.category,
              exclude: id,
              limit: 2
            } 
          });
          console.log('Related posts response:', relatedResponse.data);
          setRelatedPosts(relatedResponse.data);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching blog post:', {
          message: err.message,
          response: err.response?.data,
          status: err.response?.status
        });
        setError(err.response?.data?.msg || err.message || 'Failed to load blog post. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
    
    // Scroll to top when navigating to a blog post
    window.scrollTo(0, 0);
  }, [id]);

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3">Loading blog post...</p>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-6 py-20">
        <div className="flex flex-col justify-center items-center min-h-[50vh]">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4 w-full max-w-lg text-center">
            {error || "Blog post not found"}
          </div>
          <Link 
            to="/blog" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Blog
          </Link>
        </div>
      </div>
    );
  }

  console.log('Rendering blog post:', {
    title: post.title,
    excerpt: post.excerpt,
    contentLength: post.content?.length,
    category: post.category,
    tags: post.tags,
    published: post.published,
    publishedAt: post.publishedAt,
    coverImage: post.coverImage
  });

  return (
    <article className="container mx-auto px-6 py-20">
      {/* Breadcrumb */}
      <div className="mb-8">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link to="/" className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600">
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
                </svg>
                Home
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <Link to="/blog" className="ml-1 text-sm font-medium text-gray-700 hover:text-blue-600 md:ml-2">
                  Blog
                </Link>
              </div>
            </li>
            <li aria-current="page">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path>
                </svg>
                <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2 truncate max-w-xs">
                  {post.title}
                </span>
              </div>
            </li>
          </ol>
        </nav>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Post Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-center mb-6">
            <span className="text-sm font-semibold px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
              {post.category}
            </span>
            <span className="mx-2 text-gray-400">•</span>
            <span className="text-sm text-gray-500">
              {formatDate(post.publishedAt)}
            </span>
            {post.readingTime && (
              <>
                <span className="mx-2 text-gray-400">•</span>
                <span className="text-sm text-gray-500">
                  {post.readingTime} min read
                </span>
              </>
            )}
          </div>
          
          <div className="flex flex-wrap justify-center gap-2 mb-6">
            {post.tags && post.tags.map((tag, i) => (
              <span key={i} className="text-xs text-gray-600 px-2 py-1 bg-gray-100 rounded-full">
                #{tag}
              </span>
            ))}
          </div>
        </header>
        
        {/* Featured Image */}
        {post.coverImage && (
          <div className="mb-10 rounded-lg overflow-hidden shadow-lg">
            <img 
              src={getImageUrl(post.coverImage)} 
              alt={post.title}
              className="w-full h-auto object-cover"
              onError={(e) => {
                console.error('Error loading image:', post.coverImage);
                e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Available';
              }}
            />
          </div>
        )}
        
        {/* Author Info */}
        {post.author && (
          <div className="flex items-center mb-10 p-4 bg-gray-50 rounded-lg">
            <img 
              src={post.author.avatar ? getImageUrl(post.author.avatar) : 'https://via.placeholder.com/48?text=A'}
              alt={post.author.name}
              className="w-12 h-12 rounded-full mr-4"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/48?text=A';
              }}
            />
            <div>
              <p className="font-semibold">{post.author.name}</p>
              <p className="text-sm text-gray-600">{post.author.bio}</p>
            </div>
          </div>
        )}
        
        {/* Post Content */}
        <div className="max-w-3xl mx-auto mb-12">
          {!post.content && (
            <div className="p-4 bg-yellow-100 text-yellow-800 rounded mb-4">
              <p>This post does not have any content.</p>
            </div>
          )}
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content || '<p>No content available.</p>' }}
          />
        </div>
        
        {/* Share and Tags */}
        <div className="max-w-3xl mx-auto mb-16 pb-8 border-b border-gray-200">
          <div className="flex flex-wrap items-center justify-between">
            <div className="flex flex-wrap gap-2 mb-4 md:mb-0">
              {post.tags && post.tags.map((tag, i) => (
                <span key={i} className="text-sm text-gray-600 px-3 py-1 bg-gray-100 rounded-full">
                  #{tag}
                </span>
              ))}
            </div>
            
            <div className="flex items-center">
              <span className="text-gray-700 mr-3">Share:</span>
              <div className="flex space-x-2">
                <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(window.location.href)}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                  </svg>
                </a>
                <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-gray-600 hover:text-blue-600 transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-16"
        >
          <h2 className="text-2xl font-bold mb-8 text-center">Related Posts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {relatedPosts.map((relatedPost, index) => (
              <div 
                key={relatedPost._id}
                className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
              >
                <Link to={`/blog/${relatedPost._id}`}>
                  <div className="relative h-48">
                    <img 
                      src={relatedPost.coverImage ? getImageUrl(relatedPost.coverImage) : 'https://via.placeholder.com/400x300?text=Blog+Post'}
                      alt={relatedPost.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/400x300?text=Blog+Post';
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-semibold mb-2">{relatedPost.title}</h3>
                    <p className="text-gray-600 mb-4">{relatedPost.excerpt}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <span>{formatDate(relatedPost.publishedAt)}</span>
                      {relatedPost.readingTime && (
                        <>
                          <span className="mx-2">•</span>
                          <span>{relatedPost.readingTime} min read</span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link 
              to="/blog"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
              </svg>
              Back to Blog
            </Link>
          </div>
        </motion.div>
      )}
    </article>
  );
};

export default BlogPost; 
