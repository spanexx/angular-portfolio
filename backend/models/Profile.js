const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  bio: {
    type: String,
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
  location: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  collection: 'profiles'
});

// Ensure only one profile document exists
profileSchema.statics.findOrCreate = async function() {
  let profile = await this.findOne();
  if (!profile) {
    profile = await this.create({
      name: 'Portfolio Owner',
      title: 'Developer',
      bio: 'Professional bio goes here'
    });
  }
  return profile;
};

module.exports = mongoose.model('Profile', profileSchema);