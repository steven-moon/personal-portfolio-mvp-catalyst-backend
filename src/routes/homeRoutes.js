const express = require('express');
const { authenticateToken } = require('../middlewares');
const homeController = require('../controllers/homeController');

const router = express.Router();

// HomePage routes
// GET /api/home - Get home page data (public)
router.get('/', homeController.getHomePage);

// POST /api/home - Create home page data (admin only)
router.post('/', authenticateToken, homeController.createHomePage);

// PUT /api/home/:id - Update home page data (admin only)
router.put('/:id', authenticateToken, homeController.updateHomePage);

// Service routes
// GET /api/home/:homePageId/services - Get all services for a home page (public)
router.get('/:homePageId/services', homeController.getAllServices);

// GET /api/home/service/:id - Get a specific service (public)
router.get('/service/:id', homeController.getServiceById);

// POST /api/home/:homePageId/services - Add a service to a home page (admin only)
router.post('/:homePageId/services', authenticateToken, homeController.createService);

// PUT /api/home/service/:id - Update a service (admin only)
router.put('/service/:id', authenticateToken, homeController.updateService);

// DELETE /api/home/service/:id - Delete a service (admin only)
router.delete('/service/:id', authenticateToken, homeController.deleteService);

module.exports = router; 