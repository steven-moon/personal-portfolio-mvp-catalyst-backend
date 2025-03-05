/**
 * Script to test the Contact Info and Social Media API endpoints
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
  contactInfoId: null
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

// Contact Info tests
async function createContactInfo() {
  console.log('\n--- Testing Create Contact Info ---');
  const contactData = {
    email: 'contact@example.com',
    location: 'San Francisco, CA'
  };
  
  const response = await apiRequest('/contact', 'POST', contactData, state.token);
  
  if (response.id) {
    state.contactInfoId = response.id;
    console.log(`Create contact info - SUCCESS (ID: ${state.contactInfoId})`);
    return true;
  } else {
    console.log('Create contact info - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

async function getContactInfo() {
  console.log('\n--- Testing Get Contact Info ---');
  
  const response = await apiRequest('/contact');
  
  if (response && response.id) {
    console.log('Get contact info - SUCCESS');
    state.contactInfoId = response.id; // Ensure we have the ID for further tests
    return true;
  } else if (response && response.error && response.error.includes('not found')) {
    // This is fine for initial setup - we'll create one
    console.log('Get contact info - NOT FOUND (Will create one)');
    return false;
  } else {
    console.log('Get contact info - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

async function updateContactInfo() {
  console.log('\n--- Testing Update Contact Info ---');
  if (!state.contactInfoId) {
    console.log('Cannot update contact info - No ID available');
    return false;
  }
  
  const contactData = {
    email: `updated-${Date.now()}@example.com`,
    location: 'New York, NY'
  };
  
  const response = await apiRequest(`/contact/${state.contactInfoId}`, 'PUT', contactData, state.token);
  
  // The update response returns [1, [updatedObject]] format
  if (response && Array.isArray(response) && response.length >= 2) {
    console.log('Update contact info - SUCCESS');
    return true;
  } else if (response && response.id) {
    // Handle direct object return format
    console.log('Update contact info - SUCCESS');
    return true;
  } else {
    console.log('Update contact info - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

// Social Media tests
async function createSocialMedia() {
  console.log('\n--- Testing Create Social Media ---');
  if (!state.contactInfoId) {
    console.log('Cannot create social media - No contact info ID available');
    return false;
  }
  
  const socialData = {
    platform: `github-${Date.now()}`,
    name: 'GitHub',
    icon: 'github',
    url: 'https://github.com/username',
    enabled: true
  };
  
  const response = await apiRequest(`/contact/${state.contactInfoId}/social-media`, 'POST', socialData, state.token);
  
  if (response.id) {
    state.socialMediaId = response.id;
    console.log(`Create social media - SUCCESS (ID: ${state.socialMediaId})`);
    return true;
  } else {
    console.log('Create social media - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

async function getSocialMedia() {
  console.log('\n--- Testing Get Social Media ---');
  if (!state.contactInfoId) {
    console.log('Cannot get social media - No contact info ID available');
    return false;
  }
  
  const response = await apiRequest(`/contact/${state.contactInfoId}/social-media`);
  
  if (Array.isArray(response)) {
    console.log(`Get social media - SUCCESS (Found ${response.length} items)`);
    return true;
  } else {
    console.log('Get social media - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

async function updateSocialMedia() {
  console.log('\n--- Testing Update Social Media ---');
  if (!state.socialMediaId) {
    console.log('Cannot update social media - No social media ID available');
    return false;
  }
  
  const socialData = {
    name: `Updated Name ${Date.now()}`,
    url: 'https://updated-url.com',
    enabled: true
  };
  
  const response = await apiRequest(`/contact/social-media/${state.socialMediaId}`, 'PUT', socialData, state.token);
  
  // The update response returns [1, [updatedObject]] format
  if (response && Array.isArray(response) && response.length >= 2) {
    console.log('Update social media - SUCCESS');
    return true;
  } else if (response && response.id) {
    // Handle direct object return format
    console.log('Update social media - SUCCESS');
    return true;
  } else {
    console.log('Update social media - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

async function deleteSocialMedia() {
  console.log('\n--- Testing Delete Social Media ---');
  if (!state.socialMediaId) {
    console.log('Cannot delete social media - No social media ID available');
    return false;
  }
  
  const response = await apiRequest(`/contact/social-media/${state.socialMediaId}`, 'DELETE', null, state.token);
  
  // 204 No Content response will return success: true
  if (response.success || !response.error) {
    console.log('Delete social media - SUCCESS');
    return true;
  } else {
    console.log('Delete social media - FAIL');
    console.error(`Error: ${response.error || 'Unknown error'}`);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('=== CONTACT API TEST SCRIPT ===');
  console.log(`Using API at ${API_URL}`);
  
  // Sign in first to get auth token
  const authenticated = await signIn();
  if (!authenticated) {
    console.log('\n❌ TESTS FAILED: Could not authenticate');
    return;
  }
  
  // Try to get existing contact info
  const contactExists = await getContactInfo();
  
  if (!contactExists) {
    // Create contact info if it doesn't exist
    const contactCreated = await createContactInfo();
    if (!contactCreated) {
      console.log('\n❌ TESTS FAILED: Could not create contact info');
      return;
    }
  }
  
  // Run remaining tests
  const updateContactResult = await updateContactInfo();
  const createSocialResult = await createSocialMedia();
  const getSocialResult = await getSocialMedia();
  const updateSocialResult = await updateSocialMedia();
  const deleteSocialResult = await deleteSocialMedia();
  
  // Report results
  console.log('\n=== TEST RESULTS ===');
  console.log(`Authentication:         ${authenticated ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Get contact info:       ${contactExists ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Update contact info:    ${updateContactResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Create social media:    ${createSocialResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Get social media:       ${getSocialResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Update social media:    ${updateSocialResult ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`Delete social media:    ${deleteSocialResult ? '✅ PASS' : '❌ FAIL'}`);
}

// Run the tests
runTests().catch(error => {
  console.error('Error running tests:', error);
}); 