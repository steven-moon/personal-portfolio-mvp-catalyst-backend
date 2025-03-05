// controllers/userController.js
const { User } = require('../models');
const BaseRepository = require('../models/BaseRepository');
const userRepo = new BaseRepository(User);

// Get all users (protected)
async function getAllUsers(req, res, next) {
  try {
    const users = await userRepo.getAll({
      attributes: { exclude: ['password'] }  // don't return passwords
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
}

// Get a specific user by ID (protected)
async function getUserById(req, res, next) {
  try {
    const userId = req.params.id;
    const user = await userRepo.getById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Exclude password from response
    const userJson = user.toJSON();
    delete userJson.password;
    
    res.json(userJson);
  } catch (err) {
    next(err);
  }
}

// Update a user by ID (protected)
async function updateUser(req, res, next) {
  try {
    const userId = req.params.id;
    
    // Check if user is updating their own profile or is an admin
    if (req.user.id != userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this user' });
    }
    
    const { username, email, password, isActive, role } = req.body;
    
    // Only allow role updates if user is an admin
    if (role && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update role' });
    }
    
    // Build update object with only provided fields
    let updatedFields = {};
    if (username) updatedFields.username = username;
    if (email) updatedFields.email = email;
    if (password) updatedFields.password = password; // Hashing handled by model hooks
    if (isActive !== undefined) updatedFields.isActive = isActive;
    if (role && req.user.role === 'admin') updatedFields.role = role;
    
    const [affectedCount] = await userRepo.update(userId, updatedFields);
    
    if (affectedCount === 0) {
      return res.status(404).json({ error: 'User not found or no changes' });
    }
    
    // Return the updated user (without password)
    const updatedUser = await userRepo.getById(userId);
    const userJson = updatedUser.toJSON();
    delete userJson.password;
    
    res.json({
      message: 'User updated successfully',
      user: userJson
    });
  } catch (err) {
    next(err);
  }
}

// Delete a user by ID (protected, admin only)
async function deleteUser(req, res, next) {
  try {
    const userId = req.params.id;
    
    // Only allow admins to delete users, or users to delete themselves
    if (req.user.id != userId && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this user' });
    }
    
    const deletedCount = await userRepo.delete(userId);
    if (deletedCount === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAllUsers, getUserById, updateUser, deleteUser }; 