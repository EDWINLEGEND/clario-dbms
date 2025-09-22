/**
 * CLARIO Backend Authentication Flow Test Script
 * 
 * This script performs comprehensive end-to-end testing of the authentication system
 * including Google OAuth, JWT tokens, and secure cookie handling.
 * 
 * Prerequisites:
 * - Backend server running on http://localhost:4000
 * - Valid Google OAuth authorization code (obtained manually from consent screen)
 * - Node.js with fetch support (Node 18+) or install node-fetch
 */

const BASE_URL = 'http://localhost:4000';

// Test configuration
const TEST_CONFIG = {
  baseUrl: BASE_URL,
  endpoints: {
    googleAuth: '/auth/google',
    me: '/auth/me',
    refresh: '/auth/refresh',
    logout: '/auth/logout'
  }
};

// Test state storage
let testState = {
  accessToken: null,
  refreshTokenCookie: null,
  userProfile: null
};

// Test results storage
let testResults = [];

/**
 * Utility function to make HTTP requests with proper cookie handling
 */
async function makeRequest(method, endpoint, options = {}) {
  const url = `${TEST_CONFIG.baseUrl}${endpoint}`;
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  };

  if (options.body && typeof options.body === 'object') {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(url, config);
    const responseData = await response.text();
    
    let parsedData;
    try {
      parsedData = JSON.parse(responseData);
    } catch {
      parsedData = responseData;
    }

    return {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data: parsedData,
      cookies: response.headers.get('set-cookie')
    };
  } catch (error) {
    return {
      status: 0,
      statusText: 'Network Error',
      headers: {},
      data: { error: error.message },
      cookies: null
    };
  }
}

/**
 * Extract refresh token from Set-Cookie header
 */
function extractRefreshToken(setCookieHeader) {
  if (!setCookieHeader) return null;
  
  const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
  for (const cookie of cookies) {
    if (cookie.includes('rt=')) {
      const match = cookie.match(/rt=([^;]+)/);
      return match ? match[1] : null;
    }
  }
  return null;
}

/**
 * Test Step 1: Google Sign-In
 */
async function testGoogleSignIn(authCode, redirectUri = 'http://localhost:3001/auth/callback') {
  console.log('\n🔐 Testing Step 1: Google Sign-In (POST /auth/google)');
  
  const response = await makeRequest('POST', TEST_CONFIG.endpoints.googleAuth, {
    body: {
      code: authCode,
      redirectUri: redirectUri
    }
  });

  const result = {
    step: 1,
    name: 'Google Sign-In',
    request: `POST ${TEST_CONFIG.endpoints.googleAuth}`,
    statusCode: response.status,
    verificationPoints: [],
    passed: true,
    details: {}
  };

  // Verification Point 1: Status Code
  if (response.status === 200) {
    result.verificationPoints.push('✅ HTTP status code is 200 OK');
  } else {
    result.verificationPoints.push(`❌ Expected 200 OK, got ${response.status} ${response.statusText}`);
    result.passed = false;
  }

  // Verification Point 2: Access Token in Response Body
  if (response.data && response.data.accessToken) {
    result.verificationPoints.push('✅ accessToken received in response body');
    testState.accessToken = response.data.accessToken;
    result.details.accessToken = response.data.accessToken.substring(0, 20) + '...';
  } else {
    result.verificationPoints.push('❌ accessToken missing from response body');
    result.passed = false;
  }

  // Verification Point 3: User Profile Data
  if (response.data && response.data.user) {
    result.verificationPoints.push('✅ User profile data received');
    testState.userProfile = response.data.user;
    result.details.userProfile = response.data.user;
  } else {
    result.verificationPoints.push('❌ User profile data missing');
    result.passed = false;
  }

  // Verification Point 4: Refresh Token Cookie
  const refreshToken = extractRefreshToken(response.cookies);
  if (refreshToken) {
    result.verificationPoints.push('✅ refreshToken cookie set in response headers');
    testState.refreshTokenCookie = refreshToken;
    
    // Check cookie security attributes
    if (response.cookies.includes('HttpOnly')) {
      result.verificationPoints.push('✅ refreshToken cookie is HttpOnly');
    } else {
      result.verificationPoints.push('❌ refreshToken cookie is not HttpOnly');
      result.passed = false;
    }
    
    if (response.cookies.includes('Secure') || response.cookies.includes('SameSite')) {
      result.verificationPoints.push('✅ refreshToken cookie has security attributes');
    } else {
      result.verificationPoints.push('⚠️  refreshToken cookie missing Secure/SameSite attributes');
    }
  } else {
    result.verificationPoints.push('❌ refreshToken cookie not set');
    result.passed = false;
  }

  result.details.responseData = response.data;
  result.details.cookies = response.cookies;
  
  testResults.push(result);
  return result;
}

