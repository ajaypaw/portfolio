import React, { useState, useEffect } from 'react';
import api from '../../../utils/axios';

const AdminContactEditor = () => {
  const [formData, setFormData] = useState({
    emailRecipient: '',
    emailSubjectPrefix: '[Portfolio Contact]',
    enableReCaptcha: false,
    reCaptchaKey: '',
    introTitle: 'Get In Touch',
    introText: "Have a question or want to work together? Fill out the form below and I'll get back to you as soon as possible.",
    addressLine1: '',
    addressLine2: '',
    phoneNumber: '',
    emailAddress: '',
    showSocialLinks: true
  });

  const [socialLinks, setSocialLinks] = useState([
    { platform: 'github', url: '', enabled: true },
    { platform: 'linkedin', url: '', enabled: true },
    { platform: 'twitter', url: '', enabled: true },
    { platform: 'instagram', url: '', enabled: false },
    { platform: 'facebook', url: '', enabled: false }
  ]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Fetch contact settings
  useEffect(() => {
    const fetchContactSettings = async () => {
      try {
        setLoading(true);
        console.log('Admin: Fetching contact settings...');
        
        // Fetch from API
        const response = await api.get('/contact/settings');
        console.log('Admin: Contact settings received:', response.data);
        
        if (response.data) {
          // Handle case where socialLinks might be coming as part of the main object
          const { socialLinks: fetchedSocialLinks, ...otherSettings } = response.data;
          setFormData(otherSettings);
          
          if (fetchedSocialLinks && Array.isArray(fetchedSocialLinks) && fetchedSocialLinks.length > 0) {
            console.log('Admin: Setting social links:', fetchedSocialLinks);
            setSocialLinks(fetchedSocialLinks);
          } else {
            console.log('Admin: No social links found in response');
          }
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching contact settings:', err);
        setError(`Failed to load contact settings: ${err.message || 'Unknown error'}. Please try again.`);
      } finally {
        setLoading(false);
      }
    };

    fetchContactSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSocialLinkChange = (index, field, value) => {
    const updatedLinks = [...socialLinks];
    updatedLinks[index] = {
      ...updatedLinks[index],
      [field]: field === 'enabled' ? value : value
    };
    setSocialLinks(updatedLinks);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const updatedSettings = await api.post('/contact/settings', formData);
      setFormData(updatedSettings.data);
      setSocialLinks(updatedSettings.data.socialLinks || []);
      setSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error saving contact settings:', err);
      setError('Failed to save contact settings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 flex-col">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-600">Loading contact settings...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Contact Settings</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Contact settings saved successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">Email Configuration</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emailRecipient">
                Email Recipient
              </label>
              <input
                type="email"
                id="emailRecipient"
                name="emailRecipient"
                value={formData.emailRecipient}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="email@example.com"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emailSubjectPrefix">
                Email Subject Prefix
              </label>
              <input
                type="text"
                id="emailSubjectPrefix"
                name="emailSubjectPrefix"
                value={formData.emailSubjectPrefix}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="[Portfolio Contact]"
              />
            </div>
            
            <div className="mb-4">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="enableReCaptcha"
                  name="enableReCaptcha"
                  checked={formData.enableReCaptcha}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-gray-700 text-sm font-bold" htmlFor="enableReCaptcha">
                  Enable reCAPTCHA
                </label>
              </div>
            </div>
            
            {formData.enableReCaptcha && (
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="reCaptchaKey">
                  reCAPTCHA Site Key
                </label>
                <input
                  type="text"
                  id="reCaptchaKey"
                  name="reCaptchaKey"
                  value={formData.reCaptchaKey}
                  onChange={handleInputChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="6Ldxxxxxxxxxxxxxxxxxxxxxx"
                />
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Section Intro</h3>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="introTitle">
                Section Title
              </label>
              <input
                type="text"
                id="introTitle"
                name="introTitle"
                value={formData.introTitle}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Get In Touch"
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="introText">
                Introduction Text
              </label>
              <textarea
                id="introText"
                name="introText"
                value={formData.introText}
                onChange={handleInputChange}
                rows="4"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Have a question or want to work together? Fill out the form below..."
              ></textarea>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="addressLine1">
                Address Line 1
              </label>
              <input
                type="text"
                id="addressLine1"
                name="addressLine1"
                value={formData.addressLine1}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="123 Portfolio Street"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="addressLine2">
                Address Line 2
              </label>
              <input
                type="text"
                id="addressLine2"
                name="addressLine2"
                value={formData.addressLine2}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Web Dev City, 12345"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="phoneNumber">
                Phone Number
              </label>
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="+1 (555) 123-4567"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="emailAddress">
                Email Address
              </label>
              <input
                type="email"
                id="emailAddress"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="contact@example.com"
              />
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Social Links</h3>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="showSocialLinks"
                name="showSocialLinks"
                checked={formData.showSocialLinks}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label className="ml-2 block text-gray-700 text-sm font-bold" htmlFor="showSocialLinks">
                Show Social Links in Contact Section
              </label>
            </div>
          </div>
          
          {formData.showSocialLinks && (
            <div className="space-y-4">
              {socialLinks.map((link, index) => (
                <div key={link.platform} className="flex flex-wrap items-center gap-4">
                  <div className="w-32">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`${link.platform}Enabled`}
                        checked={link.enabled}
                        onChange={(e) => handleSocialLinkChange(index, 'enabled', e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label className="ml-2 capitalize" htmlFor={`${link.platform}Enabled`}>
                        {link.platform}
                      </label>
                    </div>
                  </div>
                  <div className="flex-1">
                    <input
                      type="url"
                      placeholder={`https://${link.platform}.com/yourusername`}
                      value={link.url}
                      onChange={(e) => handleSocialLinkChange(index, 'url', e.target.value)}
                      disabled={!link.enabled}
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-blue-300"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminContactEditor; 