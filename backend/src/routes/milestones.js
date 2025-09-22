import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Valid milestone status values from Prisma enum
const VALID_MILESTONE_STATUSES = ['PENDING', 'COMPLETED'];

// PATCH /milestones/:id - Update a Milestone's Status
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const milestoneId = parseInt(req.params.id);
    const { status } = req.body;
    const userId = req.user.id;

    // Validate milestone ID
    if (isNaN(milestoneId) || milestoneId <= 0) {
      return res.status(400).json({ 
        error: "Invalid milestone ID",
        details: "Milestone ID must be a positive integer"
      });
    }

    // Validate status is provided
    if (!status) {
      return res.status(400).json({ 
        error: "Status is required",
        details: "Please provide a valid status value"
      });
    }

    // Validate status value against enum
    if (!VALID_MILESTONE_STATUSES.includes(status)) {
      return res.status(400).json({ 
        error: "Invalid status value",
        details: `Status must be one of: ${VALID_MILESTONE_STATUSES.join(', ')}`,
        provided: status
      });
    }

    // Find the milestone and include its project to check ownership
    const milestone = await prisma.milestone.findUnique({
      where: { id: milestoneId },
      include: { project: true }
    });

    if (!milestone) {
      return res.status(404).json({ 
        error: "Milestone not found",
        details: `No milestone found with ID ${milestoneId}`
      });
    }

    // Authorization: Check if the authenticated user owns the project
    if (milestone.project.userId !== userId) {
      return res.status(403).json({ 
        error: "Forbidden: You can only update milestones for your own projects",
        details: "Access denied to this milestone"
      });
    }

    // Check if status is actually changing
    if (milestone.status === status) {
      return res.status(200).json({
        message: "Milestone status unchanged",
        milestone: milestone
      });
    }

    // Update the milestone status
    const updatedMilestone = await prisma.milestone.update({
      where: { id: milestoneId },
      data: { status },
      include: { 
        project: {
          select: {
            id: true,
            title: true,
            userId: true
          }
        }
      }
    });

    res.status(200).json({
      message: "Milestone status updated successfully",
      milestone: updatedMilestone
    });
  } catch (error) {
    console.error("Error updating milestone:", error);
    
    // Handle Prisma-specific errors
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: "Conflict: Duplicate constraint violation",
        details: error.message
      });
    }
    
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        error: "Milestone not found",
        details: "The milestone may have been deleted"
      });
    }

    res.status(500).json({ 
      error: "Failed to update milestone",
      details: "An internal server error occurred"
    });
  }
});

export default router;