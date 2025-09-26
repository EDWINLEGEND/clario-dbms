import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// POST /history - Track video watch progress
router.post('/', requireAuth, async (req, res) => {
  try {
    const { videoId, percentWatched } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!videoId || percentWatched === undefined) {
      return res.status(400).json({
        error: 'videoId and percentWatched are required'
      });
    }

    if (typeof percentWatched !== 'number' || percentWatched < 0 || percentWatched > 100) {
      return res.status(400).json({
        error: 'percentWatched must be a number between 0 and 100'
      });
    }

    // Check if video exists
    const video = await prisma.video.findUnique({
      where: { id: parseInt(videoId) }
    });

    if (!video) {
      return res.status(404).json({
        error: 'Video not found'
      });
    }

    // Determine status based on progress
    const status = percentWatched >= 90 ? 'COMPLETED' : 'STARTED';
    const completedAt = percentWatched >= 90 ? new Date() : null;

    // Upsert video history record
    const history = await prisma.userVideoHistory.upsert({
      where: {
        userId_videoId: {
          userId: userId,
          videoId: parseInt(videoId)
        }
      },
      update: {
        percentWatched: percentWatched,
        status: status,
        completedAt: completedAt,
        updatedAt: new Date()
      },
      create: {
        userId: userId,
        videoId: parseInt(videoId),
        percentWatched: percentWatched,
        status: status,
        completedAt: completedAt
      },
      include: {
        video: {
          select: {
            id: true,
            title: true
          }
        }
      }
    });

    res.status(200).json({
      message: 'Video progress updated successfully',
      history: history
    });

  } catch (error) {
    console.error('Error updating video history:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /history - Get user's video watch history
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;
    const { status, limit = 50, offset = 0 } = req.query;

    // Build where clause
    const whereClause = {
      userId: userId
    };

    if (status && ['STARTED', 'COMPLETED'].includes(status.toUpperCase())) {
      whereClause.status = status.toUpperCase();
    }

    // Fetch user's video history
    const history = await prisma.userVideoHistory.findMany({
      where: whereClause,
      include: {
        video: {
          select: {
            id: true,
            title: true,
            description: true,
            createdAt: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      },
      take: parseInt(limit),
      skip: parseInt(offset)
    });

    // Get total count for pagination
    const totalCount = await prisma.userVideoHistory.count({
      where: whereClause
    });

    res.status(200).json({
      history: history,
      pagination: {
        total: totalCount,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: (parseInt(offset) + parseInt(limit)) < totalCount
      }
    });

  } catch (error) {
    console.error('Error fetching video history:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /history/stats - Get user's video watch statistics
router.get('/stats', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Get aggregated statistics
    const stats = await prisma.userVideoHistory.aggregate({
      where: { userId: userId },
      _count: {
        id: true
      },
      _avg: {
        percentWatched: true
      }
    });

    const completedCount = await prisma.userVideoHistory.count({
      where: {
        userId: userId,
        status: 'COMPLETED'
      }
    });

    const inProgressCount = await prisma.userVideoHistory.count({
      where: {
        userId: userId,
        status: 'STARTED',
        percentWatched: {
          gt: 0
        }
      }
    });

    res.status(200).json({
      stats: {
        totalVideosWatched: stats._count.id || 0,
        completedVideos: completedCount,
        videosInProgress: inProgressCount,
        averageWatchPercentage: Math.round(stats._avg.percentWatched || 0)
      }
    });

  } catch (error) {
    console.error('Error fetching video statistics:', error);
    res.status(500).json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;