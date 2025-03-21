import React, { useState, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import './App.css'
import { useAuth } from './context/AuthContext'
import { ProfileProvider } from './context/ProfileContext'

// Public components
import SimpleHeader from './components/SimpleHeader'
import MinimalHero from './components/MinimalHero'
import SimpleAbout from './components/SimpleAbout'
import SimpleProjects from './components/SimpleProjects'
import SimpleSkills from './components/SimpleSkills'
import SimpleAchievements from './components/SimpleAchievements'
import SimpleContact from './components/SimpleContact'
import SimpleFooter from './components/SimpleFooter'
import AnimatedBackground from './components/AnimatedBackground'

// Admin components
import Login from './pages/admin/Login'
import AdminDashboard from './components/admin/AdminDashboard'
import PrivateRoute from './components/admin/PrivateRoute'

// Blog components
import BlogList from './components/blog/BlogList'
import BlogPost from './components/blog/BlogPost'

function App() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackground, setShowBackground] = useState(true);

  // Function to handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Effect to show/hide scroll-to-top button based on scroll position
  // and calculate scroll progress
  useEffect(() => {
    const handleScroll = () => {
      // For scroll-to-top button
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }

      // For scroll progress indicator
      const scrollTotal = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = window.scrollY;
      setScrollProgress((scrolled / scrollTotal) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Poppins:wght@500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Check if the current route is admin related
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Hide background on admin routes
  useEffect(() => {
    setShowBackground(!isAdminRoute);
  }, [isAdminRoute]);

  return (
    <div className="min-h-screen overflow-x-hidden bg-gray-50">
      {/* 3D Animated Background */}
      {showBackground && <AnimatedBackground />}
      
      {/* Scroll Progress Indicator - only on non-admin routes */}
      {!isAdminRoute && (
        <div 
          className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-[9999] origin-left"
          style={{ width: `${scrollProgress}%` }}
        ></div>
      )}

      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route 
          path="/admin/*" 
          element={
            <PrivateRoute>
              <ProfileProvider>
                <AdminDashboard />
              </ProfileProvider>
            </PrivateRoute>
          } 
        />

        {/* Blog Routes */}
        <Route path="/blog" element={
          <>
            <SimpleHeader />
            <main className="pt-16">
              <BlogList />
            </main>
            <SimpleFooter />
          </>
        } />
        <Route path="/blog/:id" element={
          <>
            <SimpleHeader />
            <main className="pt-16">
              <BlogPost />
            </main>
            <SimpleFooter />
          </>
        } />

        {/* Main Portfolio Route */}
        <Route path="/" element={
          <ProfileProvider>
            <SimpleHeader />
            <main>
              <div id="hero" className="pt-16"> {/* Add padding-top to accommodate the fixed header */}
                <MinimalHero />
              </div>
              
              <SimpleAbout />
              
              <SimpleProjects />
              
              <SimpleSkills />
              
              <SimpleAchievements />
              
              <SimpleContact />
            </main>
            
            <SimpleFooter />
          </ProfileProvider>
        } />
      </Routes>

      {/* Scroll to top button with improved styling - only on non-admin routes */}
      {!isAdminRoute && showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-3 rounded-full bg-blue-600 text-white shadow-lg hover:bg-blue-700 transition-colors hover:shadow-xl transform hover:scale-110 transition-all z-50"
          aria-label="Scroll to top"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      )}
    </div>
  )
}

export default App
