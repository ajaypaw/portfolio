import React, { useState, useEffect } from 'react';
import api from '../utils/axios';
import { motion } from 'framer-motion';
import { FaTrophy, FaCertificate, FaAward } from 'react-icons/fa';

const SimpleAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedType, setSelectedType] = useState('all');

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      console.log('Fetching achievements from API...');
      const response = await api.get('/api/achievements');
      console.log('Fetched achievements:', response.data);
      setAchievements(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching achievements:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        config: err.config
      });
      setError('Failed to load achievements. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Get unique types from achievements, filtering out undefined/null values
  const types = ['all', ...new Set(achievements
    .map(achievement => achievement.category)
    .filter(type => type))];

  const filteredAchievements = selectedType === 'all'
    ? achievements
    : achievements.filter(achievement => achievement.category === selectedType);

  const getIcon = (category) => {
    switch (category?.toLowerCase()) {
      case 'certification':
        return <FaCertificate className="w-6 h-6" />;
      case 'award':
        return <FaAward className="w-6 h-6" />;
      default:
        return <FaTrophy className="w-6 h-6" />;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
        </div>
      );
    }

    return (
      <>
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {types.map(type => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                selectedType === type
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="text-blue-600">
                  {getIcon(achievement.category)}
                </div>
                <span className="inline-block px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
                  {achievement.category || 'Achievement'}
                </span>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {achievement.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {achievement.description}
              </p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{achievement.issuer || 'Issuer not specified'}</span>
                <span>{new Date(achievement.date).toLocaleDateString()}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-600 dark:text-gray-300">
              No achievements found in this category.
            </p>
          </div>
        )}
      </>
    );
  };

  return (
    <section id="achievements" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            My Achievements
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            A collection of my certifications, awards, and notable accomplishments throughout my career.
          </p>
        </motion.div>

        {renderContent()}
      </div>
    </section>
  );
};

export default SimpleAchievements; 