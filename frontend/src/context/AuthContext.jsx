import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check for token on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      console.log('Token found in localStorage, verifying...');
      // Verify token and get user data
      api.get('/auth/user')
        .then(res => {
          console.log('User data retrieved successfully:', res.data);
          setUser(res.data);
        })
        .catch(err => {
          console.error('Error verifying token:', err);
          localStorage.removeItem('token');
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      console.log('No token found in localStorage');
      setLoading(false);
    }
  }, []);

  // Function to check if the user is authenticated
  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem('token');
  };

  const login = async (email, password) => {
    try {
      setError(null);
      setLoading(true);
      console.log('Attempting login with:', email);
      
      // Prepare the request config
      const requestConfig = {
        headers: {
          'Content-Type': 'application/json',
        },
      };
      
      // Try both endpoints in sequence
      let res;
      try {
        // Try the /auth/login endpoint first
        console.log('Trying login at endpoint:', '/auth/login');
        res = await api.post('/auth/login', { email, password }, requestConfig);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // If first endpoint fails with 404, try the second endpoint
          console.log('First endpoint not found, trying fallback endpoint:', '/api/auth/login');
          res = await api.post('/api/auth/login', { email, password }, requestConfig);
        } else {
          // If it fails for any other reason, rethrow the error
          throw err;
        }
      }
      
      // Process the successful response
      console.log('Login response status:', res.status);
      
      if (res.data && res.data.token) {
        console.log('Login successful, token received');
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        return res.data;
      } else {
        console.error('No token in response:', res.data);
        throw new Error('Authentication failed: No token received');
      }
    } catch (err) {
      console.error('Login error:', err);
      
      // Check if the error has a response
      if (err.response) {
        // Handle specific HTTP error codes
        if (err.response.status === 400) {
          setError(err.response.data.msg || 'Invalid credentials. Please check your email and password.');
        } else if (err.response.status === 404) {
          setError('Authentication service not found. Please contact the administrator.');
        } else if (err.response.status >= 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(err.response.data.msg || 'Login failed. Please try again.');
        }
      } else if (err.request) {
        // Request was made but no response received
        setError('No response from server. Please check your network connection.');
      } else {
        // Something else went wrong
        setError(err.message || 'Login failed. Please try again.');
      }
      
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setError(null);
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      
      // If no profileData provided, just fetch the current profile
      if (!profileData) {
        console.log('Fetching current user profile...');
        
        // Try to get user profile from different endpoints
        try {
          console.log('Trying to fetch user from /api/auth/user');
          const res = await api.get('/api/auth/user');
          setUser(res.data);
          return res.data;
        } catch (firstErr) {
          if (firstErr.response && firstErr.response.status === 404) {
            // Try alternative endpoint
            console.log('First endpoint not found, trying fallback endpoint: /auth/user');
            const res = await api.get('/auth/user');
            setUser(res.data);
            return res.data;
          } else {
            throw firstErr;
          }
        }
      }
      
      // Try primary endpoint first, then fallback to secondary
      let res;
      try {
        console.log('Attempting to update profile at /api/auth/profile');
        res = await api.put('/api/auth/profile', profileData);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // If first endpoint fails with 404, try the second endpoint
          console.log('First endpoint not found, trying fallback endpoint: /auth/profile');
          res = await api.put('/auth/profile', profileData);
        } else {
          // If it fails for any other reason, rethrow the error
          throw err;
        }
      }
      
      // Update the user data in state
      console.log('Profile updated successfully:', res.data);
      setUser(prev => ({
        ...prev,
        ...res.data
      }));
      
      return res.data;
    } catch (err) {
      console.error('Profile update error:', err);
      
      // Handle specific error types
      if (err.response) {
        if (err.response.status === 400 && err.response.data.field === 'email') {
          setError('Email is already in use by another account.');
        } else {
          setError(err.response?.data?.msg || 'Profile update failed');
        }
      } else {
        setError('Network error. Unable to update profile.');
      }
      
      throw err;
    }
  };

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setError(null);
      
      // Try primary endpoint first, then fallback to secondary
      let res;
      try {
        console.log('Attempting to change password at /api/auth/profile/password');
        res = await api.put('/api/auth/profile/password', {
          currentPassword,
          newPassword
        });
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // If first endpoint fails with 404, try the second endpoint
          console.log('First endpoint not found, trying fallback endpoint: /auth/profile/password');
          res = await api.put('/auth/profile/password', {
            currentPassword,
            newPassword
          });
        } else {
          // If it fails for any other reason, rethrow the error
          throw err;
        }
      }
      
      return res.data;
    } catch (err) {
      console.error('Password change error:', err);
      
      // Handle specific error types
      if (err.response) {
        if (err.response.status === 400) {
          setError(err.response.data.msg || 'Current password is incorrect');
        } else if (err.response.status >= 500) {
          setError('Server error. Please try again later.');
        } else {
          setError(err.response?.data?.msg || 'Password change failed');
        }
      } else {
        setError('Network error. Unable to change password.');
      }
      
      throw err;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateProfile,
    changePassword,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 