/**
 * Test Step 2: Access Protected Route
 */
async function testProtectedRoute() {
  console.log('\n🔒 Testing Step 2: Access Protected Route (GET /auth/me)');
  
  if (!testState.accessToken) {
    const result = {
      step: 2,
      name: 'Access Protected Route',
      request: `GET ${TEST_CONFIG.endpoints.me}`,
      statusCode: 0,
      verificationPoints: ['❌ Cannot test - no access token from previous step'],
      passed: false,
      details: {}
    };
    testResults.push(result);
    return result;
  }

  const response = await makeRequest('GET', TEST_CONFIG.endpoints.me, {
    headers: {
      'Authorization': `Bearer ${testState.accessToken}`
    }
  });

  const result = {
    step: 2,
    name: 'Access Protected Route',
    request: `GET ${TEST_CONFIG.endpoints.me}`,
    statusCode: response.status,
    verificationPoints: [],
    passed: true,
    details: {}
  };

  // Verification Point 1: Status Code
  if (response.status === 200) {
    result.verificationPoints.push('✅ HTTP status code is 200 OK');
  } else {
    result.verificationPoints.push(`❌ Expected 200 OK, got ${response.status} ${response.statusText}`);
    result.passed = false;
  }

  // Verification Point 2: User Profile Data
  if (response.data && response.data.email) {
    result.verificationPoints.push('✅ User profile data received with email');
    result.details.userProfile = response.data;
  } else {
    result.verificationPoints.push('❌ User profile data missing or incomplete');
    result.passed = false;
  }

  // Verification Point 3: Data Consistency
  if (testState.userProfile && response.data && response.data.email === testState.userProfile.email) {
    result.verificationPoints.push('✅ User profile data consistent with login');
  } else {
    result.verificationPoints.push('❌ User profile data inconsistent with login');
    result.passed = false;
  }

  result.details.responseData = response.data;
  testResults.push(result);
  return result;
}

/**
 * Test Step 3: Unauthorized Access
 */
async function testUnauthorizedAccess() {
  console.log('\n🚫 Testing Step 3: Unauthorized Access (GET /auth/me without token)');
  
  const response = await makeRequest('GET', TEST_CONFIG.endpoints.me);

  const result = {
    step: 3,
    name: 'Unauthorized Access',
    request: `GET ${TEST_CONFIG.endpoints.me}`,
    statusCode: response.status,
    verificationPoints: [],
    passed: true,
    details: {}
  };

  // Verification Point 1: Status Code
  if (response.status === 401) {
    result.verificationPoints.push('✅ HTTP status code is 401 Unauthorized');
  } else {
    result.verificationPoints.push(`❌ Expected 401 Unauthorized, got ${response.status} ${response.statusText}`);
    result.passed = false;
  }

  // Verification Point 2: Error Message
  if (response.data && response.data.error) {
    result.verificationPoints.push('✅ Error message provided in response');
  } else {
    result.verificationPoints.push('❌ No error message in response');
    result.passed = false;
  }

  result.details.responseData = response.data;
  testResults.push(result);
  return result;
}

/**
 * Test Step 4: Refresh Session
 */
