import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

const MobileNav = ({ isOpen, setIsOpen }) => {
  // Lock body scroll when mobile nav is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);
  
  // Animation variants
  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };
  
  const menuVariants = {
    hidden: { x: "100%" },
    visible: { x: 0 }
  };
  
  const listItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5
      }
    })
  };
  
  const navLinks = [
    { href: "#hero", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#skills", label: "Skills" },
    { href: "#achievements", label: "Achievements" },
    { href: "#contact", label: "Contact" }
  ];
  
  const handleLinkClick = () => {
    setIsOpen(false);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 z-40"
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu */}
          <motion.div
            className="fixed top-0 right-0 bottom-0 w-4/5 max-w-sm bg-white dark:bg-gray-800 z-50 shadow-xl"
            variants={menuVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ type: "tween", duration: 0.3 }}
          >
            <div className="p-5 flex flex-col h-full">
              {/* Close button */}
              <button 
                onClick={() => setIsOpen(false)}
                className="self-end p-2"
              >
                <X className="w-6 h-6" />
              </button>
              
              {/* Nav links */}
              <nav className="mt-8">
                <ul className="space-y-6">
                  {navLinks.map((link, i) => (
                    <motion.li
                      key={i}
                      custom={i}
                      variants={listItemVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      <a
                        href={link.href}
                        className="text-xl font-medium block px-4 py-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors border-l-4 border-transparent hover:border-blue-600 dark:hover:border-blue-400"
                        onClick={handleLinkClick}
                      >
                        {link.label}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </nav>
              
              {/* Additional links or content */}
              <div className="mt-auto p-4">
                <motion.a
                  href="/resume.pdf"
                  download
                  className="block w-full text-center py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
                  variants={listItemVariants}
                  custom={navLinks.length}
                  initial="hidden"
                  animate="visible"
                >
                  Download Resume
                </motion.a>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileNav; 