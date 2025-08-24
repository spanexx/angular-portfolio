const express = require('express');
const router = express.Router();
const { Experience } = require('../models');

// GET /api/experiences - Get all experiences
router.get('/', async (req, res) => {
  try {
    const experiences = await Experience.find()
      .sort({ startDate: -1 }); // Sort by most recent first
      
    res.json({
      success: true,
      data: experiences
    });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching experiences',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/experiences/:id - Get single experience
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }
    
    res.json({
      success: true,
      data: experience
    });
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching experience',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/experiences - Create new experience
router.post('/', async (req, res) => {
  try {
    const experience = new Experience(req.body);
    await experience.save();
    
    res.status(201).json({
      success: true,
      message: 'Experience created successfully',
      data: experience
    });
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating experience',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/experiences/:id - Update experience
router.put('/:id', async (req, res) => {
  try {
    const experience = await Experience.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Experience updated successfully',
      data: experience
    });
  } catch (error) {
    console.error('Error updating experience:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating experience',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/experiences/:id - Delete experience
router.delete('/:id', async (req, res) => {
  try {
    const experience = await Experience.findByIdAndDelete(req.params.id);
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Experience deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting experience',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;