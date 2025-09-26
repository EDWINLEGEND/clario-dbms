// Test script specifically for YouTube transcript extraction
import { getYouTubeTranscript } from './src/services/youtubeService.js';

async function testTranscriptExtraction() {
  console.log('🎬 Testing YouTube transcript extraction...');
  
  // Test with different video IDs
  const testVideos = [
    { id: 'dQw4w9WgXcQ', title: 'Rick Astley - Never Gonna Give You Up' },
    { id: 'jNQXAC9IVRw', title: 'Me at the zoo (first YouTube video)' },
    { id: 'kJQP7kiw5Fk', title: 'Luis Fonsi - Despacito' }
  ];
  
  for (const video of testVideos) {
    console.log(`\n📹 Testing: ${video.title} (${video.id})`);
    
    try {
      const transcript = await getYouTubeTranscript(video.id);
      
      if (transcript) {
        console.log(`✅ Transcript extracted successfully!`);
        console.log(`📝 Length: ${transcript.length} characters`);
        console.log(`🔤 Preview: ${transcript.substring(0, 100)}...`);
      } else {
        console.log(`⚠️  No transcript available for this video`);
      }
    } catch (error) {
      console.error(`❌ Error extracting transcript:`, error.message);
    }
  }
}

testTranscriptExtraction();