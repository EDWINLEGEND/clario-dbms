/**
 * Project Management API Test Script
 * Tests all CRUD operations for the Projects API with authentication
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:4000';
const API_URL = `${BASE_URL}/projects`;

// Test configuration
const testConfig = {
  // You'll need to replace this with a valid access token from Google OAuth
  // For testing, you can get one by logging in through the frontend or using the auth endpoint
  accessToken: 'YOUR_ACCESS_TOKEN_HERE',
  testProject: {
    title: 'Test Project - API Implementation',
    description: 'This is a test project created by the API test script',
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
  },
  testMilestone: {
    title: 'Test Milestone',
    description: 'This is a test milestone',
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days from now
  },
  testFee: {
    amount: 50
  }
};

// Helper function to make authenticated requests
const makeRequest = async (method, url, data = null) => {
  try {
    const config = {
      method,
      url,
      headers: {
        'Authorization': `Bearer ${testConfig.accessToken}`,
        'Content-Type': 'application/json'
      }
    };
    
    if (data) {
      config.data = data;
    }
    
    const response = await axios(config);
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status 
    };
  }
};

// Test functions
const testCreateProject = async () => {
  console.log('\n🧪 Testing POST /projects - Create Project');
  const result = await makeRequest('POST', API_URL, testConfig.testProject);
  
  if (result.success && result.status === 201) {
    console.log('✅ Project created successfully');
    console.log(`   Project ID: ${result.data.id}`);
    console.log(`   Title: ${result.data.title}`);
    return result.data;
  } else {
    console.log('❌ Failed to create project');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error)}`);
    return null;
  }
};

const testGetAllProjects = async () => {
  console.log('\n🧪 Testing GET /projects - Get All Projects');
  const result = await makeRequest('GET', API_URL);
  
  if (result.success && result.status === 200) {
    console.log('✅ Projects retrieved successfully');
    console.log(`   Found ${result.data.length} projects`);
    return result.data;
  } else {
    console.log('❌ Failed to get projects');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error)}`);
    return [];
  }
};

const testGetSingleProject = async (projectId) => {
  console.log(`\n🧪 Testing GET /projects/${projectId} - Get Single Project`);
  const result = await makeRequest('GET', `${API_URL}/${projectId}`);
  
  if (result.success && result.status === 200) {
    console.log('✅ Project retrieved successfully');
    console.log(`   Project ID: ${result.data.id}`);
    console.log(`   Title: ${result.data.title}`);
    console.log(`   Milestones: ${result.data.milestones?.length || 0}`);
    return result.data;
  } else {
    console.log('❌ Failed to get project');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error)}`);
    return null;
  }
};

const testUpdateProject = async (projectId) => {
  console.log(`\n🧪 Testing PATCH /projects/${projectId} - Update Project`);
  const updateData = {
    title: 'Updated Test Project - API Implementation',
    description: 'This project has been updated via the API test script'
  };
  
  const result = await makeRequest('PATCH', `${API_URL}/${projectId}`, updateData);
  
  if (result.success && result.status === 200) {
    console.log('✅ Project updated successfully');
    console.log(`   New Title: ${result.data.title}`);
    console.log(`   New Description: ${result.data.description}`);
    return result.data;
  } else {
    console.log('❌ Failed to update project');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error)}`);
    return null;
  }
};

const testCreateMilestone = async (projectId) => {
  console.log(`\n🧪 Testing POST /projects/${projectId}/milestones - Create Milestone`);
  const result = await makeRequest('POST', `${API_URL}/${projectId}/milestones`, testConfig.testMilestone);
  
  if (result.success && result.status === 201) {
    console.log('✅ Milestone created successfully');
    console.log(`   Milestone ID: ${result.data.id}`);
    console.log(`   Title: ${result.data.title}`);
    return result.data;
  } else {
    console.log('❌ Failed to create milestone');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error)}`);
    return null;
  }
};

const testCreateAccountabilityFee = async (projectId) => {
  console.log(`\n🧪 Testing POST /projects/${projectId}/fee - Create Accountability Fee`);
  const result = await makeRequest('POST', `${API_URL}/${projectId}/fee`, testConfig.testFee);
  
  if (result.success && result.status === 201) {
    console.log('✅ Accountability fee created successfully');
    console.log(`   Fee ID: ${result.data.id}`);
    console.log(`   Amount: $${result.data.amount}`);
    console.log(`   Status: ${result.data.status}`);
    return result.data;
  } else {
    console.log('❌ Failed to create accountability fee');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error)}`);
    return null;
  }
};

const testDeleteProject = async (projectId) => {
  console.log(`\n🧪 Testing DELETE /projects/${projectId} - Delete Project`);
  const result = await makeRequest('DELETE', `${API_URL}/${projectId}`);
  
  if (result.success && result.status === 204) {
    console.log('✅ Project deleted successfully');
    return true;
  } else {
    console.log('❌ Failed to delete project');
    console.log(`   Status: ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error)}`);
    return false;
  }
};

const testUnauthorizedAccess = async () => {
  console.log('\n🧪 Testing Unauthorized Access');
  try {
    const response = await axios.get(API_URL);
    console.log('❌ Unauthorized access should have failed');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ Unauthorized access properly blocked (401 Unauthorized)');
      return true;
    } else {
      console.log(`❌ Unexpected error: ${error.response?.status}`);
      console.log(`   Error details: ${JSON.stringify(error.response?.data)}`);
      return false;
    }
  }
};

// Main test runner
const runTests = async () => {
  console.log('🚀 Starting Project Management API Tests');
  console.log('==========================================');
  
  // Check if access token is configured
  if (testConfig.accessToken === 'YOUR_ACCESS_TOKEN_HERE') {
    console.log('\n⚠️  WARNING: Please configure a valid access token in testConfig.accessToken');
    console.log('   You can get one by:');
    console.log('   1. Logging in through the frontend');
    console.log('   2. Using the POST /auth/google endpoint');
    console.log('   3. Checking the browser developer tools for the token');
    console.log('\n   For now, running unauthorized access test only...\n');
    
    await testUnauthorizedAccess();
    return;
  }
  
  let testResults = {
    passed: 0,
    failed: 0,
    total: 0
  };
  
  const runTest = async (testName, testFunction) => {
    testResults.total++;
    try {
      const result = await testFunction();
      if (result !== null && result !== false) {
        testResults.passed++;
        return result;
      } else {
        testResults.failed++;
        return null;
      }
    } catch (error) {
      console.log(`❌ Test ${testName} threw an error: ${error.message}`);
      testResults.failed++;
      return null;
    }
  };
  
  // Run tests in sequence
  await testUnauthorizedAccess();
  
  const project = await runTest('Create Project', testCreateProject);
  if (!project) return;
  
  await runTest('Get All Projects', testGetAllProjects);
  await runTest('Get Single Project', () => testGetSingleProject(project.id));
  await runTest('Update Project', () => testUpdateProject(project.id));
  await runTest('Create Milestone', () => testCreateMilestone(project.id));
  await runTest('Create Accountability Fee', () => testCreateAccountabilityFee(project.id));
  
  // Get updated project to see milestones
  await runTest('Get Updated Project', () => testGetSingleProject(project.id));
  
  // Clean up - delete the test project
  await runTest('Delete Project', () => testDeleteProject(project.id));
  
  // Verify deletion
  console.log(`\n🧪 Verifying project deletion`);
  const deletedProject = await makeRequest('GET', `${API_URL}/${project.id}`);
  if (deletedProject.status === 404) {
    console.log('✅ Project properly deleted (404 Not Found)');
    testResults.passed++;
  } else {
    console.log('❌ Project still exists after deletion');
    testResults.failed++;
  }
  testResults.total++;
  
  // Print summary
  console.log('\n📊 Test Results Summary');
  console.log('======================');
  console.log(`✅ Passed: ${testResults.passed}/${testResults.total}`);
  console.log(`❌ Failed: ${testResults.failed}/${testResults.total}`);
  console.log(`📈 Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(1)}%`);
  
  if (testResults.failed === 0) {
    console.log('\n🎉 All tests passed! The Project Management API is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the implementation.');
  }
};

// Run the tests
runTests().catch(console.error);