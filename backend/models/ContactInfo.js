const mongoose = require('mongoose');

const socialLinkSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['linkedin', 'github', 'twitter', 'facebook', 'instagram', 'youtube', 'other'],
    required: true
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'URL must be a valid HTTP/HTTPS URL'
    }
  },
  customName: String
}, { _id: false });

const contactInfoSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Email must be a valid email address'
    }
  },
  phone: {
    type: String,
    trim: true
  },
  linkedin: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'LinkedIn URL must be a valid HTTP/HTTPS URL'
    }
  },
  github: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'GitHub URL must be a valid HTTP/HTTPS URL'
    }
  },
  website: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Website URL must be a valid HTTP/HTTPS URL'
    }
  },
  socialLinks: [socialLinkSchema]
}, {
  timestamps: true,
  collection: 'contactinfo'
});

// Ensure only one contact info document exists
contactInfoSchema.statics.findOrCreate = async function() {
  let contact = await this.findOne();
  if (!contact) {
    contact = await this.create({
      email: 'contact@example.com',
      socialLinks: []
    });
  }
  return contact;
};

module.exports = mongoose.model('ContactInfo', contactInfoSchema);