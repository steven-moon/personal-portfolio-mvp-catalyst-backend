const express = require('express');
const { 
  getSiteSettings, 
  createSiteSettings, 
  updateSiteSettings,
  getPublicSiteSettings
} = require('../controllers/siteSettingController');
const { authenticateToken } = require('../middlewares');

const router = express.Router();

// Public routes
router.get('/public', getPublicSiteSettings);

// Protected routes - require authentication
router.get('/', authenticateToken, getSiteSettings);
router.post('/', authenticateToken, createSiteSettings);
router.put('/:id', authenticateToken, updateSiteSettings);

module.exports = router; 