import mongoose from 'mongoose';

const socialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    required: true,
    enum: ['github', 'linkedin', 'twitter', 'instagram', 'facebook']
  },
  url: {
    type: String,
    default: ''
  },
  enabled: {
    type: Boolean,
    default: true
  }
});

const contactSettingsSchema = new mongoose.Schema({
  emailRecipient: {
    type: String,
    default: 'contact@yourportfolio.com'
  },
  emailSubjectPrefix: {
    type: String,
    default: '[Portfolio Contact]'
  },
  enableReCaptcha: {
    type: Boolean,
    default: false
  },
  reCaptchaKey: {
    type: String,
    default: ''
  },
  introTitle: {
    type: String,
    default: 'Get In Touch'
  },
  introText: {
    type: String,
    default: "Have a question or want to work together? Fill out the form below and I'll get back to you as soon as possible."
  },
  addressLine1: {
    type: String,
    default: ''
  },
  addressLine2: {
    type: String,
    default: ''
  },
  phoneNumber: {
    type: String,
    default: ''
  },
  emailAddress: {
    type: String,
    default: 'contact@yourportfolio.com'
  },
  showSocialLinks: {
    type: Boolean,
    default: true
  },
  socialLinks: {
    type: [socialLinkSchema],
    default: [
      { platform: 'github', url: 'https://github.com/yourusername', enabled: true },
      { platform: 'linkedin', url: 'https://linkedin.com/in/yourusername', enabled: true },
      { platform: 'twitter', url: 'https://twitter.com/yourusername', enabled: true },
      { platform: 'instagram', url: 'https://instagram.com/yourusername', enabled: false },
      { platform: 'facebook', url: '', enabled: false }
    ]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
contactSettingsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model('ContactSettings', contactSettingsSchema); 