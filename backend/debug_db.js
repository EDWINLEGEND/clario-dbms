/**
 * Database Debug Script
 * 
 * This script tests database connectivity and basic operations
 * to identify the root cause of the 500 errors.
 */

import { prisma } from './src/config/prisma.js';

async function debugDatabase() {
  try {
    console.log('🔍 Testing database connectivity...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test finding the test user
    const testUser = await prisma.user.findUnique({
      where: { email: 'test-user@jest-tests.com' }
    });
    
    if (testUser) {
      console.log('👤 Test user found:', {
        id: testUser.id,
        email: testUser.email,
        name: testUser.name
      });
      
      // Test finding projects for this user
      const projects = await prisma.project.findMany({
        where: { userId: testUser.id },
        include: {
          milestones: true
        }
      });
      
      console.log(`📋 Found ${projects.length} projects for test user`);
      
      if (projects.length > 0) {
        console.log('First project:', {
          id: projects[0].id,
          title: projects[0].title,
          userId: projects[0].userId
        });
        
        // Test finding a specific project
        const singleProject = await prisma.project.findUnique({
          where: { id: projects[0].id },
          include: {
            milestones: true
          }
        });
        
        console.log('✅ Single project query successful');
      }
      
      // Test creating a simple project
      console.log('🧪 Testing project creation...');
      const newProject = await prisma.project.create({
        data: {
          title: 'Debug Test Project',
          description: 'Testing database operations',
          userId: testUser.id
        }
      });
      
      console.log('✅ Project creation successful:', {
        id: newProject.id,
        title: newProject.title
      });
      
      // Clean up the test project
      await prisma.project.delete({
        where: { id: newProject.id }
      });
      
      console.log('🧹 Test project cleaned up');
      
    } else {
      console.log('❌ Test user not found');
    }
    
  } catch (error) {
    console.error('❌ Database error:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      meta: error.meta
    });
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
  }
}

debugDatabase();