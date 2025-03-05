const express = require('express');
const { authenticateToken } = require('../middlewares');
const projectController = require('../controllers/projectController');

const router = express.Router();

// Project routes
// GET /api/projects - Get all projects (public)
router.get('/', projectController.getAllProjects);

// GET /api/projects/:id - Get project by ID (public)
router.get('/:id', projectController.getProjectById);

// POST /api/projects - Create a new project (admin only)
router.post('/', authenticateToken, projectController.createProject);

// PUT /api/projects/:id - Update a project (admin only)
router.put('/:id', authenticateToken, projectController.updateProject);

// DELETE /api/projects/:id - Delete a project (admin only)
router.delete('/:id', authenticateToken, projectController.deleteProject);

// Tag routes
// GET /api/projects/tags/all - Get all tags (public)
router.get('/tags/all', projectController.getAllTags);

// GET /api/projects/tags/:tagName - Get projects by tag (public)
router.get('/tags/:tagName', projectController.getProjectsByTag);

// Project Images routes
// POST /api/projects/:projectId/images - Add an image to a project (admin only)
router.post('/:projectId/images', authenticateToken, projectController.addProjectImage);

// DELETE /api/projects/images/:id - Delete a project image (admin only)
router.delete('/images/:id', authenticateToken, projectController.deleteProjectImage);

module.exports = router; 