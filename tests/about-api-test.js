/**
 * About API Test Script
 * 
 * This script tests the About API endpoints for the personal portfolio.
 * Run this script with Node.js after starting the server.
 * 
 * Usage: node scripts/about-api-test.js
 */

const fetch = require('node-fetch');

// Configuration
const config = {
  BASE_URL: 'http://localhost:3000',
  testUser: {
    username: 'testuser_about',
    email: 'testuser_about@example.com',
    password: 'password123',
    isActive: true,
    role: 'user'
  },
  testAbout: {
    headline: 'Software Developer',
    subheadline: 'Building innovative solutions',
    story: 'This is my professional journey and story.'
  },
  testWorkExperience: {
    title: 'Senior Developer',
    company: 'Tech Innovators Inc.',
    period: '2020-2023',
    description: 'Led development of key projects and mentored junior developers.'
  },
  testEducation: {
    degree: 'Master of Computer Science',
    institution: 'Tech University',
    period: '2015-2019',
    description: 'Focused on AI and Machine Learning'
  },
  testSkill: {
    category: 'technical',
    name: 'JavaScript'
  },
  testValue: {
    title: 'Continuous Learning',
    description: 'Always seeking to expand knowledge and skills.'
  }
};

// State management
const state = {
  authToken: '',
  userId: '',
  aboutId: '',
  workExperienceId: '',
  educationId: '',
  skillId: '',
  valueId: '',
  testResults: {
    passed: 0,
    failed: 0
  }
};

/**
 * Utility functions
 */
const utils = {
  /**
   * Sends a request to the API
   */
  async apiRequest(endpoint, method = 'GET', data = null, token = null) {
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
      options.body = JSON.stringify(data);
    }

    try {
      console.log(`[DEBUG] Sending ${method} request to ${endpoint}`);
      if (data) {
        console.log(`[DEBUG] Request data:`, data);
      }
      
      const response = await fetch(`${config.BASE_URL}${endpoint}`, options);
      console.log(`[DEBUG] Response status: ${response.status} ${response.statusText}`);
      
      // Handle 204 No Content responses
      if (response.status === 204) {
        console.log(`[DEBUG] Empty response (204 No Content)`);
        return { success: true };
      }
      
      let responseData;
      
      try {
        responseData = await response.json();
        console.log(`[DEBUG] Response data:`, responseData);
      } catch (err) {
        console.error(`Error parsing JSON from ${endpoint}:`, err);
        return { error: `Failed to parse response: ${err.message}` };
      }
      
      // Enhance response with HTTP status code if there's an error
      if (!response.ok) {
        if (!responseData.error) {
          responseData.error = `HTTP ${response.status}: ${response.statusText}`;
        }
      }
      
      return responseData;
    } catch (error) {
      console.error(`Network error calling ${endpoint}:`, error);
      return { error: `Network error: ${error.message}` };
    }
  },

  /**
   * Report test result
   */
  reportTest(name, success, details = {}) {
    if (success) {
      console.log(`✅ ${name} successful!`);
      state.testResults.passed++;
    } else {
      console.error(`❌ ${name} failed:`, details.error || '');
      state.testResults.failed++;
    }
    
    if (details.message) {
      console.log(`   ${details.message}`);
    }
  }
};

/**
 * Test cases
 */
