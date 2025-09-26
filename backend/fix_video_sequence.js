// Script to fix the auto-increment sequence for Video table
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixVideoSequence() {
  try {
    console.log('🔧 Fixing Video table auto-increment sequence...');
    
    // Get the highest ID in the Video table
    const maxVideo = await prisma.video.findFirst({
      orderBy: { id: 'desc' }
    });
    
    if (maxVideo) {
      console.log(`📊 Highest video ID: ${maxVideo.id}`);
      
      // Reset the sequence to start from the next available ID
      const nextId = maxVideo.id + 1;
      console.log(`🔄 Setting sequence to start from ID: ${nextId}`);
      
      // For SQLite, we need to update the sqlite_sequence table
      await prisma.$executeRaw`UPDATE sqlite_sequence SET seq = ${maxVideo.id} WHERE name = 'Video'`;
      
      console.log('✅ Video sequence fixed successfully!');
    } else {
      console.log('📝 No videos found, sequence should be fine');
    }
    
  } catch (error) {
    console.error('❌ Error fixing video sequence:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixVideoSequence();