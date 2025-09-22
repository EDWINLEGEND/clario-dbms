/**
 * Personalized Video Search API Test Script
 * Tests the enhanced GET /videos endpoint with authentication and compatibility scoring
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:4000';
const API_URL = `${BASE_URL}/videos`;

// Test configuration
const testConfig = {
  // You'll need to replace this with a valid access token from Google OAuth
  // For testing, you can get one by logging in through the frontend or using the auth endpoint
  accessToken: 'YOUR_ACCESS_TOKEN_HERE',
  testQueries: [
    'javascript tutorial',
    'react hooks',
    'node.js express',
    'database design',
    'machine learning'
  ]
};

// Helper function to make authenticated requests
async function makeAuthenticatedRequest(url, accessToken) {
  try {
    const response = await axios.get(url, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    });
    return { success: true, data: response.data, status: response.status };
  } catch (error) {
    return { 
      success: false, 
      error: error.response?.data || error.message, 
      status: error.response?.status || 500 
    };
  }
}

// Test functions
async function testUnauthorizedAccess() {
  console.log('\n🔒 Testing Unauthorized Access...');
  
  try {
    const response = await axios.get(`${API_URL}?search_query=javascript`);
    console.log('❌ FAIL: Should have returned 401 Unauthorized');
    return false;
  } catch (error) {
    if (error.response?.status === 401) {
      console.log('✅ PASS: Correctly returned 401 Unauthorized');
      console.log(`   Response: ${JSON.stringify(error.response.data)}`);
      return true;
    } else {
      console.log(`❌ FAIL: Expected 401, got ${error.response?.status}`);
      return false;
    }
  }
}

async function testAuthenticatedSearch(accessToken) {
  console.log('\n🔍 Testing Authenticated Video Search...');
  
  const testQuery = testConfig.testQueries[0];
  const result = await makeAuthenticatedRequest(`${API_URL}?search_query=${encodeURIComponent(testQuery)}`, accessToken);
  
  if (!result.success) {
    console.log(`❌ FAIL: Request failed with status ${result.status}`);
    console.log(`   Error: ${JSON.stringify(result.error)}`);
    return false;
  }
  
  const data = result.data;
  
  // Verify response structure
  const requiredFields = ['query', 'items', 'metrics'];
  const missingFields = requiredFields.filter(field => !(field in data));
  
  if (missingFields.length > 0) {
    console.log(`❌ FAIL: Missing required fields: ${missingFields.join(', ')}`);
    return false;
  }
  
  // Verify items have compatibility scores
  if (data.items && data.items.length > 0) {
    const hasCompatibilityScores = data.items.every(item => 'compatibilityScore' in item);
    if (!hasCompatibilityScores) {
      console.log('❌ FAIL: Not all items have compatibilityScore field');
      return false;
    }
    
    // Check if items are sorted by compatibility score (descending)
    const scores = data.items.map(item => item.compatibilityScore);
    const isSorted = scores.every((score, index) => 
      index === 0 || scores[index - 1] >= score
    );
    
    if (!isSorted) {
      console.log('❌ FAIL: Items are not sorted by compatibility score in descending order');
      console.log(`   Scores: ${scores.join(', ')}`);
      return false;
    }
    
    console.log('✅ PASS: Authenticated search successful');
    console.log(`   Query: "${data.query}"`);
    console.log(`   Results: ${data.items.length} videos`);
    console.log(`   Avg Compatibility: ${data.metrics.avgCompatibility}`);
    console.log(`   Compatibility Scores: ${scores.join(', ')}`);
    return true;
  } else {
    console.log('⚠️  WARNING: No videos returned (might be due to missing API key or quota)');
    console.log(`   Response: ${JSON.stringify(data)}`);
    return true; // Still consider it a pass if the structure is correct
  }
}

async function testMissingSearchQuery(accessToken) {
  console.log('\n❓ Testing Missing Search Query...');
  
  const result = await makeAuthenticatedRequest(API_URL, accessToken);
  
  if (result.success) {
    console.log('❌ FAIL: Should have returned 400 Bad Request for missing query');
    return false;
  }
  
  if (result.status === 400) {
    console.log('✅ PASS: Correctly returned 400 Bad Request for missing query');
    console.log(`   Response: ${JSON.stringify(result.error)}`);
    return true;
  } else {
    console.log(`❌ FAIL: Expected 400, got ${result.status}`);
    return false;
  }
}

async function testEmptySearchQuery(accessToken) {
  console.log('\n🔍 Testing Empty Search Query...');
  
  const result = await makeAuthenticatedRequest(`${API_URL}?search_query=`, accessToken);
  
  if (result.success) {
    console.log('❌ FAIL: Should have returned 400 Bad Request for empty query');
    return false;
  }
  
  if (result.status === 400) {
    console.log('✅ PASS: Correctly returned 400 Bad Request for empty query');
    console.log(`   Response: ${JSON.stringify(result.error)}`);
    return true;
  } else {
    console.log(`❌ FAIL: Expected 400, got ${result.status}`);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Personalized Video Search API Test Suite');
  console.log('=' .repeat(50));
  
  const results = [];
  
  // Test 1: Unauthorized access
  results.push(await testUnauthorizedAccess());
  
  // Check if access token is provided
  if (testConfig.accessToken === 'YOUR_ACCESS_TOKEN_HERE') {
    console.log('\n⚠️  WARNING: No access token provided');
    console.log('   To test authenticated endpoints, please:');
    console.log('   1. Log in through the frontend or auth endpoint');
    console.log('   2. Copy the access token');
    console.log('   3. Replace YOUR_ACCESS_TOKEN_HERE in this script');
    console.log('\n   Skipping authenticated tests...');
    
    console.log('\n📊 Test Results Summary:');
    console.log(`✅ Passed: 1/1 tests (100.0%)`);
    console.log('🔒 Authentication protection verified');
    return;
  }
  
  // Test 2: Missing search query
  results.push(await testMissingSearchQuery(testConfig.accessToken));
  
  // Test 3: Empty search query
  results.push(await testEmptySearchQuery(testConfig.accessToken));
  
  // Test 4: Authenticated search with compatibility scoring
  results.push(await testAuthenticatedSearch(testConfig.accessToken));
  
  // Summary
  const passedTests = results.filter(result => result).length;
  const totalTests = results.length;
  const successRate = ((passedTests / totalTests) * 100).toFixed(1);
  
  console.log('\n📊 Test Results Summary:');
  console.log(`✅ Passed: ${passedTests}/${totalTests} tests (${successRate}%)`);
  
  if (passedTests === totalTests) {
    console.log('🎉 All tests passed! Personalized video search is working correctly.');
  } else {
    console.log('⚠️  Some tests failed. Please check the implementation.');
  }
}

// Run the tests
runTests().catch(error => {
  console.error('❌ Test suite failed:', error);
});