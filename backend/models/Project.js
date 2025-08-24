const mongoose = require('mongoose');

const projectVideoSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Video URL must be a valid HTTP/HTTPS URL'
    }
  },
  title: {
    type: String,
    required: true
  },
  thumbnail: String,
  duration: Number,
  type: {
    type: String,
    enum: ['demo', 'tutorial', 'overview', 'feature'],
    default: 'demo'
  }
}, { _id: false });

const projectImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Image URL must be a valid HTTP/HTTPS URL'
    }
  },
  alt: {
    type: String,
    required: true
  },
  caption: String,
  type: {
    type: String,
    enum: ['screenshot', 'diagram', 'architecture', 'ui', 'result'],
    default: 'screenshot'
  },
  width: Number,
  height: Number
}, { _id: false });

const projectMediaSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['image', 'video', 'youtube'],
    required: true
  },
  url: {
    type: String,
    required: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'Media URL must be a valid HTTP/HTTPS URL'
    }
  },
  title: {
    type: String,
    required: true
  },
  thumbnail: String,
  metadata: {
    duration: Number,
    dimensions: {
      width: Number,
      height: Number
    },
    fileSize: Number
  }
}, { _id: false });

const projectSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  technologies: [{
    type: String,
    trim: true
  }],
  status: {
    type: String,
    enum: ['Active', 'Completed', 'Archived', 'In Progress'],
    required: true
  },
  imageUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Image URL must be a valid HTTP/HTTPS URL'
    }
  },
  projectUrl: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Project URL must be a valid HTTP/HTTPS URL'
    }
  },
  viewLink: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'View link must be a valid HTTP/HTTPS URL'
    }
  },
  githubLink: {
    type: String,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'GitHub link must be a valid HTTP/HTTPS URL'
    }
  },
  inProgress: {
    type: Boolean,
    default: false
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    validate: {
      validator: function(v) {
        return v == null || (v >= 0 && v <= 100);
      },
      message: 'Progress must be between 0 and 100'
    }
  },
  features: [String],
  youtubeVideos: [projectVideoSchema],
  githubImages: [projectImageSchema],
  gallery: [projectMediaSchema]
}, {
  timestamps: true,
  collection: 'projects'
});

// Create indexes
projectSchema.index({ id: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ technologies: 1 });

module.exports = mongoose.model('Project', projectSchema);