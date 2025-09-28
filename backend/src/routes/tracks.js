import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /tracks - Get all tracks with basic info
router.get("/", async (req, res) => {
  try {
    const tracks = await prisma.track.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      include: {
        courses: {
          orderBy: { order: 'asc' },
          include: {
            course: {
              select: {
                id: true,
                title: true,
                description: true,
                thumbnailUrl: true,
                instructor: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });

    // Transform the response to flatten the course data
    const transformedTracks = tracks.map(track => ({
      id: track.id,
      title: track.title,
      description: track.description,
      thumbnailUrl: track.thumbnailUrl,
      category: track.category,
      level: track.level,
      totalDuration: track.totalDuration,
      enrollmentCount: track.enrollmentCount,
      isPublished: track.isPublished,
      createdAt: track.createdAt,
      courses: track.courses.map(tc => ({
        order: tc.order,
        ...tc.course
      }))
    }));

    res.json(transformedTracks);

  } catch (error) {
    console.error('Error fetching tracks:', error);
    res.status(500).json({
      error: 'Internal server error while fetching tracks',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /tracks/:id - Get a single track with detailed course information
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // Validate track ID
    if (!id || id.trim() === '') {
      return res.status(400).json({
        error: 'Track ID is required'
      });
    }

    const track = await prisma.track.findUnique({
      where: { id },
      include: {
        courses: {
          orderBy: { order: 'asc' },
          include: {
            course: {
              include: {
                instructor: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    learningType: {
                      select: {
                        id: true,
                        typeName: true
                      }
                    }
                  }
                },
                lessons: {
                  orderBy: { order: 'asc' },
                  select: {
                    id: true,
                    order: true,
                    video: {
                      select: {
                        id: true,
                        title: true,
                        description: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    // Handle track not found
    if (!track) {
      return res.status(404).json({
        error: 'Track not found',
        trackId: id
      });
    }

    // Transform the response to flatten the course data and add metadata
    const response = {
      id: track.id,
      title: track.title,
      description: track.description,
      thumbnailUrl: track.thumbnailUrl,
      category: track.category,
      level: track.level,
      totalDuration: track.totalDuration,
      enrollmentCount: track.enrollmentCount,
      isPublished: track.isPublished,
      createdAt: track.createdAt,
      courses: track.courses.map(tc => ({
        order: tc.order,
        id: tc.course.id,
        title: tc.course.title,
        description: tc.course.description,
        thumbnailUrl: tc.course.thumbnailUrl,
        createdAt: tc.course.createdAt,
        updatedAt: tc.course.updatedAt,
        instructor: tc.course.instructor,
        lessons: tc.course.lessons,
        metadata: {
          totalLessons: tc.course.lessons.length,
          estimatedDuration: `${tc.course.lessons.length * 15} minutes`
        }
      })),
      metadata: {
        totalCourses: track.courses.length,
        totalLessons: track.courses.reduce((sum, tc) => sum + tc.course.lessons.length, 0),
        estimatedDuration: `${Math.round(track.totalDuration / 60)} hours`,
        lastUpdated: track.updatedAt
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Error fetching track:', error);
    res.status(500).json({
      error: 'Internal server error while fetching track',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;