const tests = {
  /**
   * Authentication tests
   */
  async signup() {
    console.log('\n🔑 Testing user signup...');
    
    const response = await utils.apiRequest('/api/auth/signup', 'POST', config.testUser);
    
    // Check if signup succeeded or user already exists
    const success = !response.error || response.error.includes('already exists');
    
    utils.reportTest('User Signup', success, {
      message: response.error ? `Note: ${response.error}` : 'User created successfully or already exists'
    });
    
    return success;
  },
  
  async signin() {
    console.log('\n🔑 Testing user signin...');
    
    const credentials = {
      username: config.testUser.email,
      password: config.testUser.password
    };
    
    console.log('Signing in with credentials:', credentials);
    
    const response = await utils.apiRequest('/api/auth/signin', 'POST', credentials);
    
    const success = !response.error && response.token;
    
    if (success) {
      state.authToken = response.token;
      state.userId = response.id;
    }
    
    utils.reportTest('User Signin', success, {
      message: success ? `User authenticated successfully with ID: ${state.userId}` : `Authentication failed: ${response.error || 'Unknown error'}`
    });
    
    return success;
  },
  
  /**
   * About profile tests
   */
  async getAboutInitial() {
    console.log('\n📋 Testing initial GET About profile (expecting 404)...');
    
    const response = await utils.apiRequest('/api/about', 'GET', null, state.authToken);
    
    // Initial GET is expected to 404 if no profile exists yet
    const success = response.error && response.error.includes('404');
    
    utils.reportTest('Initial GET About', success, {
      message: success ? 'Successfully verified no profile exists yet (404 expected)' : 'Unexpected response'
    });
    
    return success;
  },
  
  async createAbout() {
    console.log('\n📝 Testing CREATE About profile...');
    
    const response = await utils.apiRequest('/api/about', 'POST', config.testAbout, state.authToken);
    
    const success = !response.error && response.id;
    
    if (success) {
      state.aboutId = response.id;
    }
    
    utils.reportTest('Create About Profile', success, {
      message: success ? `About profile created with ID: ${state.aboutId}` : null
    });
    
    return success;
  },
  
  async getAbout() {
    console.log('\n📋 Testing GET About profile...');
    
    const response = await utils.apiRequest('/api/about', 'GET', null, state.authToken);
    
    const success = !response.error && response.id;
    
    utils.reportTest('Get About Profile', success, {
      message: success ? `Retrieved about profile with headline: "${response.headline}"` : null
    });
    
    return success;
  },
  
  async updateAbout() {
    console.log('\n✏️ Testing UPDATE About profile...');
    
    const updateData = {
      headline: 'Updated Headline',
      subheadline: 'Updated Subheadline'
    };
    
    const response = await utils.apiRequest('/api/about', 'PUT', updateData, state.authToken);
    
    const success = !response.error;
    
    utils.reportTest('Update About Profile', success, {
      message: success ? 'About profile updated successfully' : null
    });
    
    return success;
  },
  
  /**
   * Work Experience tests
   */
  async getWorkExperiences() {
    console.log('\n📋 Testing GET Work Experiences...');
    
    const response = await utils.apiRequest('/api/about/work-experiences', 'GET', null, state.authToken);
    
    const success = !response.error && Array.isArray(response);
    
    utils.reportTest('Get Work Experiences', success, {
      message: success ? `Retrieved ${response.length} work experiences` : null
    });
    
    return success;
  },
  
  async createWorkExperience() {
    console.log('\n📝 Testing CREATE Work Experience...');
    
    const response = await utils.apiRequest('/api/about/work-experiences', 'POST', config.testWorkExperience, state.authToken);
    
    const success = !response.error && response.id;
    
    if (success) {
      state.workExperienceId = response.id;
    }
    
    utils.reportTest('Create Work Experience', success, {
      message: success ? `Work experience created with ID: ${state.workExperienceId}` : null
    });
    
    return success;
  },
  
  async updateWorkExperience() {
    console.log('\n✏️ Testing UPDATE Work Experience...');
    
    if (!state.workExperienceId) {
      utils.reportTest('Update Work Experience', false, {
        message: 'No work experience ID available to update'
      });
      return false;
    }
    
    const updateData = {
      title: 'Updated Job Title',
      description: 'Updated job description with more details'
    };
    
    const response = await utils.apiRequest(`/api/about/work-experiences/${state.workExperienceId}`, 'PUT', updateData, state.authToken);
    
    const success = !response.error;
    
    utils.reportTest('Update Work Experience', success, {
      message: success ? 'Work experience updated successfully' : null
    });
    
    return success;
  },
  
  async deleteWorkExperience() {
    console.log('\n🗑️ Testing DELETE Work Experience...');
    
    if (!state.workExperienceId) {
      utils.reportTest('Delete Work Experience', false, {
        message: 'No work experience ID available to delete'
      });
      return false;
    }
    
    const response = await utils.apiRequest(`/api/about/work-experiences/${state.workExperienceId}`, 'DELETE', null, state.authToken);
    
    const success = !response.error || response.success === true;
    
    utils.reportTest('Delete Work Experience', success, {
      message: success ? 'Work experience deleted successfully' : null
    });
    
    return success;
  },
  
  /**
   * Education tests
   */
  async getEducations() {
    console.log('\n📋 Testing GET Educations...');
    
    const response = await utils.apiRequest('/api/about/educations', 'GET', null, state.authToken);
    
    const success = !response.error && Array.isArray(response);
    
    utils.reportTest('Get Educations', success, {
      message: success ? `Retrieved ${response.length} educations` : null
    });
    
    return success;
  },
  
  async createEducation() {
    console.log('\n📝 Testing CREATE Education...');
    
    const response = await utils.apiRequest('/api/about/educations', 'POST', config.testEducation, state.authToken);
    
    const success = !response.error && response.id;
    
    if (success) {
      state.educationId = response.id;
    }
    
    utils.reportTest('Create Education', success, {
      message: success ? `Education created with ID: ${state.educationId}` : null
    });
    
    return success;
  },
  
  async updateEducation() {
    console.log('\n✏️ Testing UPDATE Education...');
    
    if (!state.educationId) {
      utils.reportTest('Update Education', false, {
        message: 'No education ID available to update'
      });
      return false;
    }
    
    const updateData = {
      degree: 'Updated Degree',
      description: 'Updated education description with more details'
    };
    
    const response = await utils.apiRequest(`/api/about/educations/${state.educationId}`, 'PUT', updateData, state.authToken);
    
    const success = !response.error;
    
    utils.reportTest('Update Education', success, {
      message: success ? 'Education updated successfully' : null
    });
    
    return success;
  },
  
  async deleteEducation() {
    console.log('\n🗑️ Testing DELETE Education...');
    
    if (!state.educationId) {
      utils.reportTest('Delete Education', false, {
        message: 'No education ID available to delete'
      });
      return false;
    }
    
    const response = await utils.apiRequest(`/api/about/educations/${state.educationId}`, 'DELETE', null, state.authToken);
    
    const success = !response.error || response.success === true;
    
    utils.reportTest('Delete Education', success, {
      message: success ? 'Education deleted successfully' : null
    });
    
    return success;
  },
  
  /**
   * Cleanup
   */
  async deleteAbout() {
    console.log('\n🗑️ Testing DELETE About profile...');
    
    const response = await utils.apiRequest('/api/about', 'DELETE', null, state.authToken);
    
    const success = !response.error || response.success === true;
    
    utils.reportTest('Delete About Profile', success, {
      message: success ? 'About profile deleted successfully' : null
    });
    
    return success;
  }
};

