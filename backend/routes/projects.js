const express = require('express');
const router = express.Router();
const { Project } = require('../models');

// GET /api/projects - Get all projects with optional filtering
router.get('/', async (req, res) => {
  try {
    const { status, inProgress, limit, page } = req.query;
    const query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (inProgress !== undefined) {
      query.inProgress = inProgress === 'true';
    }
    
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 50;
    const skip = (pageNum - 1) * limitNum;
    
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);
      
    const total = await Project.countDocuments(query);
    
    res.json({
      success: true,
      data: projects,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/projects/completed - Get completed projects
router.get('/completed', async (req, res) => {
  try {
    const projects = await Project.find({ status: 'Completed' })
      .sort({ createdAt: -1 });
      
    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching completed projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching completed projects',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/projects/in-progress - Get projects in progress
router.get('/in-progress', async (req, res) => {
  try {
    const projects = await Project.find({ 
      $or: [
        { status: 'Active' },
        { status: 'In Progress' },
        { inProgress: true }
      ]
    }).sort({ createdAt: -1 });
      
    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    console.error('Error fetching projects in progress:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching projects in progress',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /api/projects/:id - Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findOne({ id: req.params.id });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error fetching project:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching project',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// POST /api/projects - Create new project
router.post('/', async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    
    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(400).json({
      success: false,
      message: 'Error creating project',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// PUT /api/projects/:id - Update project
router.put('/:id', async (req, res) => {
  try {
    const project = await Project.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    console.error('Error updating project:', error);
    res.status(400).json({
      success: false,
      message: 'Error updating project',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// DELETE /api/projects/:id - Delete project
router.delete('/:id', async (req, res) => {
  try {
    const project = await Project.findOneAndDelete({ id: req.params.id });
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting project',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;