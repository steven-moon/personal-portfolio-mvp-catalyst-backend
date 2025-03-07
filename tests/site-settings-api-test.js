// Test script for Site Settings API
const fetch = require('node-fetch');

// Update API URL to match what's used in the blog-api-test
const API_URL = 'http://localhost:3000/api';

// Test user credentials - use the same as in blog-api-test.js
const TEST_USER = {
  username: 'blog_test_user',
  email: 'blogtest@example.com',
  password: 'Test1234!'
};

// Store authentication token after login
let authToken = '';
// Store site settings id for updates
let siteSettingsId = '';

// Generic API request function
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
    headers
  };
  
  if (data && (method === 'POST' || method === 'PUT')) {
    options.body = JSON.stringify(data);
  }
  
  try {
    const response = await fetch(url, options);
    let responseData;
    
    // Try to parse JSON response, but handle non-JSON responses too
    const text = await response.text();
    try {
      responseData = text ? JSON.parse(text) : {};
    } catch (e) {
      responseData = { text };
    }
    
    return responseData.error 
      ? { ...responseData, status: response.status }
      : { ...responseData, status: response.status };
      
  } catch (error) {
    console.error(`Error making ${method} request to ${url}:`, error);
    return { error: error.message };
  }
}

// Sign up - Register the test user if needed
async function signUp() {
  console.log('\n--- Setting Up Test User ---');
  const response = await apiRequest('/auth/signup', 'POST', TEST_USER);
  
  // If user already exists, that's fine for our test purposes
  const success = !response.error || response.error.includes('already exists');
  console.log(`User signup - ${success ? 'SUCCESS' : 'FAIL'}`);
  
  return success;
}

// Login to get auth token
async function signIn() {
  console.log('\n--- Getting Authentication Token ---');
  const credentials = {
    username: TEST_USER.username,
    password: TEST_USER.password
  };
  
  const response = await apiRequest('/auth/signin', 'POST', credentials);
  
  if (response.token) {
    authToken = response.token;
    console.log(`✅ Login successful, auth token obtained`);
    return true;
  } else {
    console.error('❌ Login failed:', response.error || 'Unknown error');
    return false;
  }
}

// Test creating site settings
async function testCreateSiteSettings() {
  console.log('\n--- Testing Create Site Settings ---');
  try {
    const siteSettingsData = {
      siteName: "Steven Moon's Portfolio",
      authorName: 'Steven Moon',
      siteIcon: '/assets/icon.png',
      email: 'moon.steven@gmail.com',
      showEmailInFooter: true,
      theme: 'light',
      primaryColor: '#3498db',
      enableAnimations: true,
      fontFamily: 'Roboto, sans-serif',
      metaDescription: 'Showcasing my AI & Blockchain advisement, innovative projects, and extensive development experience.',
      keywords: 'AI, blockchain, software developer, portfolio, generative AI, iOS, web development',
      enableSocialMetaTags: true,
      googleAnalyticsId: '',
      enableBlog: true,
      enableProjects: true,
      enableContactForm: true,
      enableNewsletter: false,
      enableMvpBanner: true,
      enableGithub: true,
      enableLinkedin: true,
      enableTwitter: true,
      enableInstagram: false,
      enableYoutube: false,
      enableFacebook: false,
      githubUrl: 'https://github.com/stevenmoon',      // Update if needed
      linkedinUrl: 'https://linkedin.com/in/stevenmoon',
      twitterUrl: 'https://twitter.com/stevenmoon'
    };

    const response = await apiRequest('/settings', 'POST', siteSettingsData, authToken);

    if (!response.error && response.id) {
      siteSettingsId = response.id;
      console.log('✅ Site settings created:', response);
      return response;
    }
    
    // If we get a 400 error about settings already existing, we'll just get them instead
    if (response.error && response.error.includes('already exist')) {
      console.log('ℹ️ Site settings already exist, getting current settings instead');
      return await testGetSiteSettings();
    }
    
    console.error('❌ Create site settings failed:', response.error || 'Unknown error');
    return null;
  } catch (error) {
    console.error('❌ Create site settings failed:', error.message);
    return null;
  }
}

// Test getting site settings
async function testGetSiteSettings() {
  console.log('\n--- Testing Get Site Settings ---');
  try {
    const response = await apiRequest('/settings', 'GET', null, authToken);
    
    if (!response.error && response.id) {
      siteSettingsId = response.id;
      console.log('✅ Retrieved site settings:', response);
      return response;
    }
    
    console.error('❌ Get site settings failed:', response.error || 'Unknown error');
    return null;
  } catch (error) {
    console.error('❌ Get site settings failed:', error.message);
    return null;
  }
}

// Test getting public site settings
async function testGetPublicSiteSettings() {
  console.log('\n--- Testing Get Public Site Settings ---');
  try {
    const response = await apiRequest('/settings/public', 'GET');
    
    if (!response.error) {
      console.log('✅ Retrieved public site settings:', response);
      return response;
    }
    
    console.error('❌ Get public site settings failed:', response.error || 'Unknown error');
    return null;
  } catch (error) {
    console.error('❌ Get public site settings failed:', error.message);
    return null;
  }
}

// Test updating site settings
async function testUpdateSiteSettings() {
  console.log('\n--- Testing Update Site Settings ---');
  try {
    const updates = {
      siteName: "Steven Moon's Updated Portfolio",
      primaryColor: '#e74c3c',
      enableNewsletter: true
    };

    const response = await apiRequest(`/settings/${siteSettingsId}`, 'PUT', updates, authToken);
    
    if (!response.error) {
      console.log('✅ Updated site settings:', response);
      return response;
    }
    
    console.error('❌ Update site settings failed:', response.error || 'Unknown error');
    return null;
  } catch (error) {
    console.error('❌ Update site settings failed:', error.message);
    return null;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Site Settings API tests...');
  
  // Sign up user (if needed)
  await signUp();
  
  // Login to get auth token
  const loginSuccess = await signIn();
  if (!loginSuccess) {
    console.error('❌ Tests aborted: Unable to authenticate');
    return;
  }
  
  // Run tests
  let settings = await testCreateSiteSettings();
  
  if (settings) {
    await testGetSiteSettings();
    await testGetPublicSiteSettings();
    await testUpdateSiteSettings();
    // Verify the updates by getting settings again
    await testGetSiteSettings();
    await testGetPublicSiteSettings();
  }
  
  console.log('✅ All Site Settings API tests completed');
}

// Run the tests
runTests().catch(error => {
  console.error('❌ Test error:', error);
});