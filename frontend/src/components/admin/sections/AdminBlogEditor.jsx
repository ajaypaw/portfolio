import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/axios';
import { useAuth } from '../../../context/AuthContext';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// Helper function to get full URL for image paths
const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  
  // If path starts with '/uploads/', ensure we add the API base URL
  if (path.startsWith('/uploads/')) {
    return `${api.defaults.baseURL || import.meta.env.VITE_API_URL || 'http://localhost:5000'}${path}`;
  }
  
  // Otherwise, assume it's a relative path from API
  return `${api.defaults.baseURL || import.meta.env.VITE_API_URL || 'http://localhost:5000'}/uploads/${path}`;
};

// Blog Posts List Component
const BlogPostsList = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      setError('Please log in to access this page');
      navigate('/admin/login');
      return;
    }

    // Check if we came from a blog post creation or update
    const state = navigate?.location?.state;
    if (state?.refresh) {
      console.log('Refreshing blog posts due to create/update action');
    }

    fetchPosts();
  }, [isAuthenticated, navigate]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      console.log('Fetching blog posts...');
      const token = localStorage.getItem('token');
      console.log('Auth token for blog fetch:', token ? 'Present' : 'Missing');
      
      const response = await api.get('/blog');
      console.log('Fetched blog posts:', response.data);
      setPosts(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
      setError('Failed to load blog posts');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isAuthenticated()) {
      setError('You must be logged in to delete blog posts');
      return;
    }

    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await api.delete(`/blog/${id}`);
        fetchPosts();
      } catch (err) {
        console.error('Error deleting blog post:', err);
        setError('Failed to delete blog post');
      }
    }
  };

  const handlePublishToggle = async (post) => {
    if (!isAuthenticated()) {
      setError('You must be logged in to publish/unpublish blog posts');
      return;
    }

    const newPublishedState = !post.published;
    try {
      await api.patch(`/blog/${post._id}/publish`, {
        published: newPublishedState
      });
      // Update local state
      setPosts(posts.map(p => 
        p._id === post._id ? { ...p, published: newPublishedState } : p
      ));
    } catch (err) {
      console.error('Error toggling publish state:', err);
      setError(`Failed to ${newPublishedState ? 'publish' : 'unpublish'} blog post`);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not published';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <button
          onClick={() => navigate('/admin/blog/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Write New Post
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                No blog posts found. Create your first post to get started.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {posts.map((post) => (
              <li key={post._id}>
                <div className="px-4 py-5 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-blue-600 truncate">{post.title}</h3>
                      <div className="mt-1 flex items-center">
                        <span className={`px-2 py-1 text-xs font-medium ${
                          post.published 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        } rounded-full`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                        <span className="ml-2 text-sm text-gray-500">
                          {post.published 
                            ? `Published on ${formatDate(post.publishedAt)}` 
                            : `Last updated on ${formatDate(post.updatedAt)}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {post.published && (
                        <a
                          href={`/blog/${post._id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          View
                        </a>
                      )}
                      <button
                        onClick={() => handlePublishToggle(post)}
                        className={`inline-flex items-center px-3 py-1.5 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                          post.published 
                            ? 'border-yellow-300 text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:ring-yellow-500' 
                            : 'border-green-300 text-green-700 bg-green-50 hover:bg-green-100 focus:ring-green-500'
                        }`}
                      >
                        {post.published ? 'Unpublish' : 'Publish'}
                      </button>
                      <button
                        onClick={() => navigate(`/admin/blog/edit/${post._id}`)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(post._id)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500 line-clamp-2">{post.excerpt}</p>
                    {post.coverImage && (
                      <div className="mt-2">
                        <img 
                          src={getImageUrl(post.coverImage)} 
                          alt={post.title}
                          className="h-20 w-auto object-cover rounded"
                          onError={(e) => {
                            console.error('Error loading image:', post.coverImage);
                            e.target.src = 'https://via.placeholder.com/100x60?text=Image+Error';
                          }}
                        />
                      </div>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {post.tags && post.tags.map((tag, index) => (
                      <span 
                        key={index} 
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

// Blog Post Form Component (used for both Create and Edit)
const BlogPostForm = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    coverImage: null,
    coverImagePreview: null,
    category: '',
    tags: '',
    published: false
  });

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      setError('Please log in to access this page');
      navigate('/admin/login');
      return;
    }

    // If editing, fetch the blog post data
    if (isEditing && id) {
      const fetchPost = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/blog/${id}`);
          const post = response.data;
          
          setFormData({
            title: post.title || '',
            slug: post.slug || '',
            content: post.content || '',
            excerpt: post.excerpt || '',
            tags: post.tags?.join(', ') || '',
            author: post.author || ''
          });
          
          // Set featured image preview if it exists
          if (post.featuredImage) {
            const imageUrl = post.featuredImage.startsWith('http') 
              ? post.featuredImage 
              : `${api.defaults.baseURL || import.meta.env.VITE_API_URL || 'http://localhost:5000'}${post.featuredImage}`;
            setFormData({ ...formData, coverImagePreview: imageUrl });
          }
          
          setError(null);
        } catch (err) {
          console.error('Error fetching blog post:', err);
          setError('Failed to load blog post');
        } finally {
          setLoading(false);
        }
      };

      fetchPost();
    }
  }, [isEditing, id, isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (type === 'file' && files[0]) {
      setFormData({
        ...formData,
        [name]: files[0],
        coverImagePreview: URL.createObjectURL(files[0])
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const validateContent = (content) => {
    if (!content) return false;
    
    // Check if content is just empty HTML editor content
    const emptyPatterns = ['<p><br></p>', '<p></p>', ''];
    const trimmedContent = content.trim();
    
    if (emptyPatterns.includes(trimmedContent)) {
      return false;
    }
    
    // Extract text content to check if there's actual text beyond HTML tags
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    return textContent.trim().length > 0;
  };

  const handleEditorChange = (content) => {
    setFormData({
      ...formData,
      content
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    try {
      setSubmitting(true);
      
      // Create FormData for file upload
      const formDataObj = new FormData();
      
      // Append all text fields
      Object.keys(formData).forEach(key => {
        if (key === 'tags' && Array.isArray(formData[key])) {
          // Handle array of tags
          formData[key].forEach(tag => {
            formDataObj.append('tags', tag);
          });
        } else if (key !== 'coverImage' || (key === 'coverImage' && formData[key] instanceof File)) {
          formDataObj.append(key, formData[key]);
        }
      });
      
      // Special handling for rich text content
      formDataObj.append('content', editorContent);
      
      let response;
      if (isEditing && id) {
        // Update existing post
        response = await api.put(`/blog/${id}`, formDataObj);
        console.log('Updated blog post:', response.data);
      } else {
        // Create new post
        response = await api.post('/blog', formDataObj);
        console.log('Created blog post:', response.data);
      }
      
      // Success, redirect to blog posts list
      navigate('/admin/blog', { state: { refresh: true }});
    } catch (err) {
      console.error('Error saving blog post:', err.message);
      
      let errorMessage = 'Failed to save blog post. ';
      
      if (err.response?.data?.msg) {
        errorMessage += err.response.data.msg;
      } else if (err.response?.data?.errors) {
        const validationErrors = err.response.data.errors;
        errorMessage += 'Validation errors: ' + Object.keys(validationErrors).map(field => 
          `${field} - ${validationErrors[field]}`
        ).join(', ');
      } else if (err.message) {
        errorMessage += err.message;
      } else {
        errorMessage += 'Unknown error occurred. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Quill editor modules and formats
  const editorModules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'indent': '-1'}, { 'indent': '+1' }],
      [{ 'color': [] }, { 'background': [] }],
      ['link', 'image', 'code-block'],
      ['clean']
    ],
  };
  
  const editorFormats = [
    'header',
    'bold', 'italic', 'underline', 'strike',
    'list', 'bullet', 'indent',
    'color', 'background',
    'link', 'image', 'code-block'
  ];

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{isEditing ? 'Edit Blog Post' : 'Create New Blog Post'}</h2>
        <button
          onClick={() => navigate('/admin/blog')}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Blog Posts
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-6">
            <div className="sm:col-span-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Post Title *
              </label>
              <input
                type="text"
                name="title"
                id="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
                Excerpt/Summary *
              </label>
              <textarea
                id="excerpt"
                name="excerpt"
                rows={2}
                required
                value={formData.excerpt}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">Brief summary that appears in blog listings (150-200 characters recommended)</p>
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <input
                type="text"
                name="category"
                id="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                Tags *
              </label>
              <input
                type="text"
                name="tags"
                id="tags"
                required
                value={formData.tags}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">Comma-separated list of tags (e.g., "React, Web Development, Tutorial")</p>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">Cover Image</label>
              <div className="mt-1 flex items-center">
                {formData.coverImagePreview ? (
                  <div className="relative w-full">
                    <img
                      src={formData.coverImagePreview}
                      alt="Cover preview"
                      className="h-64 w-full object-cover rounded-md"
                      onError={(e) => {
                        console.error('Error loading image preview:', formData.coverImagePreview);
                        e.target.src = 'https://via.placeholder.com/800x400?text=Image+Error';
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, coverImage: null, coverImagePreview: null })}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-center items-center w-full h-64 border-2 border-dashed border-gray-300 rounded-md">
                    <div className="text-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <div className="mt-2">
                        <label htmlFor="coverImage" className="cursor-pointer bg-blue-600 py-2 px-4 border border-blue-600 rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none">
                          <span>Upload Cover Image</span>
                          <input
                            type="file"
                            name="coverImage"
                            id="coverImage"
                            accept="image/*"
                            onChange={handleChange}
                            className="sr-only"
                          />
                        </label>
                      </div>
                      <p className="mt-1 text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Content *
              </label>
              <div className="mt-1">
                <ReactQuill
                  value={formData.content}
                  onChange={handleEditorChange}
                  modules={editorModules}
                  formats={editorFormats}
                  className="h-64 mb-12"
                />
              </div>
              <p className="mt-1 text-xs text-gray-500">Main content of your blog post</p>
              {formData.content && !validateContent(formData.content) && (
                <p className="mt-1 text-xs text-red-500">Content appears to be empty. Please add some text to your blog post.</p>
              )}
            </div>

            <div className="sm:col-span-6 flex items-center">
              <input
                id="published"
                name="published"
                type="checkbox"
                checked={formData.published}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="published" className="ml-2 block text-sm text-gray-700">
                Publish immediately <span className="text-gray-500">(If unchecked, this will be saved as a draft)</span>
              </label>
            </div>
          </div>

          <div className="pt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/blog')}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 flex items-center"
            >
              {loading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isEditing ? 'Update Post' : 'Save Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main component that handles routes
const AdminBlogEditor = () => {
  return (
    <Routes>
      <Route index element={<BlogPostsList />} />
      <Route path="new" element={<BlogPostForm isEditing={false} />} />
      <Route path="edit/:id" element={<BlogPostForm isEditing={true} />} />
    </Routes>
  );
};

export default AdminBlogEditor; 