async function testRefreshSession() {
  console.log('\n🔄 Testing Step 4: Refresh Session (POST /auth/refresh)');
  
  if (!testState.refreshTokenCookie) {
    const result = {
      step: 4,
      name: 'Refresh Session',
      request: `POST ${TEST_CONFIG.endpoints.refresh}`,
      statusCode: 0,
      verificationPoints: ['❌ Cannot test - no refresh token from previous step'],
      passed: false,
      details: {}
    };
    testResults.push(result);
    return result;
  }

  const response = await makeRequest('POST', TEST_CONFIG.endpoints.refresh, {
    headers: {
      'Cookie': `rt=${testState.refreshTokenCookie}`
    }
  });

  const result = {
    step: 4,
    name: 'Refresh Session',
    request: `POST ${TEST_CONFIG.endpoints.refresh}`,
    statusCode: response.status,
    verificationPoints: [],
    passed: true,
    details: {}
  };

  // Verification Point 1: Status Code
  if (response.status === 200) {
    result.verificationPoints.push('✅ HTTP status code is 200 OK');
  } else {
    result.verificationPoints.push(`❌ Expected 200 OK, got ${response.status} ${response.statusText}`);
    result.passed = false;
  }

  // Verification Point 2: New Access Token
  if (response.data && response.data.accessToken) {
    result.verificationPoints.push('✅ New accessToken received in response body');
    
    // Verification Point 3: Token is Different
    if (response.data.accessToken !== testState.accessToken) {
      result.verificationPoints.push('✅ New accessToken is different from previous token');
      testState.accessToken = response.data.accessToken; // Update for logout test
    } else {
      result.verificationPoints.push('❌ New accessToken is identical to previous token');
      result.passed = false;
    }
  } else {
    result.verificationPoints.push('❌ New accessToken missing from response body');
    result.passed = false;
  }

  // Verification Point 4: New Refresh Token Cookie
  const newRefreshToken = extractRefreshToken(response.cookies);
  if (newRefreshToken) {
    result.verificationPoints.push('✅ New refreshToken cookie set (token rotation)');
    testState.refreshTokenCookie = newRefreshToken;
  } else {
    result.verificationPoints.push('⚠️  No new refreshToken cookie (token not rotated)');
  }

  result.details.responseData = response.data;
  result.details.cookies = response.cookies;
  testResults.push(result);
  return result;
}

/**
 * Test Step 5: Logout
 */
async function testLogout() {
  console.log('\n🚪 Testing Step 5: Logout (POST /auth/logout)');
  
  if (!testState.refreshTokenCookie) {
    const result = {
      step: 5,
      name: 'Logout',
      request: `POST ${TEST_CONFIG.endpoints.logout}`,
      statusCode: 0,
      verificationPoints: ['❌ Cannot test - no refresh token available'],
      passed: false,
      details: {}
    };
    testResults.push(result);
    return result;
  }

  const response = await makeRequest('POST', TEST_CONFIG.endpoints.logout, {
    headers: {
      'Cookie': `rt=${testState.refreshTokenCookie}`
    }
  });

  const result = {
    step: 5,
    name: 'Logout',
    request: `POST ${TEST_CONFIG.endpoints.logout}`,
    statusCode: response.status,
    verificationPoints: [],
    passed: true,
    details: {}
  };

  // Verification Point 1: Status Code
  if (response.status === 200) {
    result.verificationPoints.push('✅ HTTP status code is 200 OK');
  } else {
    result.verificationPoints.push(`❌ Expected 200 OK, got ${response.status} ${response.statusText}`);
    result.passed = false;
  }

  // Verification Point 2: Cookie Clearing
  if (response.cookies && (response.cookies.includes('rt=;') || response.cookies.includes('rt=""'))) {
    result.verificationPoints.push('✅ refreshToken cookie cleared in response headers');
  } else {
    result.verificationPoints.push('❌ refreshToken cookie not properly cleared');
    result.passed = false;
  }

  // Verification Point 3: Cookie Expiry
  if (response.cookies && response.cookies.includes('expires=')) {
    result.verificationPoints.push('✅ Cookie expiry date set to past');
  } else {
    result.verificationPoints.push('⚠️  Cookie expiry not explicitly set');
  }

  result.details.responseData = response.data;
  result.details.cookies = response.cookies;
  testResults.push(result);
  return result;
}

