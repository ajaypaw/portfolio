import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

// Import admin section components
import AdminOverview from './sections/AdminOverview';
import AdminProjectsEditor from './sections/AdminProjectsEditor';
import AdminSkillsEditor from './sections/AdminSkillsEditor';
import AdminAchievementsEditor from './sections/AdminAchievementsEditor';
import AdminBlogEditor from './sections/AdminBlogEditor';
import AdminProfile from './sections/AdminProfile';
import AdminContactEditor from './sections/AdminContactEditor';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Navigation items
  const navItems = [
    { path: '/admin/dashboard', label: 'Overview', icon: 'grid' },
    { path: '/admin/projects', label: 'Projects', icon: 'briefcase' },
    { path: '/admin/skills', label: 'Skills', icon: 'star' },
    { path: '/admin/achievements', label: 'Achievements', icon: 'award' },
    { path: '/admin/blog', label: 'Blog', icon: 'edit-3' },
    { path: '/admin/contact', label: 'Contact', icon: 'mail' },
    { path: '/admin/profile', label: 'Profile', icon: 'user' },
  ];

  // Check if a nav item is active
  const isActive = (path) => {
    if (path === '/admin/dashboard') {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  // Render icon based on name
  const renderIcon = (iconName) => {
    switch (iconName) {
      case 'grid':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7"></rect>
            <rect x="14" y="3" width="7" height="7"></rect>
            <rect x="14" y="14" width="7" height="7"></rect>
            <rect x="3" y="14" width="7" height="7"></rect>
          </svg>
        );
      case 'briefcase':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
          </svg>
        );
      case 'star':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        );
      case 'award':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="7"></circle>
            <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline>
          </svg>
        );
      case 'edit-3':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"></path>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
          </svg>
        );
      case 'user':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
            <circle cx="12" cy="7" r="4"></circle>
          </svg>
        );
      case 'log-out':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        );
      case 'mail':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
            <polyline points="22,6 12,13 2,6"></polyline>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside 
        className={`${
          isSidebarOpen ? 'w-64' : 'w-20'
        } bg-gray-800 text-white transition-all duration-300 ease-in-out`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between">
            {isSidebarOpen && (
              <span className="text-xl font-semibold">Admin Portal</span>
            )}
            <button 
              onClick={toggleSidebar}
              className="p-1 rounded-lg hover:bg-gray-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
        
        <nav className="mt-2">
          <ul>
            {navItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className={`flex items-center py-3 px-6 transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-700 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                >
                  <span className="mr-3">{renderIcon(item.icon)}</span>
                  {isSidebarOpen && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
            
            <li className="mt-auto">
              <button
                onClick={handleLogout}
                className="flex items-center w-full py-3 px-6 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <span className="mr-3">{renderIcon('log-out')}</span>
                {isSidebarOpen && <span>Logout</span>}
              </button>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto">
        {/* Header */}
        <header className="bg-white shadow-sm py-4 px-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">
            {navItems.find(item => isActive(item.path))?.label || 'Dashboard'}
          </h1>
          
          <div className="flex items-center">
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="mr-6 text-gray-600 hover:text-blue-600 transition-colors"
            >
              View Website
            </a>
            
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">
                {user?.name || user?.email || 'Admin'}
              </span>
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                {(user?.name || user?.email || 'A').charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>
        
        {/* Page Content */}
        <div className="p-6">
          <Routes>
            <Route path="/dashboard" element={<AdminOverview />} />
            <Route path="/projects/*" element={<AdminProjectsEditor />} />
            <Route path="/skills/*" element={<AdminSkillsEditor />} />
            <Route path="/achievements/*" element={<AdminAchievementsEditor />} />
            <Route path="/blog/*" element={<AdminBlogEditor />} />
            <Route path="/contact" element={<AdminContactEditor />} />
            <Route path="/profile" element={<AdminProfile />} />
            <Route path="*" element={<Navigate to="/admin/dashboard" />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard; 