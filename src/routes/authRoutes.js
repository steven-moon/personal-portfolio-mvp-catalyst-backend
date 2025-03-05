// routes/authRoutes.js
const express = require('express');
const router = express.Router();
// This controller will be implemented in Step 6
const authController = require('../controllers/authController');

// Public routes for authentication
router.post('/signup', authController.signup);
router.post('/signin', authController.signin);

module.exports = router; 