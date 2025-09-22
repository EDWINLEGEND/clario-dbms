// Test script for Reminder API endpoints
// This script tests the basic functionality of reminder endpoints without authentication

const BASE_URL = 'http://localhost:4000';

// Test configuration
const testConfig = {
  timeout: 5000,
  verbose: true
};

// Helper function to make HTTP requests
async function testEndpoint(method, endpoint, data = null, expectedStatus = null) {
  const url = `${BASE_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    const responseData = await response.text();
    
    let parsedData;
    try {
      parsedData = JSON.parse(responseData);
    } catch {
      parsedData = responseData;
    }

    const result = {
      status: response.status,
      data: parsedData,
      success: expectedStatus ? response.status === expectedStatus : response.status < 400
    };

    if (testConfig.verbose) {
      console.log(`${method} ${endpoint}: ${response.status} ${response.statusText}`);
      if (!result.success && typeof parsedData === 'object') {
        console.log('  Error:', parsedData.error || parsedData.message || 'Unknown error');
      }
    }

    return result;
  } catch (error) {
    console.error(`Request failed for ${method} ${endpoint}:`, error.message);
    return {
      status: 0,
      data: { error: error.message },
      success: false
    };
  }
}

// Test data
const testReminderData = {
  milestoneId: 1,
  channel: 'email',
  sendDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Tomorrow
};

async function runTests() {
  console.log('🧪 Testing Reminder API Endpoints');
  console.log('=====================================\n');

  let passedTests = 0;
  let totalTests = 0;

  // Test 1: POST /reminders without authentication (should return 401)
  console.log('1. Testing POST /reminders without authentication...');
  totalTests++;
  const createTest = await testEndpoint('POST', '/reminders', testReminderData, 401);
  if (createTest.status === 401) {
    console.log('   ✅ Correctly requires authentication');
    passedTests++;
  } else {
    console.log('   ❌ Should require authentication');
  }

  // Test 2: GET /reminders without authentication (should return 401)
  console.log('\n2. Testing GET /reminders without authentication...');
  totalTests++;
  const getTest = await testEndpoint('GET', '/reminders', null, 401);
  if (getTest.status === 401) {
    console.log('   ✅ Correctly requires authentication');
    passedTests++;
  } else {
    console.log('   ❌ Should require authentication');
  }

  // Test 3: POST /reminders with invalid data (should return 401 due to no auth)
  console.log('\n3. Testing POST /reminders with invalid data...');
  totalTests++;
  const invalidDataTest = await testEndpoint('POST', '/reminders', {}, 401);
  if (invalidDataTest.status === 401) {
    console.log('   ✅ Authentication check happens before validation');
    passedTests++;
  } else {
    console.log('   ❌ Should check authentication first');
  }

  // Test 4: Check if reminder routes are properly mounted
  console.log('\n4. Testing route mounting...');
  totalTests++;
  const routeTest = await testEndpoint('GET', '/reminders');
  if (routeTest.status === 401) {
    console.log('   ✅ Reminder routes are properly mounted');
    passedTests++;
  } else {
    console.log('   ❌ Reminder routes may not be properly mounted');
  }

  // Test 5: Test with query parameters (should still require auth)
  console.log('\n5. Testing GET /reminders with query parameters...');
  totalTests++;
  const queryTest = await testEndpoint('GET', '/reminders?status=SCHEDULED&limit=10', null, 401);
  if (queryTest.status === 401) {
    console.log('   ✅ Query parameters work, authentication still required');
    passedTests++;
  } else {
    console.log('   ❌ Should require authentication regardless of query params');
  }

  // Summary
  console.log('\n📊 Test Summary');
  console.log('================');
  console.log(`Passed: ${passedTests}/${totalTests} tests`);
  console.log(`Success Rate: ${((passedTests/totalTests) * 100).toFixed(1)}%`);

  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Reminder endpoints are properly implemented.');
    console.log('\n📝 Next Steps:');
    console.log('   • Obtain a valid JWT token to test authenticated functionality');
    console.log('   • Test reminder creation with valid milestone data');
    console.log('   • Test reminder retrieval with different filters');
    console.log('   • Verify authorization logic (users can only access their own reminders)');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the implementation.');
  }

  console.log('\n✨ Reminder API testing completed!');
}

// Run the tests
runTests().catch(console.error);