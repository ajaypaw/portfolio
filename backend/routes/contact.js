import express from 'express';
import { auth } from '../middleware/auth.js';
import ContactSettings from '../models/ContactSettings.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Default settings - will be used when initializing if no settings exist
const defaultSettings = {
  emailRecipient: 'contact@yourportfolio.com',
  emailSubjectPrefix: '[Portfolio Contact]',
  enableReCaptcha: false,
  reCaptchaKey: '',
  introTitle: 'Get In Touch',
  introText: "Have a question or want to work together? Fill out the form below and I'll get back to you as soon as possible.",
  addressLine1: '123 Portfolio Street',
  addressLine2: 'Web Dev City, 12345',
  phoneNumber: '+1 (555) 123-4567',
  emailAddress: 'contact@yourportfolio.com',
  showSocialLinks: true,
  socialLinks: [
    { platform: 'github', url: 'https://github.com/yourusername', enabled: true },
    { platform: 'linkedin', url: 'https://linkedin.com/in/yourusername', enabled: true },
    { platform: 'twitter', url: 'https://twitter.com/yourusername', enabled: true },
    { platform: 'instagram', url: 'https://instagram.com/yourusername', enabled: false },
    { platform: 'facebook', url: '', enabled: false }
  ]
};

// Helper function to get settings (with auto-initialization)
const getOrCreateSettings = async () => {
  let settings = await ContactSettings.findOne();
  
  if (!settings) {
    // No settings exist, create default settings
    settings = new ContactSettings(defaultSettings);
    await settings.save();
    console.log('Created initial contact settings');
  }
  
  return settings;
};

// @route   GET /api/contact/settings
// @desc    Get contact form settings
// @access  Private
router.get('/settings', auth, async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    res.json(settings);
  } catch (err) {
    console.error('Error getting contact settings:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/contact/public-settings
// @desc    Get contact form settings for public display
// @access  Public
router.get('/public-settings', async (req, res) => {
  try {
    const settings = await getOrCreateSettings();
    
    // Return only the public-safe settings (exclude sensitive data)
    const { emailRecipient, emailSubjectPrefix, enableReCaptcha, reCaptchaKey, ...publicSettings } = settings.toObject();
    res.json(publicSettings);
  } catch (err) {
    console.error('Error getting public contact settings:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/contact/settings
// @desc    Update contact form settings
// @access  Private
router.put('/settings', auth, async (req, res) => {
  try {
    // Get current settings or create if none exist
    let settings = await getOrCreateSettings();
    
    // Update the fields from request body
    Object.keys(req.body).forEach(key => {
      // Special handling for social links to avoid overwriting the entire array
      if (key === 'socialLinks' && Array.isArray(req.body.socialLinks)) {
        settings.socialLinks = req.body.socialLinks;
      } 
      // Update other fields
      else if (key in settings) {
        settings[key] = req.body[key];
      }
    });
    
    // Save changes
    await settings.save();
    
    // Return the updated settings
    res.json(settings);
    
    console.log('Contact settings updated:', settings);
  } catch (err) {
    console.error('Error updating contact settings:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/contact/submit
// @desc    Submit contact form
// @access  Public
router.post('/submit', async (req, res) => {
  try {
    const { name, email, subject, message, recaptchaToken } = req.body;

    // Validate input
    if (!name || !email || !message) {
      return res.status(400).json({ msg: 'Please enter all required fields' });
    }

    // Get settings to check if reCAPTCHA is enabled
    const settings = await getOrCreateSettings();
    
    if (settings.enableReCaptcha && !recaptchaToken) {
      return res.status(400).json({ msg: 'reCAPTCHA verification required' });
    }

    // In a real application, you would:
    // 1. Verify recaptcha if enabled
    // 2. Send an email using nodemailer or similar
    // 3. Store the contact form submission in the database

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    res.json({ success: true, msg: 'Your message has been sent successfully!' });
  } catch (err) {
    console.error('Error submitting contact form:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router; 