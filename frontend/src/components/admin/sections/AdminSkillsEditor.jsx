import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import api from '../../../utils/axios';
import { useAuth } from '../../../context/AuthContext';

// Skills List Component
const SkillsList = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      setLoading(true);
      const response = await api.get('/skills');
      setSkills(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!isAuthenticated()) {
      setError('You must be logged in to delete skills');
      return;
    }

    if (window.confirm('Are you sure you want to delete this skill?')) {
      try {
        await api.delete(`/skills/${id}`);
        fetchSkills();
      } catch (err) {
        console.error('Error deleting skill:', err);
        setError('Failed to delete skill');
      }
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

  // Group skills by category
  const skillsByCategory = skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Skills</h2>
        <button
          onClick={() => navigate('/admin/skills/new')}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          Add New Skill
        </button>
      </div>

      {skills.length === 0 ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                No skills found. Add your first skill to get started.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
            <div key={category} className="mb-8">
              <h3 className="text-lg font-medium text-gray-700 mb-4">{category}</h3>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {categorySkills.map((skill) => (
                    <li key={skill._id}>
                      <div className="px-4 py-4 sm:px-6 flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-gray-100 rounded-md text-2xl">
                            {skill.icon}
                          </div>
                          <div className="ml-4">
                            <p className="text-lg font-medium text-gray-900">{skill.name}</p>
                            <div className="mt-1 w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-blue-600 rounded-full" 
                                style={{ width: `${skill.proficiency}%` }}
                              ></div>
                            </div>
                            <p className="mt-1 text-sm text-gray-500">Proficiency: {skill.proficiency}%</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => navigate(`/admin/skills/edit/${skill._id}`)}
                            className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(skill._id)}
                            className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Skill Form Component (used for both Create and Edit)
const SkillForm = ({ isEditing = false }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    proficiency: 50,
    category: '',
    icon: '',
  });

  useEffect(() => {
    if (isEditing && id) {
      const fetchSkill = async () => {
        try {
          const response = await api.get(`/skills/${id}`);
          const skill = response.data;
          setFormData({
            name: skill.name,
            proficiency: skill.proficiency || skill.level || 50,
            category: skill.category,
            icon: skill.icon,
          });
        } catch (err) {
          console.error('Error fetching skill:', err);
          setError('Failed to load skill data');
        }
      };

      fetchSkill();
    }
  }, [isEditing, id]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseInt(value, 10) : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      setError('You must be logged in to save skills');
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/admin/login');
      }, 1500);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.debug('Sending skill data:', formData);
      
      if (isEditing && id) {
        const response = await api.put(`/skills/${id}`, formData);
        console.log('Updated skill:', response.data);
        navigate('/admin/skills');
      } else {
        const response = await api.post('/skills', formData);
        console.log('Created skill:', response.data);
        navigate('/admin/skills');
      }
    } catch (err) {
      console.error('Error saving skill:', err);
      const errorMessage = err.response?.data?.msg || 'Failed to save skill';
      setError(errorMessage);
      
      // Log additional debug information
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response headers:', err.response.headers);
        console.error('Response data:', err.response.data);
      } else if (err.request) {
        console.error('No response received, request was:', err.request);
      }
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Machine Learning', 'Mobile', 'Other'];
  const commonIcons = ['⚛️', '🟢', '🍃', '🐳', '🧠', '📱', '🔧', '🛠️', '📊', '🎨', '🔍', '🔐', '☁️'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">{isEditing ? 'Edit Skill' : 'Add New Skill'}</h2>
        <button
          onClick={() => navigate('/admin/skills')}
          className="text-gray-600 hover:text-gray-900 flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to Skills
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
            <div className="sm:col-span-3">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Skill Name *
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div className="sm:col-span-3">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-6">
              <label htmlFor="level" className="block text-sm font-medium text-gray-700">
                Proficiency Level: {formData.proficiency}%
              </label>
              <input
                type="range"
                name="proficiency"
                id="level"
                min="1"
                max="100"
                value={formData.proficiency}
                onChange={handleChange}
                className="mt-1 block w-full focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="mt-1 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 rounded-full" 
                  style={{ width: `${formData.proficiency}%` }}
                ></div>
              </div>
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Icon *
              </label>
              <div className="grid grid-cols-7 gap-2">
                {commonIcons.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon })}
                    className={`h-12 w-12 flex items-center justify-center text-2xl rounded-md ${
                      formData.icon === icon
                        ? 'bg-blue-100 border-2 border-blue-500'
                        : 'bg-gray-100 border border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
              <div className="mt-3">
                <label htmlFor="customIcon" className="block text-sm font-medium text-gray-700">
                  Custom Icon (emoji or text)
                </label>
                <input
                  type="text"
                  name="icon"
                  id="customIcon"
                  value={formData.icon}
                  onChange={handleChange}
                  maxLength={2}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="pt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate('/admin/skills')}
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
              {isEditing ? 'Update Skill' : 'Add Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main component that handles routes
const AdminSkillsEditor = () => {
  const [initLoading, setInitLoading] = useState(false);
  const [initError, setInitError] = useState(null);
  const { login, isAuthenticated } = useAuth();

  // Helper function to initialize admin user if needed
  const initAdminUser = async () => {
    if (isAuthenticated()) {
      return; // Already authenticated
    }

    try {
      setInitLoading(true);
      setInitError(null);
      
      // First try to initialize the admin user
      await api.post('/auth/init-admin', {
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin'
      });
      
      // Then log in with those credentials
      await login('admin@example.com', 'admin123');
      
      console.log('Admin user initialized and logged in successfully');
    } catch (err) {
      console.error('Failed to initialize admin user:', err);
      setInitError('Failed to initialize admin user. See console for details.');
      
      // Try to log in anyway, in case the user already exists
      try {
        await login('admin@example.com', 'admin123');
        console.log('Logged in successfully');
      } catch (loginErr) {
        console.error('Login also failed:', loginErr);
      }
    } finally {
      setInitLoading(false);
    }
  };

  // Add a button to initialize admin in development
  const renderDevHelper = () => {
    if (process.env.NODE_ENV !== 'development') {
      return null;
    }

    return (
      <div className="my-4 p-4 bg-gray-100 border rounded">
        <h3 className="text-lg font-semibold">Development Tools</h3>
        <div className="mt-2">
          <button
            onClick={initAdminUser}
            disabled={initLoading || isAuthenticated()}
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
          >
            {initLoading ? 'Initializing...' : isAuthenticated() ? 'Already Authenticated' : 'Initialize Admin User'}
          </button>
          {initError && <p className="mt-2 text-red-600">{initError}</p>}
        </div>
        <p className="mt-2 text-sm text-gray-600">
          This will create an admin user (if not exists) and log you in for testing.
        </p>
      </div>
    );
  };

  return (
    <>
      {renderDevHelper()}
      <Routes>
        <Route path="/" element={<SkillsList />} />
        <Route path="/new" element={<SkillForm />} />
        <Route path="/edit/:id" element={<SkillForm isEditing={true} />} />
      </Routes>
    </>
  );
};

export default AdminSkillsEditor; 