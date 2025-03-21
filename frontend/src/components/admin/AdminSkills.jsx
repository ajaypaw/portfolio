import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaCode, FaServer, FaDatabase, FaTools, FaMobile, FaCogs } from 'react-icons/fa';
import SkillForm from './forms/SkillForm';

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const response = await axios.get('/api/skills');
      setSkills(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching skills:', err);
      setError('Failed to load skills');
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this skill?')) return;

    try {
      await axios.delete(`/api/skills/${id}`);
      setSkills(skills.filter(skill => skill._id !== id));
    } catch (err) {
      console.error('Error deleting skill:', err);
      setError('Failed to delete skill');
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingSkill) {
        await axios.put(`/api/skills/${editingSkill._id}`, formData);
        setSkills(skills.map(skill => 
          skill._id === editingSkill._id ? { ...skill, ...formData } : skill
        ));
      } else {
        const response = await axios.post('/api/skills', formData);
        setSkills([...skills, response.data]);
      }
      setShowForm(false);
      setEditingSkill(null);
    } catch (err) {
      console.error('Error saving skill:', err);
      setError('Failed to save skill');
    }
  };

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
      default:
        return <FaCogs className="w-6 h-6" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Skills Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FaPlus className="mr-2" />
          Add New Skill
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-8"
        >
          <SkillForm
            skill={editingSkill}
            onSubmit={handleSubmit}
            onCancel={() => {
              setShowForm(false);
              setEditingSkill(null);
            }}
          />
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {skills.map((skill) => (
          <motion.div
            key={skill._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                  {getCategoryIcon(skill.category)}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {skill.name}
                </h3>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    setEditingSkill(skill);
                    setShowForm(true);
                  }}
                  className="p-2 text-blue-600 hover:text-blue-700"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(skill._id)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                <span>Proficiency</span>
                <span>{skill.proficiency}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${skill.proficiency}%` }}
                ></div>
              </div>
            </div>

            <div className="text-sm text-gray-600 dark:text-gray-300">
              Category: {skill.category}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default AdminSkills; 