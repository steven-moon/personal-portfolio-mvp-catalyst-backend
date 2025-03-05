const { BlogPost, Category, User } = require('../models');
const BaseRepository = require('../models/BaseRepository');

const blogPostRepo = new BaseRepository(BlogPost);
const categoryRepo = new BaseRepository(Category);

/******************************
 * Category CRUD Operations
 ******************************/

// Get all categories
async function getAllCategories(req, res, next) {
  try {
    const categories = await categoryRepo.getAll();
    res.json(categories);
  } catch (err) {
    console.error('Error in getAllCategories:', err);
    next(err);
  }
}

// Get category by ID
async function getCategoryById(req, res, next) {
  try {
    const categoryId = req.params.id;
    const category = await categoryRepo.getById(categoryId);
    
    if (!category) {
      return res.status(404).json({ 
        message: 'Category not found' 
      });
    }
    
    res.json(category);
  } catch (err) {
    console.error('Error in getCategoryById:', err);
    next(err);
  }
}

// Create category
async function createCategory(req, res, next) {
  try {
    // Only admins can create categories
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Only administrators can create categories' 
      });
    }
    
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        message: 'Category name is required' 
      });
    }
    
    // Check if category already exists
    const existingCategory = await categoryRepo.getAll({
      where: { name }
    });
    
    if (existingCategory && existingCategory.length > 0) {
      return res.status(400).json({ 
        message: 'A category with this name already exists' 
      });
    }
    
    const newCategory = await categoryRepo.create({ name });
    res.status(201).json(newCategory);
  } catch (err) {
    console.error('Error in createCategory:', err);
    next(err);
  }
}

// Update category
async function updateCategory(req, res, next) {
  try {
    // Only admins can update categories
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Only administrators can update categories' 
      });
    }
    
    const categoryId = req.params.id;
    const { name } = req.body;
    
    if (!name) {
      return res.status(400).json({ 
        message: 'Category name is required' 
      });
    }
    
    // Check if category exists
    const category = await categoryRepo.getById(categoryId);
    
    if (!category) {
      return res.status(404).json({ 
        message: 'Category not found' 
      });
    }
    
    // Check if new name already exists for another category
    if (name !== category.name) {
      const existingCategory = await categoryRepo.getAll({
        where: { name }
      });
      
      if (existingCategory && existingCategory.length > 0) {
        return res.status(400).json({ 
          message: 'A category with this name already exists' 
        });
      }
    }
    
    await categoryRepo.update(categoryId, { name });
    
    const updatedCategory = await categoryRepo.getById(categoryId);
    res.json(updatedCategory);
  } catch (err) {
    console.error('Error in updateCategory:', err);
    next(err);
  }
}

// Delete category
async function deleteCategory(req, res, next) {
  try {
    // Only admins can delete categories
    if (req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'Only administrators can delete categories' 
      });
    }
    
    const categoryId = req.params.id;
    
    // Check if category exists
    const category = await categoryRepo.getById(categoryId);
    
    if (!category) {
      return res.status(404).json({ 
        message: 'Category not found' 
      });
    }
    
    // Delete category (blog posts with this category will have their categoryId set to null)
    await categoryRepo.delete(categoryId);
    
    res.status(204).send();
  } catch (err) {
    console.error('Error in deleteCategory:', err);
    next(err);
  }
}

/******************************
 * BlogPost CRUD Operations
 ******************************/

// Get all blog posts
async function getAllBlogPosts(req, res, next) {
  try {
    const blogPosts = await blogPostRepo.getAll({
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: Category, as: 'category' }
      ],
      order: [['date', 'DESC']]
    });
    
    res.json(blogPosts);
  } catch (err) {
    console.error('Error in getAllBlogPosts:', err);
    next(err);
  }
}

// Get blog post by ID
async function getBlogPostById(req, res, next) {
  try {
    const postId = req.params.id;
    
    const blogPost = await blogPostRepo.getById(postId);
    
    if (!blogPost) {
      return res.status(404).json({ 
        message: 'Blog post not found' 
      });
    }
    
    // Get author and category details
    const fullBlogPost = await blogPostRepo.getAll({
      where: { id: postId },
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: Category, as: 'category' }
      ]
    });
    
    res.json(fullBlogPost[0]);
  } catch (err) {
    console.error('Error in getBlogPostById:', err);
    next(err);
  }
}

// Create blog post
async function createBlogPost(req, res, next) {
  try {
    const userId = req.user.id;
    const { title, excerpt, content, categoryId, imageUrl, date, authorId } = req.body;
    
    // Validate required fields
    if (!title || !excerpt || !content) {
      return res.status(400).json({ 
        message: 'Title, excerpt, and content are required' 
      });
    }
    
    // If categoryId is provided, check if it exists
    if (categoryId) {
      const category = await categoryRepo.getById(categoryId);
      if (!category) {
        return res.status(400).json({ 
          message: 'Selected category does not exist' 
        });
      }
    }
    
    // If authorId is provided, check if user exists
    let finalAuthorId = userId; // Default to current user
    
    if (authorId) {
      // If admin wants to create a post on behalf of another user
      if (req.user.role === 'admin') {
        const author = await User.findByPk(authorId);
        if (!author) {
          return res.status(400).json({ 
            message: 'Selected author does not exist' 
          });
        }
        finalAuthorId = authorId;
      } else {
        // Non-admins can only create posts as themselves
        console.log('Non-admin tried to set authorId, using their own ID instead');
      }
    }
    
    // Create new blog post
    const blogPostData = {
      title,
      excerpt,
      content,
      date: date || new Date(), // Use provided date or current date
      imageUrl,
      authorId: finalAuthorId,
      categoryId: categoryId || null
    };
    
    console.log('Creating blog post with data:', blogPostData);
    
    const newBlogPost = await blogPostRepo.create(blogPostData);
    
    // Get the created post with author and category details
    const createdPost = await blogPostRepo.getAll({
      where: { id: newBlogPost.id },
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: Category, as: 'category' }
      ]
    });
    
    res.status(201).json(createdPost[0]);
  } catch (err) {
    console.error('Error in createBlogPost:', err);
    next(err);
  }
}

