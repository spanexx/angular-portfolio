const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true,
    trim: true
  },
  role: {
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
  responsibilities: [{
    type: String,
    required: true
  }],
  imageUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Image URL must be a valid HTTP/HTTPS URL'
    }
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
    default: 'Full-time'
  }
}, {
  timestamps: true,
  collection: 'experiences'
});

// Create index for sorting by start date
experienceSchema.index({ startDate: -1 });

module.exports = mongoose.model('Experience', experienceSchema);