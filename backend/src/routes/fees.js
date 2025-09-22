import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();
const prisma = new PrismaClient();

// Valid fee status values from Prisma enum
const VALID_FEE_STATUSES = ['LOCKED', 'REFUNDED', 'FORFEITED'];

// PATCH /fees/:id - Update a Fee's Status
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const feeId = parseInt(req.params.id);
    const { status } = req.body;
    const userId = req.user.id;

    // Validate fee ID
    if (isNaN(feeId) || feeId <= 0) {
      return res.status(400).json({ 
        error: "Invalid fee ID",
        details: "Fee ID must be a positive integer"
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
    if (!VALID_FEE_STATUSES.includes(status)) {
      return res.status(400).json({ 
        error: "Invalid status value",
        details: `Status must be one of: ${VALID_FEE_STATUSES.join(', ')}`,
        provided: status
      });
    }

    // Find the fee and include its project to check ownership
    const fee = await prisma.accountabilityFee.findUnique({
      where: { id: feeId },
      include: { 
        project: {
          select: {
            id: true,
            title: true,
            userId: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!fee) {
      return res.status(404).json({ 
        error: "Accountability fee not found",
        details: `No fee found with ID ${feeId}`
      });
    }

    // Authorization: Check if the authenticated user owns the project
    if (fee.project.userId !== userId) {
      return res.status(403).json({ 
        error: "Forbidden: You can only update fees for your own projects",
        details: "Access denied to this accountability fee"
      });
    }

    // Check if status is actually changing
    if (fee.status === status) {
      return res.status(200).json({
        message: "Fee status unchanged",
        fee: fee
      });
    }

    // Business logic validation for status transitions
    const currentStatus = fee.status;
    
    // Prevent invalid status transitions
    if (currentStatus === 'REFUNDED' && status === 'FORFEITED') {
      return res.status(400).json({
        error: "Invalid status transition",
        details: "Cannot change status from REFUNDED to FORFEITED",
        currentStatus,
        requestedStatus: status
      });
    }

    if (currentStatus === 'FORFEITED' && status === 'REFUNDED') {
      return res.status(400).json({
        error: "Invalid status transition",
        details: "Cannot change status from FORFEITED to REFUNDED",
        currentStatus,
        requestedStatus: status
      });
    }

    // Update the fee status
    const updatedFee = await prisma.accountabilityFee.update({
      where: { id: feeId },
      data: { status },
      include: { 
        project: {
          select: {
            id: true,
            title: true,
            userId: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(200).json({
      message: "Fee status updated successfully",
      fee: updatedFee,
      statusChange: {
        from: currentStatus,
        to: status
      }
    });
  } catch (error) {
    console.error("Error updating accountability fee:", error);
    
    // Handle Prisma-specific errors
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: "Conflict: Duplicate constraint violation",
        details: error.message
      });
    }
    
    if (error.code === 'P2025') {
      return res.status(404).json({ 
        error: "Accountability fee not found",
        details: "The fee may have been deleted"
      });
    }

    // Handle database connection errors
    if (error.code === 'P1001') {
      return res.status(503).json({ 
        error: "Database connection error",
        details: "Unable to connect to the database"
      });
    }

    res.status(500).json({ 
      error: "Failed to update accountability fee",
      details: "An internal server error occurred"
    });
  }
});

export default router;