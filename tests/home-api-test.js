/**
 * Script to test the Home Page and Services API endpoints
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
  homePageId: null,
  serviceId: null
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

// HomePage tests
async function createHomePage() {
  console.log('\n--- Testing Create Home Page ---');
  const homePageData = {
    title: 'John Doe',
    subtitle: 'Personal Portfolio',
    profession: 'Full Stack Developer',
    profileImage: 'https://example.com/profile.jpg'
  };
  
  const response = await apiRequest('/home', 'POST', homePageData, state.token);
  
  if (response.id) {
    state.homePageId = response.id;
    console.log(`Create home page - SUCCESS (ID: ${state.homePageId})`);
    return true;
  } else {
    console.log('Create home page - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

async function getHomePage() {
  console.log('\n--- Testing Get Home Page ---');
  
  const response = await apiRequest('/home');
  
  if (response && response.id) {
    console.log('Get home page - SUCCESS');
    state.homePageId = response.id; // Ensure we have the ID for further tests
    return true;
  } else if (response && response.error && response.error.includes('not found')) {
    // This is fine for initial setup - we'll create one
    console.log('Get home page - NOT FOUND (Will create one)');
    return false;
  } else {
    console.log('Get home page - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

async function updateHomePage() {
  console.log('\n--- Testing Update Home Page ---');
  if (!state.homePageId) {
    console.log('Cannot update home page - No ID available');
    return false;
  }
  
  const homePageData = {
    title: `John Doe ${Date.now()}`,
    profession: 'Senior Full Stack Developer'
  };
  
  const response = await apiRequest(`/home/${state.homePageId}`, 'PUT', homePageData, state.token);
  
  // The update response returns [1, [updatedObject]] format
  if (response && Array.isArray(response) && response.length >= 2) {
    console.log('Update home page - SUCCESS');
    return true;
  } else if (response && response.id) {
    // Handle direct object return format
    console.log('Update home page - SUCCESS');
    return true;
  } else {
    console.log('Update home page - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

// Service tests
async function createService() {
  console.log('\n--- Testing Create Service ---');
  if (!state.homePageId) {
    console.log('Cannot create service - No home page ID available');
    return false;
  }
  
  const serviceData = {
    title: `Web Development ${Date.now()}`,
    description: 'Custom website development services'
  };
  
  const response = await apiRequest(`/home/${state.homePageId}/services`, 'POST', serviceData, state.token);
  
  if (response.id) {
    state.serviceId = response.id;
    console.log(`Create service - SUCCESS (ID: ${state.serviceId})`);
    return true;
  } else {
    console.log('Create service - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

async function getAllServices() {
  console.log('\n--- Testing Get All Services ---');
  if (!state.homePageId) {
    console.log('Cannot get services - No home page ID available');
    return false;
  }
  
  const response = await apiRequest(`/home/${state.homePageId}/services`);
  
  if (Array.isArray(response)) {
    console.log(`Get all services - SUCCESS (Found ${response.length} items)`);
    return true;
  } else {
    console.log('Get all services - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

async function getServiceById() {
  console.log('\n--- Testing Get Service By ID ---');
  if (!state.serviceId) {
    console.log('Cannot get service - No service ID available');
    return false;
  }
  
  const response = await apiRequest(`/home/service/${state.serviceId}`);
  
  if (response && response.id) {
    console.log('Get service by ID - SUCCESS');
    return true;
  } else {
    console.log('Get service by ID - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

async function updateService() {
  console.log('\n--- Testing Update Service ---');
  if (!state.serviceId) {
    console.log('Cannot update service - No service ID available');
    return false;
  }
  
  const serviceData = {
    title: `Updated Service ${Date.now()}`,
    description: 'Updated service description'
  };
  
  const response = await apiRequest(`/home/service/${state.serviceId}`, 'PUT', serviceData, state.token);
  
  // The update response returns [1, [updatedObject]] format
  if (response && Array.isArray(response) && response.length >= 2) {
    console.log('Update service - SUCCESS');
    return true;
  } else if (response && response.id) {
    // Handle direct object return format
    console.log('Update service - SUCCESS');
    return true;
  } else {
    console.log('Update service - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

async function deleteService() {
  console.log('\n--- Testing Delete Service ---');
  if (!state.serviceId) {
    console.log('Cannot delete service - No service ID available');
    return false;
  }
  
  const response = await apiRequest(`/home/service/${state.serviceId}`, 'DELETE', null, state.token);
  
  // 204 No Content response will return success: true
  if (response.success || !response.error) {
    console.log('Delete service - SUCCESS');
    return true;
  } else {
    console.log('Delete service - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('=== HOME PAGE API TEST SCRIPT ===');
  console.log(`Using API at ${API_URL}`);
  
  // Sign in first to get auth token
  const authenticated = await signIn();
  if (!authenticated) {
    console.log('\n❌ TESTS FAILED: Could not authenticate');
    return;
  }
  
  // Try to get existing home page
  const homePageExists = await getHomePage();
  
  if (!homePageExists) {
    // Create home page if it doesn't exist
    const homePageCreated = await createHomePage();
    if (!homePageCreated) {
      console.log('\n❌ TESTS FAILED: Could not create home page');
      return;
    }
  }
  
  // Run remaining tests
  const updateHomePageResult = await updateHomePage();
  const createServiceResult = await createService();
  const getAllServicesResult = await getAllServices();
  const getServiceByIdResult = await getServiceById();
  const updateServiceResult = await updateService();
  const deleteServiceResult = await deleteService();
  
  // Report results
  console.log('\n=== TEST RESULTS ===');
  console.log(`Authentication:         ${authenticated ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Get home page:          ${homePageExists ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Update home page:       ${updateHomePageResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Create service:         ${createServiceResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Get all services:       ${getAllServicesResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Get service by ID:      ${getServiceByIdResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Update service:         ${updateServiceResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Delete service:         ${deleteServiceResult ? '✅ PASS' : '❌ FAIL'}`);
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
}); 