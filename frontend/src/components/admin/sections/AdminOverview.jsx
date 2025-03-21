import React, { useEffect, useState } from 'react';
import api from '../../../utils/axios';

const StatsCard = ({ title, value, icon, color, isLoading }) => {
  return (
    <div className="bg-white rounded-lg shadow p-5 flex items-center">
      <div className={`w-12 h-12 rounded-full ${color} mr-4 flex items-center justify-center text-white`}>
        {icon}
      </div>
      <div>
        <h3 className="text-gray-500 text-sm font-medium">{title}</h3>
        {isLoading ? (
          <div className="h-8 w-8 rounded-full border-2 border-t-blue-500 animate-spin"></div>
        ) : (
          <p className="text-2xl font-semibold">{value}</p>
        )}
      </div>
    </div>
  );
};

const AdminOverview = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    achievements: 0,
    blogPosts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Track loading state for each stat separately
  const [loadingStates, setLoadingStates] = useState({
    projects: true, 
    skills: true,
    achievements: true,
    blogPosts: true
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        
        // Fetch projects count
        try {
          const projectsResponse = await api.get('/projects');
          setStats(prev => ({ ...prev, projects: projectsResponse.data.length }));
          setLoadingStates(prev => ({ ...prev, projects: false }));
        } catch (err) {
          console.error('Error fetching projects count:', err);
          setLoadingStates(prev => ({ ...prev, projects: false }));
        }
        
        // Fetch skills count
        try {
          const skillsResponse = await api.get('/skills');
          setStats(prev => ({ ...prev, skills: skillsResponse.data.length }));
          setLoadingStates(prev => ({ ...prev, skills: false }));
        } catch (err) {
          console.error('Error fetching skills count:', err);
          setLoadingStates(prev => ({ ...prev, skills: false }));
        }
        
        // Fetch achievements count
        try {
          const achievementsResponse = await api.get('/achievements');
          setStats(prev => ({ ...prev, achievements: achievementsResponse.data.length }));
          setLoadingStates(prev => ({ ...prev, achievements: false }));
        } catch (err) {
          console.error('Error fetching achievements count:', err);
          setLoadingStates(prev => ({ ...prev, achievements: false }));
        }
        
        // Fetch blog posts count
        try {
          const blogPostsResponse = await api.get('/blog');
          setStats(prev => ({ ...prev, blogPosts: blogPostsResponse.data.length }));
          setLoadingStates(prev => ({ ...prev, blogPosts: false }));
        } catch (err) {
          console.error('Error fetching blog posts count:', err);
          setLoadingStates(prev => ({ ...prev, blogPosts: false }));
        }
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to load dashboard stats');
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  // Icons for stats cards
  const projectIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );

  const skillsIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  );

  const achievementsIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
  );

  const blogIcon = (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
    </svg>
  );

  if (loading && Object.values(loadingStates).every(state => state === true)) {
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

  // Fetch recent activities from localStorage or use default
  const getRecentActivities = () => {
    try {
      const storedActivities = localStorage.getItem('recentActivities');
      if (storedActivities) {
        return JSON.parse(storedActivities);
      }
    } catch (err) {
      console.error('Error retrieving recent activities:', err);
    }
    
    // Default activities if none in storage
    return [
      { action: 'Added new project', time: '2 hours ago', user: 'Admin' },
      { action: 'Updated skills section', time: 'Yesterday', user: 'Admin' },
      { action: 'Published new blog post', time: '3 days ago', user: 'Admin' },
      { action: 'Added new achievement', time: '1 week ago', user: 'Admin' },
    ];
  };

  const activityData = getRecentActivities();

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatsCard
            title="Projects"
            value={stats.projects}
            icon={projectIcon}
            color="bg-blue-500"
            isLoading={loadingStates.projects}
          />
          
          <StatsCard
            title="Skills"
            value={stats.skills}
            icon={skillsIcon}
            color="bg-purple-500"
            isLoading={loadingStates.skills}
          />
          
          <StatsCard
            title="Achievements"
            value={stats.achievements}
            icon={achievementsIcon}
            color="bg-green-500"
            isLoading={loadingStates.achievements}
          />
          
          <StatsCard
            title="Blog Posts"
            value={stats.blogPosts}
            icon={blogIcon}
            color="bg-yellow-500"
            isLoading={loadingStates.blogPosts}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-6 py-4">
            <h3 className="text-lg font-semibold">Recent Activity</h3>
          </div>
          
          <div className="p-6">
            <ul className="divide-y divide-gray-200">
              {activityData.map((activity, index) => (
                <li key={index} className="py-3 flex items-center">
                  <div className="w-2 h-2 rounded-full bg-blue-500 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time} by {activity.user}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b px-6 py-4">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-2 gap-4">
              <a href="/admin/projects/new" className="bg-gray-100 hover:bg-gray-200 transition-colors p-4 rounded-lg flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium">Add New Project</span>
              </a>
              
              <a href="/admin/skills/new" className="bg-gray-100 hover:bg-gray-200 transition-colors p-4 rounded-lg flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span className="text-sm font-medium">Add New Skill</span>
              </a>
              
              <a href="/admin/blog/new" className="bg-gray-100 hover:bg-gray-200 transition-colors p-4 rounded-lg flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span className="text-sm font-medium">Write Blog Post</span>
              </a>
              
              <a href="/admin/profile" className="bg-gray-100 hover:bg-gray-200 transition-colors p-4 rounded-lg flex flex-col items-center justify-center text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm font-medium">Edit Profile</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverview; 