/**
 * Generate Test Report
 */
function generateTestReport() {
  console.log('\n📊 CLARIO Authentication Flow Test Report');
  console.log('=' .repeat(60));
  
  const passedTests = testResults.filter(r => r.passed).length;
  const totalTests = testResults.length;
  
  console.log(`\n📈 Overall Results: ${passedTests}/${totalTests} tests passed\n`);
  
  let markdownReport = `# CLARIO Backend Authentication Flow Test Report\n\n`;
  markdownReport += `**Test Date:** ${new Date().toISOString()}\n`;
  markdownReport += `**Backend URL:** ${TEST_CONFIG.baseUrl}\n`;
  markdownReport += `**Overall Result:** ${passedTests}/${totalTests} tests passed\n\n`;
  
  testResults.forEach(result => {
    console.log(`\n## Step ${result.step}: ${result.name}`);
    console.log(`**Request Made:** ${result.request}`);
    console.log(`**Status Code Received:** ${result.statusCode}`);
    console.log(`**Overall Step Result:** ${result.passed ? 'PASS' : 'FAIL'}`);
    console.log(`\n**Key Verification Points:**`);
    result.verificationPoints.forEach(point => console.log(`  ${point}`));
    
    // Add to markdown report
    markdownReport += `## Step ${result.step}: ${result.name}\n\n`;
    markdownReport += `- **Request Made:** ${result.request}\n`;
    markdownReport += `- **Status Code Received:** ${result.statusCode}\n`;
    markdownReport += `- **Overall Step Result:** ${result.passed ? '✅ PASS' : '❌ FAIL'}\n\n`;
    markdownReport += `**Key Verification Points:**\n`;
    result.verificationPoints.forEach(point => {
      markdownReport += `- ${point}\n`;
    });
    markdownReport += `\n`;
    
    if (Object.keys(result.details).length > 0) {
      markdownReport += `**Additional Details:**\n`;
      markdownReport += `\`\`\`json\n${JSON.stringify(result.details, null, 2)}\n\`\`\`\n\n`;
    }
  });
  
  return markdownReport;
}

/**
 * Main Test Runner
 */
async function runAuthenticationTests(googleAuthCode) {
  console.log('🚀 Starting CLARIO Authentication Flow Tests...');
  console.log(`📍 Backend URL: ${TEST_CONFIG.baseUrl}`);
  
  if (!googleAuthCode) {
    console.log('\n❌ ERROR: Google authorization code is required');
    console.log('Please obtain a valid authorization code from Google OAuth consent screen');
    console.log('Example usage: runAuthenticationTests("4/0AX4XfWh...")');
    return;
  }
  
  try {
    // Run all test steps sequentially
    await testGoogleSignIn(googleAuthCode);
    await testProtectedRoute();
    await testUnauthorizedAccess();
    await testRefreshSession();
    await testLogout();
    
    // Generate and return the report
    const report = generateTestReport();
    
    console.log('\n✅ All tests completed!');
    console.log('📄 Full markdown report generated');
    
    return {
      results: testResults,
      report: report,
      summary: {
        total: testResults.length,
        passed: testResults.filter(r => r.passed).length,
        failed: testResults.filter(r => !r.passed).length
      }
    };
    
  } catch (error) {
    console.error('\n❌ Test execution failed:', error);
    return {
      error: error.message,
      results: testResults
    };
  }
}

// Export for use in Node.js or browser
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    runAuthenticationTests,
    testResults,
    generateTestReport
  };
}

// Example usage (uncomment and provide real auth code):
// runAuthenticationTests('4/0AX4XfWh...');

console.log('🔧 CLARIO Authentication Test Script Loaded');
console.log('📝 To run tests, call: runAuthenticationTests("your-google-auth-code")');