/**
 * Run the tests
 */
async function runTests() {
  console.log('\n=== About API Test Suite ===\n');
  
  try {
    // Authentication
    await tests.signup();
    const isAuthenticated = await tests.signin();
    
    if (!isAuthenticated) {
      throw new Error('Authentication failed. Cannot proceed with tests.');
    }
    
    // About profile tests
    await tests.getAboutInitial();
    await tests.createAbout();
    await tests.getAbout();
    await tests.updateAbout();
    
    // Work Experience tests
    await tests.getWorkExperiences();
    await tests.createWorkExperience();
    await tests.updateWorkExperience();
    await tests.deleteWorkExperience();
    
    // Education tests
    await tests.getEducations();
    await tests.createEducation();
    await tests.updateEducation();
    await tests.deleteEducation();
    
    // Cleanup
    await tests.deleteAbout();
    
    // Print test results
    console.log('\n=== Test Results ===');
    console.log(`✅ Passed: ${state.testResults.passed}`);
    console.log(`❌ Failed: ${state.testResults.failed}`);
    console.log(`Total: ${state.testResults.passed + state.testResults.failed}`);
    console.log('======================\n');
    
    // Exit with appropriate code
    if (state.testResults.failed > 0) {
      process.exit(1);
    } else {
      process.exit(0);
    }
  } catch (error) {
    console.error('Test suite error:', error);
    process.exit(1);
  }
}

// Run the tests
runTests(); 