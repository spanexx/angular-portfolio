const express = require('express');
const router = express.Router();
const { Profile } = require('../models');

// GET /api/profile - Get profile information
router.get('/', async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }
    
    res.json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/profile - Update profile information
router.put('/', async (req, res) => {
  try {
    const { name, title, bio, imageUrl, location } = req.body;
    
    let profile = await Profile.findOne();
    if (!profile) {
      profile = new Profile({ name, title, bio, imageUrl, location });
    } else {
      profile.name = name || profile.name;
      profile.title = title || profile.title;
      profile.bio = bio || profile.bio;
      profile.imageUrl = imageUrl || profile.imageUrl;
      profile.location = location || profile.location;
    }
    
    await profile.save();
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: profile
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating profile',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;