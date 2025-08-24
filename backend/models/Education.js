const mongoose = require('mongoose');

const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: true,
    trim: true
  },
  degree: {
    type: String,
    required: true,
    trim: true
  },
  fieldOfStudy: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: 'Start date must be in YYYY-MM-DD format'
    }
  },
  endDate: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return v === 'Present' || /^\d{4}-\d{2}-\d{2}$/.test(v);
      },
      message: 'End date must be "Present" or in YYYY-MM-DD format'
    }
  },
  description: String,
  location: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Image URL must be a valid HTTP/HTTPS URL'
    }
  }
}, {
  timestamps: true,
  collection: 'educations'
});

// Create index for sorting by start date
educationSchema.index({ startDate: -1 });

module.exports = mongoose.model('Education', educationSchema);