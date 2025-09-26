// /backend/src/services/scoringService.js
import { prisma } from '../config/prisma.js';

// Keyword dictionaries for different learning styles
const learningStyleKeywords = {
  // Visual (Seeing/Diagrams) - Learning Type ID 1
  1: [
    'look at this diagram', 'as you can see', 'on the screen', 'whiteboard', 
    'illustration', 'flowchart', 'demonstration', 'visual', 'diagram', 
    'chart', 'graph', 'image', 'picture', 'show', 'display', 'interface',
    'layout', 'design', 'color', 'highlight', 'arrow', 'pointer'
  ],
  
  // Auditory (Listening/Conceptual) - Learning Type ID 2
  2: [
    'the concept is', 'the theory', 'in other words', 'to explain', 
    'listen closely', 'the principle is', 'imagine that', 'understand',
    'concept', 'theory', 'principle', 'idea', 'think about', 'consider',
    'remember', 'important', 'key point', 'basically', 'essentially',
    'fundamentally', 'conceptually', 'theoretically'
  ],
  
  // Kinesthetic (Doing/Practical) - Learning Type ID 3
  3: [
    'let\'s build', 'code along', 'step-by-step', 'try this', 'your turn', 
    'project', 'exercise', 'hands-on', 'practice', 'implement', 'create',
    'build', 'make', 'do', 'action', 'execute', 'run', 'test', 'debug',
    'fix', 'solve', 'work through', 'tutorial', 'workshop', 'lab'
  ]
};

/**
 * Calculates compatibility scores for a video based on transcript keyword analysis
 * and saves the scores as VideoTag records in the database
 * @param {number} videoId - The database ID of the video (not YouTube ID)
 * @returns {Promise<void>}
 */
export async function calculateAndSaveScores(videoId) {
  try {
    console.log(`🔍 Calculating scores for video ID: ${videoId}`);
    
    // Fetch the video record and its transcript from the database
    const video = await prisma.video.findUnique({
      where: { id: videoId },
      select: { id: true, title: true, transcript: true }
    });

    if (!video) {
      console.log(`❌ Video with ID ${videoId} not found`);
      return;
    }

    if (!video.transcript || video.transcript.trim() === '') {
      console.log(`⚠️  No transcript available for video: ${video.title}`);
      return;
    }

    console.log(`📝 Analyzing transcript for video: ${video.title}`);
    console.log(`📊 Transcript length: ${video.transcript.length} characters`);

    // Convert transcript to lowercase for case-insensitive matching
    const transcript = video.transcript.toLowerCase();
    
    // Calculate scores for each learning style
    const scores = [];
    
    for (const [learningTypeId, keywords] of Object.entries(learningStyleKeywords)) {
      let totalScore = 0;
      const matchedKeywords = [];
      
      // Count occurrences of each keyword
      for (const keyword of keywords) {
        const keywordLower = keyword.toLowerCase();
        const regex = new RegExp(`\\b${keywordLower.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
        const matches = transcript.match(regex);
        const count = matches ? matches.length : 0;
        
        if (count > 0) {
          totalScore += count;
          matchedKeywords.push(keyword);
        }
      }
      
      console.log(`🎯 Learning Type ${learningTypeId}: ${totalScore} keyword matches`);
      
      // Only save scores greater than 0
      if (totalScore > 0) {
        scores.push({
          videoId: videoId,
          learningTypeId: parseInt(learningTypeId),
          keyword: matchedKeywords.join(', '), // Join all matched keywords
          score: totalScore
        });
      }
    }

    if (scores.length === 0) {
      console.log(`📊 No keyword matches found for video: ${video.title}`);
      return;
    }

    // Delete existing VideoTag records for this video to prevent duplicates
    await prisma.videoTag.deleteMany({
      where: { videoId: videoId }
    });

    console.log(`🗑️  Cleared existing tags for video ID: ${videoId}`);

    // Save new scores to the database
    const result = await prisma.videoTag.createMany({
      data: scores
    });

    console.log(`✅ Successfully saved ${result.count} VideoTag records for video: ${video.title}`);
    
    // Log the scores for debugging
    scores.forEach(score => {
      console.log(`   - Learning Type ${score.learningTypeId}: Score ${score.score}`);
    });

  } catch (error) {
    console.error(`❌ Error calculating scores for video ID ${videoId}:`, error);
    throw error;
  }
}

/**
 * Gets the current scores for a video
 * @param {number} videoId - The database ID of the video
 * @returns {Promise<Array>} Array of VideoTag records
 */
export async function getVideoScores(videoId) {
  try {
    const scores = await prisma.videoTag.findMany({
      where: { videoId: videoId },
      include: {
        learningType: {
          select: { id: true, typeName: true }
        }
      },
      orderBy: { score: 'desc' }
    });

    return scores;
  } catch (error) {
    console.error(`❌ Error fetching scores for video ID ${videoId}:`, error);
    throw error;
  }
}