// Debug script to check Video table state
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function debugVideoTable() {
  try {
    console.log('🔍 Checking Video table state...');
    
    // Get all videos
    const videos = await prisma.video.findMany();
    console.log(`📹 Found ${videos.length} videos in database:`);
    
    if (videos.length > 0) {
      videos.forEach((video, index) => {
        console.log(`  ${index + 1}. ID: ${video.id}, Title: "${video.title}"`);
      });
    }
    
    // Check for videos with the test title
    const testVideos = await prisma.video.findMany({
      where: { title: 'Test Video Title' }
    });
    console.log(`🎯 Found ${testVideos.length} videos with title "Test Video Title"`);
    
    // Check for videos with "Untitled"
    const untitledVideos = await prisma.video.findMany({
      where: { title: 'Untitled' }
    });
    console.log(`📝 Found ${untitledVideos.length} videos with title "Untitled"`);
    
  } catch (error) {
    console.error('❌ Error checking video table:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugVideoTable();