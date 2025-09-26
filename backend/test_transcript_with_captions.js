// Test script for YouTube transcript extraction with videos likely to have captions
import { getYouTubeTranscript } from './src/services/youtubeService.js';

async function testTranscriptWithCaptions() {
  console.log('🎬 Testing YouTube transcript extraction with educational videos...');
  
  // Test with educational/tech videos that are more likely to have transcripts
  const testVideos = [
    { id: 'PkZNo7MFNFg', title: 'Learn JavaScript - Full Course for Beginners' },
    { id: 'w7ejDZ8SWv8', title: 'React Course - Beginner\'s Tutorial for React JavaScript Library' },
    { id: 'fBNz5xF-Kx4', title: 'Node.js Tutorial for Beginners' },
    { id: 'SccSCuHhOw0', title: 'Learn CSS Grid' },
    { id: 'rfscVS0vtbw', title: 'Learn Python - Full Course for Beginners' }
  ];
  
  for (const video of testVideos) {
    console.log(`\n📹 Testing: ${video.title}`);
    console.log(`🔗 Video ID: ${video.id}`);
    
    try {
      const transcript = await getYouTubeTranscript(video.id);
      
      if (transcript) {
        console.log(`✅ Transcript extracted successfully!`);
        console.log(`📝 Length: ${transcript.length} characters`);
        console.log(`🔤 Preview: ${transcript.substring(0, 150)}...`);
      } else {
        console.log(`⚠️  No transcript available for this video`);
      }
    } catch (error) {
      console.error(`❌ Error extracting transcript:`, error.message);
    }
    
    // Add a small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
}

testTranscriptWithCaptions();