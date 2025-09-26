/**
 * Cleanup Test Data Script
 * 
 * This script cleans up test data and ensures the test user exists
 * before running tests.
 */

import { prisma } from './src/config/prisma.js';

async function cleanupTestData() {
  try {
    console.log('🧹 Cleaning up test data...');
    
    // Find the test user
    const testUser = await prisma.user.findUnique({
      where: { email: 'test-user@jest-tests.com' }
    });

    if (testUser) {
      console.log('👤 Found test user:', {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name
      });

      // Delete all projects for the test user
      const deletedProjects = await prisma.project.deleteMany({
        where: { userId: testUser.id }
      });

      console.log(`🗑️  Deleted ${deletedProjects.count} test projects`);
    } else {
      console.log('⚠️  Test user not found, creating...');
      
      const newTestUser = await prisma.user.create({
        data: { 
          email: 'test-user@jest-tests.com', 
          name: 'Jest Test User' 
        }
      });

      console.log('✅ Created test user:', {
        id: newTestUser.id,
        email: newTestUser.email,
        name: newTestUser.name
      });
    }
    
    console.log('✅ Cleanup complete!');
    
  } catch (error) {
    console.error('❌ Error during cleanup:', error);
  } finally {
    await prisma.$disconnect();
  }
}

cleanupTestData();