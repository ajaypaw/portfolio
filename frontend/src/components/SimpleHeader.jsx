import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const SimpleHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('hero');
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Handle scroll events
  useEffect(() => {
    const handleScroll = () => {
      // Check if page is scrolled
      setIsScrolled(window.scrollY > 10);
      
      // Determine active section - only on home page
      if (isHomePage) {
        const sections = ['hero', 'about', 'projects', 'skills', 'achievements', 'contact'];
        
        for (const section of sections.reverse()) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            if (rect.top <= 100) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const navLinks = [
    { href: isHomePage ? '#hero' : '/#hero', label: 'Home', isAnchor: true },
    { href: isHomePage ? '#about' : '/#about', label: 'About', isAnchor: true },
    { href: isHomePage ? '#projects' : '/#projects', label: 'Projects', isAnchor: true },
    { href: isHomePage ? '#skills' : '/#skills', label: 'Skills', isAnchor: true },
    { href: isHomePage ? '#achievements' : '/#achievements', label: 'Achievements', isAnchor: true },
    { href: isHomePage ? '#contact' : '/#contact', label: 'Contact', isAnchor: true },
    { href: '/blog', label: 'Blog', isLinkRouter: true },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300 ${
        isScrolled 
          ? 'glass-effect shadow-md' 
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Logo */}
        <Link 
          to="/"
          className="text-2xl font-bold gradient-text"
        >
          Ajay
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          {navLinks.map((link, index) => (
            link.isLinkRouter ? (
              <Link
                key={index}
                to={link.href}
                className="relative py-2 font-medium transition-colors text-gray-800 hover:text-blue-600"
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={index}
                href={link.href}
                className={`relative py-2 font-medium transition-colors
                  ${isHomePage && activeSection === link.href.split('#')[1] 
                    ? 'text-blue-600' 
                    : 'text-gray-800 hover:text-blue-600'
                  }
                `}
              >
                {link.label}
                {isHomePage && activeSection === link.href.split('#')[1] && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform origin-bottom"></span>
                )}
              </a>
            )
          ))}
        </nav>

        {/* Contact Button and Admin Login */}
        <div className="hidden md:flex items-center space-x-4">
          <a 
            href={isHomePage ? '#contact' : '/#contact'}
            className="btn btn-primary"
          >
            Get in Touch
          </a>
          <Link 
            to="/admin/login"
            className="text-gray-600 hover:text-blue-600 transition-colors"
          >
            Admin
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="md:hidden p-2 text-gray-800 focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <div className="relative w-6 h-5">
            <span 
              className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                isMenuOpen 
                  ? 'rotate-45 top-2' 
                  : 'rotate-0 top-0'
              }`}
            ></span>
            <span 
              className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                isMenuOpen 
                  ? 'opacity-0' 
                  : 'opacity-100 top-2'
              }`}
            ></span>
            <span 
              className={`absolute h-0.5 w-6 bg-current transform transition-all duration-300 ${
                isMenuOpen 
                  ? '-rotate-45 top-2' 
                  : 'rotate-0 top-4'
              }`}
            ></span>
          </div>
        </button>
      </div>

      {/* Mobile Navigation */}
      <div 
        className={`md:hidden bg-white shadow-lg absolute top-full left-0 right-0 overflow-hidden transition-all duration-300 ${
          isMenuOpen 
            ? 'max-h-96 opacity-100' 
            : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="flex flex-col py-4 px-4">
          {navLinks.map((link, index) => (
            link.isLinkRouter ? (
              <Link
                key={index}
                to={link.href}
                className="py-3 px-4 border-l-2 border-transparent hover:border-blue-600 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={index}
                href={link.href}
                className={`py-3 px-4 border-l-2 ${
                  isHomePage && activeSection === link.href.split('#')[1]
                    ? 'border-blue-600 text-blue-600 bg-blue-50'
                    : 'border-transparent hover:border-blue-600 hover:text-blue-600'
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </a>
            )
          ))}
          
          <a
            href={isHomePage ? '#contact' : '/#contact'}
            className="mt-4 mx-4 btn btn-primary text-center"
            onClick={() => setIsMenuOpen(false)}
          >
            Get in Touch
          </a>
          
          <Link
            to="/admin/login"
            className="mt-2 mx-4 text-center py-2 text-gray-600 hover:text-blue-600"
            onClick={() => setIsMenuOpen(false)}
          >
            Admin Login
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default SimpleHeader; 