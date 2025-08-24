const express = require('express');
const router = express.Router();
const { Certification } = require('../models');

// GET /api/certifications - Get all certifications
router.get('/', async (req, res) => {
  try {
    const certifications = await Certification.find()
      .sort({ date: -1 }); // Sort by most recent first
      
    res.json({
      success: true,
      data: certifications
    });
  } catch (error) {
    console.error('Error fetching certifications:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching certifications',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/certifications/:id - Get single certification
router.get('/:id', async (req, res) => {
  try {
    const certification = await Certification.findById(req.params.id);
    
    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }
    
    res.json({
      success: true,
      data: certification
    });
  } catch (error) {
    console.error('Error fetching certification:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching certification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/certifications - Create new certification
router.post('/', async (req, res) => {
  try {
    const certification = new Certification(req.body);
    await certification.save();
    
    res.status(201).json({
      success: true,
      message: 'Certification created successfully',
      data: certification
    });
  } catch (error) {
    console.error('Error creating certification:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating certification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/certifications/:id - Update certification
router.put('/:id', async (req, res) => {
  try {
    const certification = await Certification.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Certification updated successfully',
      data: certification
    });
  } catch (error) {
    console.error('Error updating certification:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating certification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/certifications/:id - Delete certification
router.delete('/:id', async (req, res) => {
  try {
    const certification = await Certification.findByIdAndDelete(req.params.id);
    
    if (!certification) {
      return res.status(404).json({
        success: false,
        message: 'Certification not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Certification deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting certification:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting certification',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;