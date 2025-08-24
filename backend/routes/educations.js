const express = require('express');
const router = express.Router();
const { Education } = require('../models');

// GET /api/educations - Get all educations
router.get('/', async (req, res) => {
  try {
    const educations = await Education.find()
      .sort({ startDate: -1 }); // Sort by most recent first
      
    res.json({
      success: true,
      data: educations
    });
  } catch (error) {
    console.error('Error fetching educations:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching educations',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/educations/:id - Get single education
router.get('/:id', async (req, res) => {
  try {
    const education = await Education.findById(req.params.id);
    
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education not found'
      });
    }
    
    res.json({
      success: true,
      data: education
    });
  } catch (error) {
    console.error('Error fetching education:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching education',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/educations - Create new education
router.post('/', async (req, res) => {
  try {
    const education = new Education(req.body);
    await education.save();
    
    res.status(201).json({
      success: true,
      message: 'Education created successfully',
      data: education
    });
  } catch (error) {
    console.error('Error creating education:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating education',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/educations/:id - Update education
router.put('/:id', async (req, res) => {
  try {
    const education = await Education.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Education updated successfully',
      data: education
    });
  } catch (error) {
    console.error('Error updating education:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating education',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/educations/:id - Delete education
router.delete('/:id', async (req, res) => {
  try {
    const education = await Education.findByIdAndDelete(req.params.id);
    
    if (!education) {
      return res.status(404).json({
        success: false,
        message: 'Education not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Education deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting education:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting education',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;