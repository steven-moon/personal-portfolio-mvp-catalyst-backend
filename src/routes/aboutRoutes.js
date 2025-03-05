// routes/aboutRoutes.js
const express = require('express');
const router = express.Router();
const aboutController = require('../controllers/aboutController');
const { authenticateToken } = require('../middlewares');

// All routes in this file are protected by JWT middleware
// About profile routes
router.get('/', authenticateToken, aboutController.getOrCreateAbout);
router.post('/', authenticateToken, aboutController.createAbout);
router.put('/', authenticateToken, aboutController.updateAbout);
router.delete('/', authenticateToken, aboutController.deleteAbout);

// Work Experience routes
router.get('/work-experiences', authenticateToken, aboutController.getWorkExperiences);
router.post('/work-experiences', authenticateToken, aboutController.createWorkExperience);
router.put('/work-experiences/:id', authenticateToken, aboutController.updateWorkExperience);
router.delete('/work-experiences/:id', authenticateToken, aboutController.deleteWorkExperience);

// Education routes
router.get('/educations', authenticateToken, aboutController.getEducations);
router.post('/educations', authenticateToken, aboutController.createEducation);
router.put('/educations/:id', authenticateToken, aboutController.updateEducation);
router.delete('/educations/:id', authenticateToken, aboutController.deleteEducation);

// TODO: Add similar routes for Skills and Values

module.exports = router; 