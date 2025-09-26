// Test script for the Video Compatibility Scoring Algorithm
import { prisma } from './src/config/prisma.js';
import { calculateAndSaveScores, getVideoScores } from './src/services/scoringService.js';

async function testScoringAlgorithm() {
  try {
    console.log('🧪 Testing Video Compatibility Scoring Algorithm...\n');

    // First, let's create a test video with a rich transcript that contains keywords
    const testTranscript = `
      Welcome to this comprehensive tutorial! Let's build a complete web application step-by-step.
      As you can see on the screen, we have a beautiful interface with a clean design.
      The concept is simple but powerful - we'll create a hands-on project that demonstrates
      key principles of modern web development.
      
      Look at this diagram that shows the architecture. The flowchart illustrates how
      data flows through our application. Try this approach in your own projects.
      
      The theory behind this is based on fundamental programming principles. In other words,
      we're implementing a practical solution that you can code along with.
      
      Your turn to practice! This exercise will help you understand the visual elements
      and the conceptual framework. Let's implement this together in our workshop.
      
      Listen closely to the explanation of how these components work. The principle is
      that we build, test, and debug our code systematically. This hands-on tutorial
      will guide you through each step of the process.
    `;

    // Create a test video with rich transcript
    const testVideo = await prisma.video.create({
      data: {
        title: 'Test Scoring Algorithm Video',
        description: 'A test video with rich transcript for scoring algorithm validation',
        transcript: testTranscript
      }
    });

    console.log(`✅ Created test video with ID: ${testVideo.id}`);
    console.log(`📝 Transcript length: ${testTranscript.length} characters\n`);

    // Calculate and save scores
    console.log('🔍 Calculating compatibility scores...');
    await calculateAndSaveScores(testVideo.id);

    // Retrieve and display the scores
    console.log('\n📊 Retrieving calculated scores...');
    const scores = await getVideoScores(testVideo.id);

    if (scores.length === 0) {
      console.log('❌ No scores were calculated!');
    } else {
      console.log(`✅ Successfully calculated ${scores.length} compatibility scores:`);
      scores.forEach(score => {
        console.log(`   🎯 ${score.learningType.typeName} (ID: ${score.learningTypeId}): ${score.score} points`);
        console.log(`      Keywords: ${score.keyword}`);
      });
    }

    // Also check the raw VideoTag records
    console.log('\n🗄️  Raw VideoTag records:');
    const rawTags = await prisma.videoTag.findMany({
      where: { videoId: testVideo.id },
      orderBy: { score: 'desc' }
    });

    rawTags.forEach(tag => {
      console.log(`   - Video ID: ${tag.videoId}, Learning Type ID: ${tag.learningTypeId}, Score: ${tag.score}`);
    });

    // Clean up - delete the test video and its tags
    console.log('\n🧹 Cleaning up test data...');
    await prisma.videoTag.deleteMany({
      where: { videoId: testVideo.id }
    });
    await prisma.video.delete({
      where: { id: testVideo.id }
    });

    console.log('✅ Test completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testScoringAlgorithm();