const express = require('express');
const { authenticateToken } = require('../middlewares');
const contactController = require('../controllers/contactController');

const router = express.Router();

// ContactInfo routes
// GET /api/contact - Get contact information (public)
router.get('/', contactController.getContactInfo);

// POST /api/contact - Create contact information (admin only)
router.post('/', authenticateToken, contactController.createContactInfo);

// PUT /api/contact/:id - Update contact information (admin only)
router.put('/:id', authenticateToken, contactController.updateContactInfo);

// SocialMedia routes
// GET /api/contact/:contactInfoId/social-media - Get all social media for a contact (public)
router.get('/:contactInfoId/social-media', contactController.getSocialMedia);

// POST /api/contact/:contactInfoId/social-media - Add social media to a contact (admin only)
router.post('/:contactInfoId/social-media', authenticateToken, contactController.createSocialMedia);

// PUT /api/contact/social-media/:id - Update a social media entry (admin only)
router.put('/social-media/:id', authenticateToken, contactController.updateSocialMedia);

// DELETE /api/contact/social-media/:id - Delete a social media entry (admin only)
router.delete('/social-media/:id', authenticateToken, contactController.deleteSocialMedia);

module.exports = router; 