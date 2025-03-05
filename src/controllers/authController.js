// controllers/authController.js
const jwt = require('jsonwebtoken');
const { User } = require('../models');
const { Op } = require('sequelize');  // Import Op directly from sequelize

// JWT configuration
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

/**
 * User signup
 * @route POST /api/auth/signup
 */
async function signup(req, res, next) {
  try {
    // Log request without exposing sensitive data
    const { password, ...safeData } = req.body;
    console.log('[DEBUG] signup request received:', safeData);
    const { username, email } = req.body;

    // Check if required fields are provided
    if (!username || !email || !password) {
      console.log('[DEBUG] Missing required fields in signup request');
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Username, email, and password are required',
      });
    }

    // Check if user already exists
    console.log('[DEBUG] Checking if user already exists');
    try {
      const existingUser = await User.findOne({
        where: {
          [Op.or]: [{ username }, { email }],  // Use Op directly
        },
      });

      if (existingUser) {
        console.log('[DEBUG] User already exists with same username or email');
        return res.status(409).json({
          error: 'User already exists',
          message: 'A user with that username or email already exists',
        });
      }
    } catch (err) {
      console.error('[ERROR] Error checking existing user:', err);
      throw err;
    }

    // Create new user
    console.log('[DEBUG] Creating new user');
    try {
      const newUser = await User.create({
        username,
        email,
        password, // Will be hashed by User model hooks
        role: 'user', // Default role
      });
      console.log('[DEBUG] User created successfully:', newUser.id);

      // Generate JWT token
      const token = jwt.sign(
        { 
          id: newUser.id, 
          username: newUser.username,
          role: newUser.role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      // Return user data (excluding password) and token
      res.status(201).json({
        message: 'User created successfully',
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
        },
        token,
      });
    } catch (err) {
      console.error('[ERROR] Error creating new user:', err);
      throw err;
    }
  } catch (error) {
    console.error('[ERROR] Signup error details:', error);
    if (error.name) console.error('[ERROR] Error name:', error.name);
    if (error.message) console.error('[ERROR] Error message:', error.message);
    if (error.stack) console.error('[ERROR] Error stack:', error.stack);
    if (error.errors) console.error('[ERROR] Validation errors:', error.errors);
    
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to create user account',
    });
  }
}

/**
 * User signin
 * @route POST /api/auth/signin
 */
async function signin(req, res, next) {
  try {
    const { username, password } = req.body;

    // Check if required fields are provided
    if (!username || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Username and password are required',
      });
    }

    // Find the user - using unscoped to include password field
    const user = await User.unscoped().findOne({
      where: {
        // Allow signin with either username or email
        [Op.or]: [  // Use Op directly
          { username },
          { email: username } // Support login with email too
        ],
      },
    });

    // Check if user exists
    if (!user) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid username or password',
      });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(403).json({
        error: 'Account inactive',
        message: 'Your account has been deactivated',
      });
    }

    // Validate password
    const isPasswordValid = await user.isValidPassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Authentication failed',
        message: 'Invalid username or password',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id, 
        username: user.username,
        role: user.role
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    // Return user data (excluding password) and token
    res.status(200).json({
      message: 'Authentication successful',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      token,
    });
  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({
      error: 'Server error',
      message: 'Failed to authenticate user',
    });
  }
}

module.exports = { signup, signin }; 