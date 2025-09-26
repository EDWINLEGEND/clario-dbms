/**
 * Test Token Generator for Jest Tests
 * 
 * This script creates a test user and generates a valid JWT token
 * that can be used in the Jest test suite.
 */

import { prisma } from './src/config/prisma.js';
import { signAccessToken } from './src/services/jwt.js';

async function generateTestToken() {
  try {
    console.log('🔧 Generating test token...');
    
    // Create or find a test user
    const testUser = await prisma.user.upsert({
      where: { email: 'test-user@jest-tests.com' },
      update: { name: 'Jest Test User' },
      create: { 
        email: 'test-user@jest-tests.com', 
        name: 'Jest Test User' 
      },
    });

    console.log('👤 Test user:', {
      id: testUser.id,
      email: testUser.email,
      name: testUser.name
    });

    // Generate access token
    const accessToken = signAccessToken(testUser);
    
    console.log('\n🎫 Generated JWT Token:');
    console.log('='.repeat(80));
    console.log(accessToken);
    console.log('='.repeat(80));
    
    console.log('\n📋 Instructions:');
    console.log('1. Copy the token above');
    console.log('2. Open __tests__/api.test.js');
    console.log('3. Replace the token variable value with the generated token');
    console.log('4. Run: npm test');
    
    console.log('\n✅ Token generation complete!');
    
  } catch (error) {
    console.error('❌ Error generating test token:', error);
  } finally {
    await prisma.$disconnect();
  }
}

generateTestToken();