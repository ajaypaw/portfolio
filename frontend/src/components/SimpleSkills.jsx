import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { motion } from 'framer-motion';
import { FaCode, FaServer, FaDatabase, FaTools, FaMobile, FaCogs } from 'react-icons/fa';

const SimpleSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All']);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setLoading(true);
        // Try multiple endpoints in sequence for better compatibility
        let skillsData = [];
        try {
          const response = await api.get('/api/skills');
          skillsData = response.data;
          console.log('Fetched skills from /api/skills:', skillsData);
        } catch (firstErr) {
          console.log('First endpoint failed, trying alternative endpoint');
          const response = await api.get('/skills');
          skillsData = response.data;
          console.log('Fetched skills from /skills:', skillsData);
        }
        
        setSkills(skillsData);
        
        // Extract unique categories
        const uniqueCategories = [...new Set(skillsData.map(skill => skill.category))];
        setCategories(['All', ...uniqueCategories]);
        
        setError(null);
      } catch (err) {
        console.error('Error fetching skills:', err);
        setError('Failed to load skills. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Frontend':
        return <FaCode className="w-6 h-6" />;
      case 'Backend':
        return <FaServer className="w-6 h-6" />;
      case 'Database':
        return <FaDatabase className="w-6 h-6" />;
      case 'DevOps':
        return <FaTools className="w-6 h-6" />;
      case 'Mobile':
        return <FaMobile className="w-6 h-6" />;
      case 'Machine Learning':
        return <FaCogs className="w-6 h-6" />;
      default:
        return <FaCogs className="w-6 h-6" />;
    }
  };

  // Filter skills based on selected category
  const filteredSkills = selectedCategory === 'All'
    ? skills
    : skills.filter(skill => skill.category === selectedCategory);

  if (loading) {
    return (
      <section id="skills" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Skills</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Loading skills...</p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="skills" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Skills</h2>
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="skills" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Skills</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Here are my technical skills and expertise in various technologies.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSkills.length > 0 ? (
            filteredSkills.map((skill, index) => (
              <motion.div
                key={skill._id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="flex items-center mb-4">
                  <div className="text-blue-600 mr-3">
                    {getCategoryIcon(skill.category)}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">{skill.name}</h3>
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Proficiency</span>
                    <span>{skill.proficiency}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${skill.proficiency}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-sm text-gray-600">
                  Category: {skill.category}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-gray-600">No skills found in this category.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default SimpleSkills; 