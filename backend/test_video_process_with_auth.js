// Test script for video processing endpoint with proper authentication and scoring verification
import fetch from 'node-fetch';
import { prisma } from './src/config/prisma.js';
import jwt from 'jsonwebtoken';
import { config } from './src/config/env.js';

async function testVideoProcessWithAuth() {
  try {
    console.log('🧪 Testing Video Processing Endpoint with Authentication and Scoring...\n');

    // Create a test user with unique email
    const uniqueEmail = `test.video.process.${Date.now()}@example.com`;
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User for Video Processing',
        email: uniqueEmail
      }
    });

    console.log(`✅ Created test user with ID: ${testUser.id}`);

    // Generate a valid JWT token for the test user
    const token = jwt.sign(
      { userId: testUser.id, email: testUser.email },
      config.jwtSecret,
      { expiresIn: '1h' }
    );

    console.log('🔑 Generated authentication token');

    // Test data for video processing
    const testData = {
      videoId: 'dQw4w9WgXcQ', // Rick Astley - Never Gonna Give You Up
      title: 'Test Video for Scoring Integration',
      description: 'Testing the complete video processing flow with scoring algorithm'
    };

    console.log('📡 Sending request to /videos/process endpoint...');

    // Make the API request with authentication
    const response = await fetch('http://localhost:4000/videos/process', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(testData)
    });

    const responseData = await response.json();

    console.log(`📊 Status: ${response.status}`);
    console.log('📋 Response:', JSON.stringify(responseData, null, 2));

    if (response.status === 200) {
      console.log('\n✅ Video processing successful!');
      
      // Wait a moment for the scoring to complete
      console.log('⏳ Waiting for scoring algorithm to complete...');
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Check if VideoTag records were created
      console.log('\n🔍 Checking for VideoTag records...');
      const videoTags = await prisma.videoTag.findMany({
        where: { videoId: responseData.id },
        include: {
          learningType: {
            select: { id: true, typeName: true }
          }
        },
        orderBy: { score: 'desc' }
      });

      if (videoTags.length > 0) {
        console.log(`🎯 Found ${videoTags.length} VideoTag records:`);
        videoTags.forEach((tag, index) => {
          console.log(`   ${index + 1}. ${tag.learningType.typeName}: ${tag.score} points`);
          console.log(`      Keywords: ${tag.keyword.substring(0, 60)}${tag.keyword.length > 60 ? '...' : ''}`);
        });
      } else {
        console.log('⚠️  No VideoTag records found (likely due to empty transcript)');
      }

      // Clean up the created video and its tags
      console.log('\n🧹 Cleaning up test data...');
      await prisma.videoTag.deleteMany({
        where: { videoId: responseData.id }
      });
      await prisma.video.delete({
        where: { id: responseData.id }
      });
    } else {
      console.log('❌ Video processing failed');
    }

    // Clean up test user
    await prisma.user.delete({
      where: { id: testUser.id }
    });

    console.log('\n🎉 Test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testVideoProcessWithAuth();