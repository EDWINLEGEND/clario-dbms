// Script to fix the auto-increment sequence for Video table (PostgreSQL)
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixVideoSequence() {
  try {
    console.log('🔧 Fixing Video table auto-increment sequence for PostgreSQL...');
    
    // Get the highest ID in the Video table
    const maxVideo = await prisma.video.findFirst({
      orderBy: { id: 'desc' }
    });
    
    if (maxVideo) {
      console.log(`📊 Highest video ID: ${maxVideo.id}`);
      
      // Reset the sequence to start from the next available ID
      const nextId = maxVideo.id + 1;
      console.log(`🔄 Setting sequence to start from ID: ${nextId}`);
      
      // For PostgreSQL, we need to update the sequence
      await prisma.$executeRaw`SELECT setval(pg_get_serial_sequence('"Video"', 'id'), ${maxVideo.id}, true)`;
      
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