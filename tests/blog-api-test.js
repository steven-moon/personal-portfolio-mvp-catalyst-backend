/**
 * Blog API Test Script
 * 
 * This script tests the functionality of the Blog API endpoints.
 * It includes tests for:
 * 1. Authentication (sign up and sign in)
 * 2. Category management (CRUD operations)
 * 3. Blog Post management (CRUD operations)
 * 
 * Usage: node scripts/blog-api-test.js
 */

const fetch = require('node-fetch');

const API_URL = 'http://localhost:3000/api';
const DEBUG = true;

// Test user credentials
const TEST_USER = {
  username: 'blog_test_user',
  email: 'blogtest@example.com',
  password: 'Test1234!'
};

// State management
const state = {
  token: null,
  userId: null,
  categoryId: null,
  blogPostId: null
};

// ========================
// Helper Functions
// ========================

// API request function
async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    if (DEBUG) {
      console.log(`${method} ${url} - Status: ${response.status}`);
    }
    
    // Handle 204 No Content responses
    if (response.status === 204) {
      if (DEBUG) console.log('  Response: 204 No Content');
      return { success: true };
    }
    
    const responseData = await response.json();
    if (DEBUG && responseData) {
      console.log(`  Response: ${JSON.stringify(responseData).slice(0, 150)}${responseData && JSON.stringify(responseData).length > 150 ? '...' : ''}`);
    }
    
    return responseData;
  } catch (error) {
    if (DEBUG) {
      console.error(`  Error: ${error.message}`);
    }
    return { error: error.message };
  }
}

// ========================
// Test Functions
// ========================

// User Signup
async function signUp() {
  console.log('\n--- Testing User Signup ---');
  const response = await apiRequest('/auth/signup', 'POST', TEST_USER);
  
  // If user already exists, that's fine for our test purposes
  const success = !response.error || response.error.includes('already exists');
  console.log(`User signup - ${success ? 'SUCCESS' : 'FAIL'}`);
  
  return success;
}

