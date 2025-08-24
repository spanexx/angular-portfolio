const express = require('express');
const router = express.Router();
const { ContactInfo } = require('../models');

// GET /api/contact - Get contact information
router.get('/', async (req, res) => {
  try {
    const contact = await ContactInfo.findOne();
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact information not found'
      });
    }
    
    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching contact information',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/contact - Update contact information
router.put('/', async (req, res) => {
  try {
    const { email, phone, linkedin, github, website, socialLinks } = req.body;
    
    let contact = await ContactInfo.findOne();
    if (!contact) {
      contact = new ContactInfo({ 
        email, 
        phone, 
        linkedin, 
        github, 
        website, 
        socialLinks 
      });
    } else {
      contact.email = email || contact.email;
      contact.phone = phone || contact.phone;
      contact.linkedin = linkedin || contact.linkedin;
      contact.github = github || contact.github;
      contact.website = website || contact.website;
      contact.socialLinks = socialLinks || contact.socialLinks;
    }
    
    await contact.save();
    
    res.json({
      success: true,
      message: 'Contact information updated successfully',
      data: contact
    });
  } catch (error) {
    console.error('Error updating contact info:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating contact information',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;