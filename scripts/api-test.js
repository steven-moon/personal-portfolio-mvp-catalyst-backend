/**
 * API Test Script
 * 
 * This script provides a modular framework for testing API endpoints.
 * Run this script with Node.js after starting the server.
 */

const fetch = require('node-fetch');

// Configuration
const config = {
  BASE_URL: 'http://localhost:3000',
  testUser: {
    username: 'testuser',
    email: 'test@example.com',
    password: 'password123',
    isActive: true,
    role: 'user'
  }
};

// State management
const state = {
  authToken: '',
  userId: '',
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
      console.log(`[DEBUG] Sending ${method} request to ${endpoint} with data:`, data);
      const response = await fetch(`${config.BASE_URL}${endpoint}`, options);
      console.log(`[DEBUG] Response status: ${response.status} ${response.statusText}`);
      
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
 * Test modules organized by resource/entity
 */
const testModules = {
  /**
   * Authentication tests
   */
  auth: {
    async signup() {
      console.log('\n🔑 Testing signup endpoint...');
      const result = await utils.apiRequest('/api/auth/signup', 'POST', config.testUser);
      
      const success = !result.error;
      if (success) {
        state.authToken = result.token;
        state.userId = result.user.id;
      }
      
      utils.reportTest('Signup', success, {
        error: result.error,
        message: success ? `Token received: ${state.authToken.substring(0, 15)}...` : null
      });
      
      return success;
    },
    
    async signin() {
      console.log('\n🔑 Testing signin endpoint...');
      const result = await utils.apiRequest('/api/auth/signin', 'POST', {
        username: config.testUser.email,
        password: config.testUser.password
      });
      
      const success = !result.error;
      if (success) {
        state.authToken = result.token;
      }
      
      utils.reportTest('Signin', success, {
        error: result.error,
        message: success ? `Token refreshed: ${state.authToken.substring(0, 15)}...` : null
      });
      
      return success;
    },
    
    async testProtectedRoute() {
      console.log('\n🔒 Testing protected route without token...');
      const result = await utils.apiRequest('/api/users');
      
      // Check for error with status code 401 or error message about token
      const success = result.error && result.error.includes('No token provided');
      
      utils.reportTest('Protected route security', success, {
        error: success ? null : 'Security issue: Unauthenticated request was not properly rejected!',
        message: success ? 'Correctly rejected unauthenticated request!' : null
      });
      
      return success;
    }
  },
  
  /**
   * User management tests
   */
  users: {
    async getAllUsers() {
      console.log('\n👥 Testing get all users endpoint...');
      const result = await utils.apiRequest('/api/users', 'GET', null, state.authToken);
      
      const success = !result.error;
      
      utils.reportTest('Get all users', success, {
        error: result.error,
        message: success ? `Number of users: ${result.length}` : null
      });
      
      return success;
    },
    
    async getUserById() {
      console.log('\n👤 Testing get user by ID endpoint...');
      const result = await utils.apiRequest(`/api/users/${state.userId}`, 'GET', null, state.authToken);
      
      const success = !result.error;
      
      utils.reportTest('Get user by ID', success, {
        error: result.error,
        message: success ? `Username: ${result.username}\n   Email: ${result.email}` : null
      });
      
      return success;
    },
    
    async updateUser() {
      console.log('\n✏️ Testing update user endpoint...');
      const result = await utils.apiRequest(`/api/users/${state.userId}`, 'PUT', {
        username: `${config.testUser.username}_updated`
      }, state.authToken);
      
      const success = !result.error;
      
      utils.reportTest('Update user', success, {
        error: result.error,
        message: success ? `Updated username to: ${config.testUser.username}_updated` : null
      });
      
      return success;
    },
    
    async deleteUser() {
      console.log('\n🗑️ Testing delete user endpoint...');
      
      // First try to delete the current user
      if (state.userId) {
        console.log(`   Attempting to delete current test user (ID: ${state.userId})...`);
        const result = await utils.apiRequest(`/api/users/${state.userId}`, 'DELETE', null, state.authToken);
        
        const success = !result.error;
        
        utils.reportTest('Delete user', success, {
          error: result.error,
          message: success ? `Successfully deleted test user (ID: ${state.userId})` : null
        });
        
        return success;
      } 
      // If no userId is available, create a temporary user to delete
      else {
        console.log('   Creating temporary user to delete...');
        const tempUser = {
          username: `temp_delete_user_${Date.now()}`,
          email: `temp_delete_${Date.now()}@example.com`,
          password: 'password123',
          isActive: true,
          role: 'user'
        };
        
        try {
          // Signup with temp user
          const signupResult = await utils.apiRequest('/api/auth/signup', 'POST', tempUser);
          if (signupResult.error) {
            utils.reportTest('Delete user', false, {
              error: `Failed to create temporary user: ${signupResult.error}`
            });
            return false;
          }
          
          const tempToken = signupResult.token;
          const tempUserId = signupResult.user.id;
          
          // Try to delete the temp user
          const result = await utils.apiRequest(`/api/users/${tempUserId}`, 'DELETE', null, tempToken);
          
          const success = !result.error;
          
          utils.reportTest('Delete user', success, {
            error: result.error,
            message: success ? `Successfully deleted temporary user (ID: ${tempUserId})` : null
          });
          
          return success;
        } catch (error) {
          utils.reportTest('Delete user', false, {
            error: `Error during delete user test: ${error.message}`
          });
          return false;
        }
      }
    }
  },

  // New test modules can be added here for additional resources
  // For example:
  /*
  projects: {
    async getAllProjects() { ... },
    async getProjectById() { ... },
    async createProject() { ... },
    async updateProject() { ... },
    async deleteProject() { ... }
  },
  */
};

/**
 * Test runner
 */
async function runTests() {
  console.log('🔍 Starting API tests...');
  
  try {
    // For debugging, you can comment out tests that aren't working
    // and focus on specific tests
    
    // Auth tests - must run these first to authenticate
    const signupSuccess = await testModules.auth.signup();
    
    // If signup fails, try signin with existing credentials
    let authenticated = signupSuccess;
    if (!authenticated) {
      authenticated = await testModules.auth.signin();
    }
    
    // Only run protected routes if we have authentication
    if (authenticated) {
      // User tests - these need authentication
      await testModules.users.getAllUsers();
      await testModules.users.getUserById();
      await testModules.users.updateUser();
      await testModules.users.deleteUser();
    } else {
      console.warn('⚠️ Skipping authenticated tests because authentication failed');
    }
    
    // Security tests - test protected route without token
    await testModules.auth.testProtectedRoute();
    
    // Add more test sequences here as you add more tables/endpoints
    
    // Report results
    console.log('\n🎉 API tests completed!');
    console.log(`   Passed: ${state.testResults.passed}`);
    console.log(`   Failed: ${state.testResults.failed}`);
    
  } catch (error) {
    console.error('❌ Tests failed with error:', error);
  }
}

// Run the tests
runTests(); 