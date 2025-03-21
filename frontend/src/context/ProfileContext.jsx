import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/axios';

// Create the context
const ProfileContext = createContext(null);

// Hook to use the profile context
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

// Provider component
export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    name: '',
    title: 'Software Engineer & AI Enthusiast',
    subtitle: 'I design and build innovative digital solutions with cutting-edge technologies',
    bio: 'Passionate about creating meaningful applications that solve real-world problems, specializing in React, AI integration, and IoT solutions.',
    image: '',
    social: {
      github: 'https://github.com/ajaypaw',
      linkedin: 'https://www.linkedin.com/in/ajay-pawarr',
      twitter: 'https://twitter.com/yourusername'
    },
    loading: true,
    error: null
  });

  // Project counts and stats for the profile
  const [projectStats, setProjectStats] = useState({
    totalProjects: 0,
    featuredProjects: 0,
    skillCategories: 0,
    achievements: 0,
    loading: true
  });

  // Function to fetch profile data
  const fetchProfileData = async () => {
    try {
      // Try multiple endpoints in sequence
      let userData;
      try {
        // First try the /api/auth/user endpoint
        console.log('Trying to fetch profile from /api/auth/user');
        const response = await api.get('/api/auth/user');
        userData = response.data;
        console.log('Success with first endpoint:', userData);
      } catch (firstErr) {
        console.log('First endpoint error:', {
          status: firstErr.response?.status,
          message: firstErr.message,
          isAuthenticated: !!localStorage.getItem('token')
        });
        
        if (firstErr.response && firstErr.response.status === 404) {
          // If first endpoint fails with 404, try the second endpoint
          console.log('First endpoint not found, trying fallback endpoint: /auth/user');
          try {
            const response = await api.get('/auth/user');
            userData = response.data;
            console.log('Success with second endpoint:', userData);
          } catch (secondErr) {
            console.log('Both endpoints failed, using default values');
            throw secondErr;
          }
        } else if (firstErr.response && firstErr.response.status === 401) {
          console.log('Authentication error - user is not logged in');
          // For unauthenticated users, we'll still use default profile values
          throw firstErr;
        } else {
          // If it fails for any other reason, rethrow the error
          throw firstErr;
        }
      }
      
      console.log('Profile data received:', userData);
      
      // Ensure all properties from userData are properly extracted and applied
      setProfileData(prev => {
        // Construct social data correctly
        const social = {
          github: userData.github || userData.social?.github || prev.social.github,
          linkedin: userData.linkedin || userData.social?.linkedin || prev.social.linkedin,
          twitter: userData.twitter || userData.social?.twitter || prev.social.twitter
        };
        
        // Check if profilePic exists and if it already has a URL or needs to be prefixed
        let imageUrl = prev.image;
        if (userData.profilePic) {
          // If profilePic is a full URL (starts with http), use it directly
          if (userData.profilePic.startsWith('http')) {
            imageUrl = userData.profilePic;
          } else {
            // Otherwise, prefix with API URL
            imageUrl = `${import.meta.env.VITE_API_URL}${userData.profilePic}`;
          }
        }
        
        return {
          ...prev,
          name: userData.name || prev.name,
          bio: userData.bio || prev.bio,
          image: imageUrl,
          social: social,
          loading: false,
          error: null
        };
      });
    } catch (err) {
      console.error('Error fetching profile data:', err);
      // Continue with default values for unauthenticated users
      setProfileData(prev => ({
        ...prev,
        loading: false,
        error: 'Failed to load profile data'
      }));
    }
  };

  // Function to fetch project statistics
  const fetchProjectStats = async () => {
    setProjectStats(prev => ({ ...prev, loading: true }));
    
    try {
      // Get projects count - try multiple endpoint formats
      let projects = [];
      try {
        console.log('Trying to fetch projects from /api/projects');
        const projectsResponse = await api.get('/api/projects');
        projects = projectsResponse.data;
        console.log('Projects loaded successfully:', projects.length);
      } catch (projectErr) {
        console.log('First projects endpoint failed, trying alternative');
        try {
          const projectsResponse = await api.get('/projects');
          projects = projectsResponse.data;
          console.log('Alternative projects endpoint succeeded:', projects.length);
        } catch (altProjectErr) {
          console.log('All project endpoints failed');
          // Continue with empty array
        }
      }
      
      // Get skills count with similar fallback pattern
      let skills = [];
      try {
        console.log('Trying to fetch skills from /api/skills');
        const skillsResponse = await api.get('/api/skills');
        skills = skillsResponse.data;
        console.log('Skills loaded successfully:', skills.length);
      } catch (skillErr) {
        console.log('First skills endpoint failed, trying alternative');
        try {
          const skillsResponse = await api.get('/skills');
          skills = skillsResponse.data;
          console.log('Alternative skills endpoint succeeded:', skills.length);
        } catch (altSkillErr) {
          console.log('All skill endpoints failed');
          // Continue with empty array
        }
      }
      
      // Get achievements count with similar fallback pattern
      let achievements = [];
      try {
        console.log('Trying to fetch achievements from /api/achievements');
        const achievementsResponse = await api.get('/api/achievements');
        achievements = achievementsResponse.data;
        console.log('Achievements loaded successfully:', achievements.length);
      } catch (achievementErr) {
        console.log('First achievements endpoint failed, trying alternative');
        try {
          const achievementsResponse = await api.get('/achievements');
          achievements = achievementsResponse.data;
          console.log('Alternative achievements endpoint succeeded:', achievements.length);
        } catch (altAchievementErr) {
          console.log('All achievement endpoints failed');
          // Continue with empty array
        }
      }
      
      // Get unique skill categories
      const categories = skills.length > 0 
        ? [...new Set(skills.map(skill => skill.category))]
        : [];
      
      console.log('Setting project stats with data:', {
        totalProjects: projects.length,
        featuredProjects: projects.filter(p => p.featured).length,
        skillCategories: categories.length,
        achievements: achievements.length
      });

      setProjectStats({
        totalProjects: projects.length,
        featuredProjects: projects.filter(p => p.featured).length,
        skillCategories: categories.length,
        achievements: achievements.length,
        loading: false
      });
    } catch (err) {
      console.error('Error in fetchProjectStats:', err);
      // Set default values if everything fails
      setProjectStats({
        totalProjects: 3,
        featuredProjects: 4,
        skillCategories: 5,
        achievements: 4,
        loading: false
      });
    }
  };

  // Load data when the component mounts
  useEffect(() => {
    fetchProfileData();
    fetchProjectStats();
  }, []);

  // Function to manually trigger a refresh of the project stats
  const refreshProjectStats = () => {
    setProjectStats(prev => ({ ...prev, loading: true }));
    fetchProjectStats();
  };

  // Provide the context value
  const value = {
    profile: profileData,
    projectStats,
    refreshProjectStats
  };

  return (
    <ProfileContext.Provider value={value}>
      {children}
    </ProfileContext.Provider>
  );
};

export default ProfileContext; 