// User Signin
async function signIn() {
  console.log('\n--- Testing User Signin ---');
  const credentials = {
    username: TEST_USER.username,
    password: TEST_USER.password
  };
  
  const response = await apiRequest('/auth/signin', 'POST', credentials);
  
  if (response.token) {
    state.token = response.token;
    state.userId = response.user?.id;
    console.log(`User signin - SUCCESS (User ID: ${state.userId})`);
    return true;
  } else {
    console.log('User signin - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

// Category tests
async function createCategory() {
  console.log('\n--- Testing Create Category ---');
  const categoryData = {
    name: `Test Category ${Date.now()}`
  };
  
  const response = await apiRequest('/blog/categories', 'POST', categoryData, state.token);
  
  if (response.id) {
    state.categoryId = response.id;
    console.log(`Create category - SUCCESS (ID: ${state.categoryId})`);
    return true;
  } else {
    console.log('Create category - FAIL');
    console.error(`Error: ${response.error || response.message || 'Unknown error'}`);
    return false;
  }
}

async function getAllCategories() {
  console.log('\n--- Testing Get All Categories ---');
  const response = await apiRequest('/blog/categories');
  
  const success = Array.isArray(response);
  console.log(`Get all categories - ${success ? 'SUCCESS' : 'FAIL'}`);
  
  if (success) {
    console.log(`Found ${response.length} categories`);
  }
  
  return success;
}

async function updateCategory() {
  console.log('\n--- Testing Update Category ---');
  if (!state.categoryId) {
    console.log('Update category - SKIP (No category ID)');
    return false;
  }
  
  const updatedData = {
    name: `Updated Test Category ${Date.now()}`
  };
  
  const response = await apiRequest(`/blog/categories/${state.categoryId}`, 'PUT', updatedData, state.token);
  
  const success = response.id === state.categoryId;
  console.log(`Update category - ${success ? 'SUCCESS' : 'FAIL'}`);
  
  return success;
}

// Blog Post tests
async function createBlogPost() {
  console.log('\n--- Testing Create Blog Post ---');
  const blogPostData = {
    title: `Test Blog Post ${Date.now()}`,
    excerpt: 'This is a test blog post excerpt.',
    content: 'This is the content of the test blog post. It contains various paragraphs and formatting.',
    categoryId: state.categoryId
  };
  
  const response = await apiRequest('/blog/posts', 'POST', blogPostData, state.token);
  
  if (response.id) {
    state.blogPostId = response.id;
    console.log(`Create blog post - SUCCESS (ID: ${state.blogPostId})`);
    return true;
  } else {
    console.log('Create blog post - FAIL');
    console.error(`Error: ${response.error || response.message || 'Unknown error'}`);
    return false;
  }
}

async function getBlogPost() {
  console.log('\n--- Testing Get Blog Post ---');
  if (!state.blogPostId) {
    console.log('Get blog post - SKIP (No blog post ID)');
    return false;
  }
  
  const response = await apiRequest(`/blog/posts/${state.blogPostId}`);
  
  const success = response.id === state.blogPostId;
  console.log(`Get blog post - ${success ? 'SUCCESS' : 'FAIL'}`);
  
  return success;
}

async function getAllBlogPosts() {
  console.log('\n--- Testing Get All Blog Posts ---');
  const response = await apiRequest('/blog/posts');
  
  const success = Array.isArray(response);
  console.log(`Get all blog posts - ${success ? 'SUCCESS' : 'FAIL'}`);
  
  if (success) {
    console.log(`Found ${response.length} blog posts`);
  }
  
  return success;
}

async function getBlogPostsByCategory() {
  console.log('\n--- Testing Get Blog Posts By Category ---');
  if (!state.categoryId) {
    console.log('Get blog posts by category - SKIP (No category ID)');
    return false;
  }
  
  const response = await apiRequest(`/blog/categories/${state.categoryId}/posts`);
  
  const success = Array.isArray(response);
  console.log(`Get blog posts by category - ${success ? 'SUCCESS' : 'FAIL'}`);
  
  if (success) {
    console.log(`Found ${response.length} blog posts in category`);
  }
  
  return success;
}

async function getBlogPostsByAuthor() {
  console.log('\n--- Testing Get Blog Posts By Author ---');
  if (!state.userId) {
    console.log('Get blog posts by author - SKIP (No user ID)');
    return false;
  }
  
  const response = await apiRequest(`/blog/authors/${state.userId}/posts`);
  
  const success = Array.isArray(response);
  console.log(`Get blog posts by author - ${success ? 'SUCCESS' : 'FAIL'}`);
  
  if (success) {
    console.log(`Found ${response.length} blog posts by author`);
  }
  
  return success;
}

async function updateBlogPost() {
  console.log('\n--- Testing Update Blog Post ---');
  if (!state.blogPostId) {
    console.log('Update blog post - SKIP (No blog post ID)');
    return false;
  }
  
  const updatedData = {
    title: `Updated Test Blog Post ${Date.now()}`,
    excerpt: 'This is an updated test blog post excerpt.',
    content: 'This is the updated content of the test blog post.'
  };
  
  const response = await apiRequest(`/blog/posts/${state.blogPostId}`, 'PUT', updatedData, state.token);
  
  const success = response.id === state.blogPostId;
  console.log(`Update blog post - ${success ? 'SUCCESS' : 'FAIL'}`);
  
  return success;
}

async function deleteBlogPost() {
  console.log('\n--- Testing Delete Blog Post ---');
  if (!state.blogPostId) {
    console.log('Delete blog post - SKIP (No blog post ID)');
    return false;
  }
  
  const response = await apiRequest(`/blog/posts/${state.blogPostId}`, 'DELETE', null, state.token);
  
  const success = !response.error || response.success === true;
  console.log(`Delete blog post - ${success ? 'SUCCESS' : 'FAIL'}`);
  
  return success;
}

async function deleteCategory() {
  console.log('\n--- Testing Delete Category ---');
  if (!state.categoryId) {
    console.log('Delete category - SKIP (No category ID)');
    return false;
  }
  
  const response = await apiRequest(`/blog/categories/${state.categoryId}`, 'DELETE', null, state.token);
  
  const success = !response.error || response.success === true;
  console.log(`Delete category - ${success ? 'SUCCESS' : 'FAIL'}`);
  
  return success;
}

// ========================
// Main Test Execution
// ========================
async function runTests() {
  console.log('==============================');
  console.log('STARTING BLOG API TESTS');
  console.log('==============================');
  
  try {
    // Authentication tests
    await signUp();
    const authenticated = await signIn();
    if (!authenticated) {
      console.error('Authentication failed. Aborting tests.');
      return;
    }
    
    // Category tests
    await getAllCategories();
    await createCategory();
    await updateCategory();
    
    // Blog Post tests
    await createBlogPost();
    await getBlogPost();
    await getAllBlogPosts();
    await getBlogPostsByCategory();
    await getBlogPostsByAuthor();
    await updateBlogPost();
    await deleteBlogPost();
    
    // Cleanup
    await deleteCategory();
    
    console.log('\n==============================');
    console.log('ALL TESTS COMPLETED');
    console.log('==============================');
  } catch (error) {
    console.error('Test execution error:', error);
  }
}

// Run the tests
runTests(); 