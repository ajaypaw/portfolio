import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTrophy, FaCertificate, FaAward, FaMedal, FaEdit, FaTrash } from 'react-icons/fa';
import AchievementForm from './forms/AchievementForm';

const AdminAchievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingAchievement, setEditingAchievement] = useState(null);

  useEffect(() => {
    fetchAchievements();
  }, []);

  const fetchAchievements = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/achievements');
      setAchievements(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch achievements');
      console.error('Error fetching achievements:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this achievement?')) {
      return;
    }

    try {
      await axios.delete(`/api/achievements/${id}`);
      setAchievements(achievements.filter(achievement => achievement._id !== id));
    } catch (err) {
      setError('Failed to delete achievement');
      console.error('Error deleting achievement:', err);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingAchievement) {
        await axios.put(`/api/achievements/${editingAchievement._id}`, formData);
        setAchievements(achievements.map(achievement =>
          achievement._id === editingAchievement._id
            ? { ...achievement, ...formData }
            : achievement
        ));
      } else {
        const response = await axios.post('/api/achievements', formData);
        setAchievements([...achievements, response.data]);
      }
      setShowForm(false);
      setEditingAchievement(null);
      setError(null);
    } catch (err) {
      setError('Failed to save achievement');
      console.error('Error saving achievement:', err);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Certification':
        return <FaCertificate className="w-6 h-6" />;
      case 'Award':
        return <FaAward className="w-6 h-6" />;
      case 'Medal':
        return <FaMedal className="w-6 h-6" />;
      default:
        return <FaTrophy className="w-6 h-6" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Achievements</h2>
        <button
          onClick={() => {
            setEditingAchievement(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add Achievement
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6"
          >
            <AchievementForm
              achievement={editingAchievement}
              onSubmit={handleSubmit}
              onCancel={() => {
                setShowForm(false);
                setEditingAchievement(null);
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((achievement) => (
          <motion.div
            key={achievement._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-blue-500">
                  {getCategoryIcon(achievement.category)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {achievement.title}
                </h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingAchievement(achievement);
                    setShowForm(true);
                  }}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <FaEdit className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(achievement._id)}
                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                >
                  <FaTrash className="w-5 h-5" />
                </button>
              </div>
            </div>

            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {achievement.description}
            </p>

            <div className="mt-4 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
              <span>{achievement.category}</span>
              <span>{formatDate(achievement.date)}</span>
            </div>

            {achievement.image && (
              <div className="mt-4">
                <img
                  src={achievement.image}
                  alt={achievement.title}
                  className="w-full h-32 object-cover rounded-lg"
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {achievements.length === 0 && !loading && (
        <div className="text-center text-gray-500 dark:text-gray-400 py-8">
          No achievements found. Add your first achievement!
        </div>
      )}
    </div>
  );
};

export default AdminAchievements; 