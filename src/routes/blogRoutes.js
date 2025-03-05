const express = require('express');
const { authenticateToken, upload } = require('../middlewares');
const blogController = require('../controllers/blogController');

const router = express.Router();

// Category routes
// GET /api/blog/categories - Get all categories (public)
router.get('/categories', blogController.getAllCategories);

// GET /api/blog/categories/:id - Get category by ID (public)
router.get('/categories/:id', blogController.getCategoryById);

// POST /api/blog/categories - Create a new category (admin only)
router.post('/categories', authenticateToken, blogController.createCategory);

// PUT /api/blog/categories/:id - Update a category (admin only)
router.put('/categories/:id', authenticateToken, blogController.updateCategory);

// DELETE /api/blog/categories/:id - Delete a category (admin only)
router.delete('/categories/:id', authenticateToken, blogController.deleteCategory);

// Blog post routes
// GET /api/blog/posts - Get all blog posts (public)
router.get('/posts', blogController.getAllBlogPosts);

// GET /api/blog/posts/:id - Get blog post by ID (public)
router.get('/posts/:id', blogController.getBlogPostById);

// POST /api/blog/posts - Create a new blog post (authenticated)
router.post('/posts', authenticateToken, blogController.createBlogPost);

// PUT /api/blog/posts/:id - Update a blog post (authenticated, author or admin)
router.put('/posts/:id', authenticateToken, blogController.updateBlogPost);

// DELETE /api/blog/posts/:id - Delete a blog post (authenticated, author or admin)
router.delete('/posts/:id', authenticateToken, blogController.deleteBlogPost);

// GET /api/blog/authors/:id/posts - Get blog posts by author (public)
router.get('/authors/:id/posts', blogController.getBlogPostsByAuthor);

// GET /api/blog/categories/:id/posts - Get blog posts by category (public)
router.get('/categories/:id/posts', blogController.getBlogPostsByCategory);

// Image upload route
// POST /api/blog/upload-image - Upload a blog image (authenticated)
router.post('/upload-image', authenticateToken, upload.single('image'), blogController.uploadBlogImage);

module.exports = router; 