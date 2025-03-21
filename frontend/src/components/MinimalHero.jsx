import React, { useEffect } from 'react';
import { useProfile } from '../context/ProfileContext';
import defaultProfileImg from '../assets/images/1742469132056-ajay.jpg';

const MinimalHero = () => {
  const { profile, projectStats, refreshProjectStats } = useProfile();
  
  // Ensure we have the latest data when component mounts
  useEffect(() => {
    // This logs the current profile data for debugging
    console.log('MinimalHero mounted, profile data:', profile);
    
    // Refresh project stats if they're not yet loaded
    if (projectStats.loading) {
      refreshProjectStats();
    }
  }, []);
  
  return (
    <section className="min-h-screen relative flex items-center py-16">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 -left-24 w-72 h-72 bg-indigo-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 right-1/3 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Text Content */}
          <div className="order-2 lg:order-1">
            <div className="mb-6">
              <div className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium mb-4">
                {profile.title || 'Software Engineer & AI Enthusiast'}
              </div>
              <h1 className="text-5xl md:text-6xl font-bold mb-4 gradient-text">
                Hi, I'm {profile.name || 'Ajay Pawar'}
                <span className="relative inline-block">
                  {profile.name?.split(' ')[0] || 'Ajay'}
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-blue-200 -z-10 transform -rotate-1"></span>
                </span>
              </h1>
              <h2 className="text-xl md:text-2xl text-gray-700 mb-6 font-light">
                {profile.subtitle || 'I design and build innovative digital solutions with cutting-edge technologies'}
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-lg leading-relaxed">
                {profile.bio || 'Passionate about creating meaningful applications that solve real-world problems, specializing in React, AI integration, and IoT solutions.'}
              </p>
            </div>

            {/* Project stats section - show default numbers while loading */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-blue-600">{projectStats.loading ? '12' : projectStats.totalProjects}</div>
                <div className="text-sm text-gray-600">Projects</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-purple-600">{projectStats.loading ? '5' : projectStats.skillCategories}</div>
                <div className="text-sm text-gray-600">Skill Categories</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-green-600">{projectStats.loading ? '7' : projectStats.achievements}</div>
                <div className="text-sm text-gray-600">Achievements</div>
              </div>
              <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-yellow-600">{projectStats.loading ? '4' : projectStats.featuredProjects}</div>
                <div className="text-sm text-gray-600">Featured</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-8">
              <a 
                href="#contact" 
                className="btn btn-primary"
              >
                Let's Talk
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </a>
              <a 
                href="/resume.pdf" 
                className="btn btn-outline"
                download
              >
                Download CV
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path>
                </svg>
              </a>
            </div>

            <div className="flex items-center gap-6">
              <div className="text-sm text-gray-500 font-medium">Follow me:</div>
              <div className="flex gap-4">
                <a 
                  href={profile.social?.github || 'https://github.com/ajaypaw'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:shadow-md transition-all"
                  aria-label="GitHub"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                  </svg>
                </a>
                <a 
                  href={profile.social?.linkedin || 'https://www.linkedin.com/in/ajay-pawarr'}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:shadow-md transition-all"
                  aria-label="LinkedIn"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a 
                  href={profile.social?.twitter || 'https://twitter.com/yourusername'}
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-300 text-gray-600 hover:border-blue-600 hover:text-blue-600 hover:shadow-md transition-all"
                  aria-label="Twitter"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Profile Image */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative">
              <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-2xl animate-float">
                <img 
                  src={profile.image || defaultProfileImg} 
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.log('Image failed to load, using default');
                    e.target.src = defaultProfileImg;
                  }}
                />
              </div>
              
              {/* Decoration elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </div>
              <div className="absolute -bottom-6 -left-6 w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-blue-600 shadow-lg">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll down indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-sm text-gray-500">Scroll Down</span>
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
          </svg>
        </div>
      </div>
    </section>
  );
};

export default MinimalHero; 