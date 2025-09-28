import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /courses/:id - Get a single course with its lessons and videos
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Validate course ID
    if (!id || id.trim() === '') {
      return res.status(400).json({
        error: 'Course ID is required'
      });
    }

    // Fetch course with instructor and lessons (including video details)
    const course = await prisma.course.findUnique({
      where: { id },
      include: {
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            learningTypeId: true,
            learningType: {
              select: {
                id: true,
                typeName: true,
                description: true
              }
            }
          }
        },
        lessons: {
          orderBy: { order: 'asc' }, // Ensure lessons are in the correct sequence
          include: {
            video: {
              include: {
                tags: {
                  include: {
                    learningType: {
                      select: {
                        id: true,
                        typeName: true
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

    // Handle course not found
    if (!course) {
      return res.status(404).json({
        error: 'Course not found',
        courseId: id
      });
    }

    // Transform the response to include lesson count and total duration estimate
    const response = {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnailUrl: course.thumbnailUrl,
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
      instructor: course.instructor,
      lessons: course.lessons.map(lesson => ({
        id: lesson.id,
        order: lesson.order,
        video: {
          id: lesson.video.id,
          title: lesson.video.title,
          description: lesson.video.description,
          transcript: lesson.video.transcript,
          createdAt: lesson.video.createdAt,
          tags: lesson.video.tags
        }
      })),
      metadata: {
        totalLessons: course.lessons.length,
        estimatedDuration: `${course.lessons.length * 15} minutes`, // Rough estimate
        lastUpdated: course.updatedAt
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Error fetching course:', error);
    res.status(500).json({
      error: 'Internal server error while fetching course',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// GET /courses - Get all courses with compatibility scores (Protected Route)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { page = 1, limit = 10, instructor } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const userLearningTypeId = req.user.learningTypeId; // Get user's learning type from JWT

    // Build where clause for filtering
    const where = {};
    if (instructor) {
      where.instructorId = parseInt(instructor);
    }

    // Fetch courses with all necessary data for compatibility calculation
    const [courses, totalCount] = await Promise.all([
      prisma.course.findMany({
        where,
        skip,
        take: parseInt(limit),
        include: {
          instructor: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          lessons: {
            select: {
              id: true,
              order: true,
              video: {
                include: {
                  tags: {
                    where: userLearningTypeId ? { learningTypeId: userLearningTypeId } : {},
                    select: {
                      score: true,
                      learningTypeId: true
                    }
                  }
                }
              }
            },
            orderBy: { order: 'asc' }
          }
        },
        orderBy: { createdAt: 'desc' }
      }),
      prisma.course.count({ where })
    ]);

    // Calculate compatibility scores and transform response
    const coursesWithScores = courses.map(course => {
      let compatibilityScore = 0;
      let totalTags = 0;

      // Calculate average compatibility score for the course
      if (userLearningTypeId) {
        course.lessons.forEach(lesson => {
          const matchingTags = lesson.video.tags.filter(tag => tag.learningTypeId === userLearningTypeId);
          matchingTags.forEach(tag => {
            compatibilityScore += tag.score;
            totalTags++;
          });
        });

        // Calculate average score (0-10 scale, convert to percentage)
        compatibilityScore = totalTags > 0 ? Math.round((compatibilityScore / totalTags) * 10) : 0;
      }

      return {
        id: course.id,
        title: course.title,
        description: course.description,
        thumbnailUrl: course.thumbnailUrl,
        createdAt: course.createdAt,
        updatedAt: course.updatedAt,
        instructor: course.instructor,
        compatibilityScore, // Add compatibility score to each course
        metadata: {
          totalLessons: course.lessons.length,
          estimatedDuration: `${course.lessons.length * 15} minutes`
        }
      };
    });

    // Sort courses by compatibility score in descending order
    coursesWithScores.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    const response = {
      courses: coursesWithScores,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        totalCourses: totalCount,
        hasNextPage: skip + parseInt(limit) < totalCount,
        hasPreviousPage: parseInt(page) > 1
      }
    };

    res.json(response);

  } catch (error) {
    console.error('Error fetching courses:', error);
    res.status(500).json({
      error: 'Internal server error while fetching courses',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

export default router;