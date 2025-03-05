/**
 * Script to test the Projects API endpoints
 */

const fetch = require('node-fetch');
const dotenv = require('dotenv');
dotenv.config();

// Configuration
const API_URL = process.env.API_URL || 'http://localhost:3000/api';
const DEBUG = true;

let state = {
  token: null,
  userId: null,
  projectId: null,
  tagId: null,
  imageId: null
};

// Test user credentials (should match the ones in blog-api-test.js)
const TEST_USER = {
  username: 'blog_test_user',
  email: 'blogtest@example.com',
  password: 'Test1234!'
};

// API Request Helper Function
async function apiRequest(endpoint, method = 'GET', data = null, token = null) {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json'
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

// Project tests
async function createProject() {
  console.log('\n--- Testing Create Project ---');
  const projectData = {
    title: `Test Project ${Date.now()}`,
    description: 'A test project description',
    image: 'https://example.com/image.jpg',
    link: 'https://example.com/project',
    fullDescription: 'This is a full description of the test project with more details.',
    tags: ['JavaScript', 'React', 'API'],
    additionalImages: [
      'https://example.com/image2.jpg',
      'https://example.com/image3.jpg'
    ]
  };
  
  const response = await apiRequest('/projects', 'POST', projectData, state.token);
  
  if (response.id) {
    state.projectId = response.id;
    console.log(`Create project - SUCCESS (ID: ${state.projectId})`);
    
    // Save the first additional image ID for later tests
    if (response.images && response.images.length > 0) {
      state.imageId = response.images[0].id;
      console.log(`Saved image ID: ${state.imageId}`);
    }
    
    return true;
  } else {
    console.log('Create project - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

async function getAllProjects() {
  console.log('\n--- Testing Get All Projects ---');
  
  const response = await apiRequest('/projects');
  
  if (Array.isArray(response)) {
    console.log(`Get all projects - SUCCESS (Found ${response.length} projects)`);
    return true;
  } else {
    console.log('Get all projects - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

async function getProjectById() {
  console.log('\n--- Testing Get Project By ID ---');
  if (!state.projectId) {
    console.log('Cannot get project - No project ID available');
    return false;
  }
  
  const response = await apiRequest(`/projects/${state.projectId}`);
  
  if (response && response.id) {
    console.log('Get project by ID - SUCCESS');
    return true;
  } else {
    console.log('Get project by ID - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

async function updateProject() {
  console.log('\n--- Testing Update Project ---');
  if (!state.projectId) {
    console.log('Cannot update project - No project ID available');
    return false;
  }
  
  const projectData = {
    title: `Updated Project ${Date.now()}`,
    description: 'Updated project description',
    tags: ['JavaScript', 'React', 'API', 'Updated']
  };
  
  const response = await apiRequest(`/projects/${state.projectId}`, 'PUT', projectData, state.token);
  
  if (response && response.id) {
    console.log('Update project - SUCCESS');
    return true;
  } else {
    console.log('Update project - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

// Tag tests
async function getAllTags() {
  console.log('\n--- Testing Get All Tags ---');
  
  const response = await apiRequest('/projects/tags/all');
  
  if (Array.isArray(response)) {
    console.log(`Get all tags - SUCCESS (Found ${response.length} tags)`);
    return true;
  } else {
    console.log('Get all tags - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

async function getProjectsByTag() {
  console.log('\n--- Testing Get Projects By Tag ---');
  
  // Use 'JavaScript' tag for the test
  const tagName = 'JavaScript';
  const response = await apiRequest(`/projects/tags/${tagName}`);
  
  if (Array.isArray(response)) {
    console.log(`Get projects by tag - SUCCESS (Found ${response.length} projects with tag '${tagName}')`);
    return true;
  } else {
    console.log('Get projects by tag - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

// Project Image tests
async function addProjectImage() {
  console.log('\n--- Testing Add Project Image ---');
  if (!state.projectId) {
    console.log('Cannot add image - No project ID available');
    return false;
  }
  
  const imageData = {
    imageUrl: `https://example.com/image-${Date.now()}.jpg`
  };
  
  const response = await apiRequest(`/projects/${state.projectId}/images`, 'POST', imageData, state.token);
  
  if (response.id) {
    state.imageId = response.id;
    console.log(`Add project image - SUCCESS (ID: ${state.imageId})`);
    return true;
  } else {
    console.log('Add project image - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

async function deleteProjectImage() {
  console.log('\n--- Testing Delete Project Image ---');
  if (!state.imageId) {
    console.log('Cannot delete image - No image ID available');
    return false;
  }
  
  const response = await apiRequest(`/projects/images/${state.imageId}`, 'DELETE', null, state.token);
  
  // 204 No Content response will return success: true
  if (response.success || !response.error) {
    console.log('Delete project image - SUCCESS');
    return true;
  } else {
    console.log('Delete project image - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

async function deleteProject() {
  console.log('\n--- Testing Delete Project ---');
  if (!state.projectId) {
    console.log('Cannot delete project - No project ID available');
    return false;
  }
  
  const response = await apiRequest(`/projects/${state.projectId}`, 'DELETE', null, state.token);
  
  // 204 No Content response will return success: true
  if (response.success || !response.error) {
    console.log('Delete project - SUCCESS');
    return true;
  } else {
    console.log('Delete project - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('=== PROJECTS API TEST SCRIPT ===');
  console.log(`Using API at ${API_URL}`);
  
  // Sign in first to get auth token
  const authenticated = await signIn();
  if (!authenticated) {
    console.log('\n❌ TESTS FAILED: Could not authenticate');
    return;
  }
  
  // Run tests
  const createProjectResult = await createProject();
  if (!createProjectResult) {
    console.log('\n❌ TESTS FAILED: Could not create project');
    return;
  }
  
  const getAllProjectsResult = await getAllProjects();
  const getProjectByIdResult = await getProjectById();
  const updateProjectResult = await updateProject();
  const getAllTagsResult = await getAllTags();
  const getProjectsByTagResult = await getProjectsByTag();
  const addProjectImageResult = await addProjectImage();
  const deleteProjectImageResult = await deleteProjectImage();
  const deleteProjectResult = await deleteProject();
  
  // Report results
  console.log('\n=== TEST RESULTS ===');
  console.log(`Authentication:           ${authenticated ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Create project:           ${createProjectResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Get all projects:         ${getAllProjectsResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Get project by ID:        ${getProjectByIdResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Update project:           ${updateProjectResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Get all tags:             ${getAllTagsResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Get projects by tag:      ${getProjectsByTagResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Add project image:        ${addProjectImageResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Delete project image:     ${deleteProjectImageResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Delete project:           ${deleteProjectResult ? '✅ PASS' : '❌ FAIL'}`);
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
}); 