// Update blog post
async function updateBlogPost(req, res, next) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    const { title, excerpt, content, categoryId, imageUrl, date, authorId } = req.body;
    
    // Get the blog post
    const blogPost = await blogPostRepo.getById(postId);
    
    if (!blogPost) {
      return res.status(404).json({ 
        message: 'Blog post not found' 
      });
    }
    
    // Check if user is the author or an admin
    if (blogPost.authorId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'You do not have permission to update this blog post' 
      });
    }
    
    // If categoryId is provided, check if it exists
    if (categoryId) {
      const category = await categoryRepo.getById(categoryId);
      if (!category) {
        return res.status(400).json({ 
          message: 'Selected category does not exist' 
        });
      }
    }
    
    // If authorId is provided, check if user exists
    if (authorId) {
      const author = await User.findByPk(authorId);
      if (!author) {
        return res.status(400).json({ 
          message: 'Selected author does not exist' 
        });
      }
    }
    
    // Update the blog post
    const updateData = {};
    if (title) updateData.title = title;
    if (excerpt) updateData.excerpt = excerpt;
    if (content) updateData.content = content;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (date !== undefined) updateData.date = date;
    if (authorId !== undefined) updateData.authorId = authorId;
    
    console.log('Updating blog post with data:', updateData);
    
    await blogPostRepo.update(postId, updateData);
    
    // Get the updated post with author and category details
    const updatedPost = await blogPostRepo.getAll({
      where: { id: postId },
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: Category, as: 'category' }
      ]
    });
    
    res.json(updatedPost[0]);
  } catch (err) {
    console.error('Error in updateBlogPost:', err);
    next(err);
  }
}

// Delete blog post
async function deleteBlogPost(req, res, next) {
  try {
    const userId = req.user.id;
    const postId = req.params.id;
    
    // Get the blog post
    const blogPost = await blogPostRepo.getById(postId);
    
    if (!blogPost) {
      return res.status(404).json({ 
        message: 'Blog post not found' 
      });
    }
    
    // Check if user is the author or an admin
    if (blogPost.authorId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ 
        message: 'You do not have permission to delete this blog post' 
      });
    }
    
    // Delete the blog post
    await blogPostRepo.delete(postId);
    
    res.status(204).send();
  } catch (err) {
    console.error('Error in deleteBlogPost:', err);
    next(err);
  }
}

// Get blog posts by author ID
async function getBlogPostsByAuthor(req, res, next) {
  try {
    const authorId = req.params.id;
    
    // Check if author exists
    const author = await User.findByPk(authorId);
    
    if (!author) {
      return res.status(404).json({ 
        message: 'Author not found' 
      });
    }
    
    // Get all blog posts by this author
    const blogPosts = await blogPostRepo.getAll({
      where: { authorId },
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: Category, as: 'category' }
      ],
      order: [['date', 'DESC']]
    });
    
    res.json(blogPosts);
  } catch (err) {
    console.error('Error in getBlogPostsByAuthor:', err);
    next(err);
  }
}

// Get blog posts by category ID
async function getBlogPostsByCategory(req, res, next) {
  try {
    const categoryId = req.params.id;
    
    // Check if category exists
    const category = await categoryRepo.getById(categoryId);
    
    if (!category) {
      return res.status(404).json({ 
        message: 'Category not found' 
      });
    }
    
    // Get all blog posts in this category
    const blogPosts = await blogPostRepo.getAll({
      where: { categoryId },
      include: [
        { model: User, as: 'author', attributes: ['id', 'username'] },
        { model: Category, as: 'category' }
      ],
      order: [['date', 'DESC']]
    });
    
    res.json(blogPosts);
  } catch (err) {
    console.error('Error in getBlogPostsByCategory:', err);
    next(err);
  }
}

/******************************
 * Image Upload Operations
 ******************************/

// Upload blog image
async function uploadBlogImage(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ 
        message: 'No image file provided' 
      });
    }

    // Get the server URL from request
    const protocol = req.protocol;
    const host = req.get('host');
    
    // Create the full URL to the uploaded file
    const filePath = req.file.path.replace(/\\/g, '/'); // Replace backslashes with forward slashes
    const relativePath = filePath.split('uploads/')[1]; // Get the path after 'uploads/'
    const fileUrl = `${protocol}://${host}/uploads/${relativePath}`;
    
    console.log('Image uploaded successfully:', fileUrl);
    
    // Return the URL to the uploaded file
    res.json({ 
      url: fileUrl,
      message: 'Image uploaded successfully' 
    });
  } catch (err) {
    console.error('Error in uploadBlogImage:', err);
    next(err);
  }
}

// Export all the controller functions
module.exports = {
  // Category controller functions
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  
  // BlogPost controller functions
  getAllBlogPosts,
  getBlogPostById,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogPostsByAuthor,
  getBlogPostsByCategory,
  
  // Image upload
  uploadBlogImage
}; 