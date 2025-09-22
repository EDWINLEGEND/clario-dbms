import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.js';
import { requireApiKey } from '../middleware/apiKey.js';

const router = express.Router();
const prisma = new PrismaClient();

// Valid reminder status values from Prisma enum
const VALID_REMINDER_STATUSES = ['SCHEDULED', 'SENT', 'FAILED'];

// Valid channel values (common notification channels)
const VALID_CHANNELS = ['email', 'whatsapp', 'sms', 'push'];

// POST /reminders - Create a Reminder
router.post('/', requireAuth, async (req, res) => {
  try {
    const { milestoneId, channel, sendDate } = req.body;
    const userId = req.user.id;

    // Validate required fields
    if (!milestoneId) {
      return res.status(400).json({ 
        error: "Milestone ID is required",
        details: "Please provide a valid milestone ID"
      });
    }

    if (!channel) {
      return res.status(400).json({ 
        error: "Channel is required",
        details: "Please specify a notification channel (e.g., email, whatsapp)"
      });
    }

    if (!sendDate) {
      return res.status(400).json({ 
        error: "Send date is required",
        details: "Please provide a valid send date for the reminder"
      });
    }

    // Validate milestone ID is a positive integer
    const parsedMilestoneId = parseInt(milestoneId);
    if (isNaN(parsedMilestoneId) || parsedMilestoneId <= 0) {
      return res.status(400).json({ 
        error: "Invalid milestone ID",
        details: "Milestone ID must be a positive integer"
      });
    }

    // Validate channel value
    if (!VALID_CHANNELS.includes(channel.toLowerCase())) {
      return res.status(400).json({ 
        error: "Invalid channel",
        details: `Channel must be one of: ${VALID_CHANNELS.join(', ')}`,
        provided: channel
      });
    }

    // Validate send date format
    const parsedSendDate = new Date(sendDate);
    if (isNaN(parsedSendDate.getTime())) {
      return res.status(400).json({ 
        error: "Invalid send date",
        details: "Send date must be a valid ISO 8601 date string"
      });
    }

    // Check if send date is in the future
    if (parsedSendDate <= new Date()) {
      return res.status(400).json({ 
        error: "Invalid send date",
        details: "Send date must be in the future"
      });
    }

    // Find the milestone and include its project to check ownership
    const milestone = await prisma.milestone.findUnique({
      where: { id: parsedMilestoneId },
      include: { project: true }
    });

    if (!milestone) {
      return res.status(404).json({ 
        error: "Milestone not found",
        details: `No milestone found with ID ${parsedMilestoneId}`
      });
    }

    // Authorization: Check if the authenticated user owns the project
    if (milestone.project.userId !== userId) {
      return res.status(403).json({ 
        error: "Forbidden: You can only create reminders for your own projects",
        details: "Access denied to this milestone"
      });
    }

    // Create the reminder
    const newReminder = await prisma.reminder.create({
      data: {
        userId,
        milestoneId: parsedMilestoneId,
        channel: channel.toLowerCase(),
        sendDate: parsedSendDate,
        status: 'SCHEDULED' // Default status
      },
      include: {
        milestone: {
          select: {
            id: true,
            title: true,
            dueDate: true,
            project: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    });

    res.status(201).json({
      message: "Reminder created successfully",
      reminder: newReminder
    });
  } catch (error) {
    console.error("Error creating reminder:", error);
    
    // Handle Prisma-specific errors
    if (error.code === 'P2002') {
      return res.status(409).json({ 
        error: "Conflict: Duplicate constraint violation",
        details: error.message
      });
    }
    
    if (error.code === 'P2003') {
      return res.status(400).json({ 
        error: "Invalid foreign key reference",
        details: "The specified milestone does not exist"
      });
    }

    if (error.code === 'P2025') {
      return res.status(404).json({ 
        error: "Resource not found",
        details: "The specified milestone may have been deleted"
      });
    }

    res.status(500).json({ 
      error: "Failed to create reminder",
      details: "An internal server error occurred"
    });
  }
});

// GET /reminders - Get All of the User's Reminders
router.get('/', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id;

    // Optional query parameters for filtering
    const { status, channel, limit, offset } = req.query;

    // Build the where clause
    const whereClause = { userId };

    if (status && VALID_REMINDER_STATUSES.includes(status.toUpperCase())) {
      whereClause.status = status.toUpperCase();
    }

    if (channel && VALID_CHANNELS.includes(channel.toLowerCase())) {
      whereClause.channel = channel.toLowerCase();
    }

    // Parse pagination parameters
    const parsedLimit = limit ? parseInt(limit) : undefined;
    const parsedOffset = offset ? parseInt(offset) : undefined;

    // Validate pagination parameters
    if (parsedLimit && (isNaN(parsedLimit) || parsedLimit <= 0 || parsedLimit > 100)) {
      return res.status(400).json({ 
        error: "Invalid limit parameter",
        details: "Limit must be a positive integer between 1 and 100"
      });
    }

    if (parsedOffset && (isNaN(parsedOffset) || parsedOffset < 0)) {
      return res.status(400).json({ 
        error: "Invalid offset parameter",
        details: "Offset must be a non-negative integer"
      });
    }

    // Retrieve user's reminders
    const reminders = await prisma.reminder.findMany({
      where: whereClause,
      include: {
        milestone: {
          select: {
            id: true,
            title: true,
            dueDate: true,
            status: true,
            project: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      },
      orderBy: [
        { sendDate: 'asc' },
        { createdAt: 'desc' }
      ],
      take: parsedLimit,
      skip: parsedOffset
    });

    // Get total count for pagination metadata
    const totalCount = await prisma.reminder.count({
      where: whereClause
    });

    res.status(200).json({
      message: "Reminders retrieved successfully",
      reminders,
      pagination: {
        total: totalCount,
        count: reminders.length,
        limit: parsedLimit || null,
        offset: parsedOffset || 0
      }
    });
  } catch (error) {
    console.error("Error retrieving reminders:", error);
    
    res.status(500).json({ 
      error: "Failed to retrieve reminders",
      details: "An internal server error occurred"
    });
  }
});

// POST /reminders/dispatch - Dispatch Due Reminders (Protected by API Key)
router.post('/dispatch', requireApiKey, async (req, res) => {
  try {
    console.log('🚀 Starting reminder dispatch process...');
    
    // Find all reminders that are scheduled and due (sendDate in the past)
    const dueReminders = await prisma.reminder.findMany({
      where: {
        status: 'SCHEDULED',
        sendDate: {
          lte: new Date() // Less than or equal to current time
        }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        milestone: {
          select: {
            id: true,
            title: true,
            dueDate: true,
            project: {
              select: {
                id: true,
                title: true
              }
            }
          }
        }
      }
    });

    console.log(`📋 Found ${dueReminders.length} due reminders to process`);

    if (dueReminders.length === 0) {
      return res.status(200).json({
        message: 'No due reminders found',
        processed: 0,
        successful: 0,
        failed: 0
      });
    }

    // Get n8n webhook URL from environment
    const webhookUrl = process.env.N8N_WEBHOOK_URL;
    if (!webhookUrl) {
      console.error('❌ N8N_WEBHOOK_URL environment variable is not configured');
      return res.status(500).json({
        error: 'Server Configuration Error',
        message: 'Webhook URL is not configured'
      });
    }

    let successCount = 0;
    let failCount = 0;

    // Process each due reminder
    for (const reminder of dueReminders) {
      try {
        console.log(`📤 Processing reminder ${reminder.id} for user ${reminder.user.email}`);

        // Prepare webhook payload
        const webhookPayload = {
          reminderId: reminder.id,
          userId: reminder.userId,
          channel: reminder.channel,
          user: {
            id: reminder.user.id,
            name: reminder.user.name,
            email: reminder.user.email
          },
          milestone: reminder.milestone ? {
            id: reminder.milestone.id,
            title: reminder.milestone.title,
            dueDate: reminder.milestone.dueDate,
            project: reminder.milestone.project
          } : null,
          message: reminder.milestone 
            ? `Reminder: Your milestone "${reminder.milestone.title}" in project "${reminder.milestone.project.title}" is due.`
            : 'You have a scheduled reminder.',
          sendDate: reminder.sendDate,
          timestamp: new Date().toISOString()
        };

        // Make HTTP request to n8n webhook
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'Clario-Reminder-Dispatcher/1.0'
          },
          body: JSON.stringify(webhookPayload)
        });

        if (response.ok) {
          // Update reminder status to SENT
          await prisma.reminder.update({
            where: { id: reminder.id },
            data: { status: 'SENT' }
          });
          
          console.log(`✅ Successfully dispatched reminder ${reminder.id}`);
          successCount++;
        } else {
          throw new Error(`Webhook returned status ${response.status}: ${response.statusText}`);
        }

      } catch (webhookError) {
        console.error(`❌ Failed to dispatch reminder ${reminder.id}:`, webhookError.message);
        
        // Update reminder status to FAILED
        try {
          await prisma.reminder.update({
            where: { id: reminder.id },
            data: { status: 'FAILED' }
          });
        } catch (updateError) {
          console.error(`❌ Failed to update reminder ${reminder.id} status:`, updateError);
        }
        
        failCount++;
      }
    }

    console.log(`📊 Dispatch complete: ${successCount} successful, ${failCount} failed`);

    res.status(200).json({
      message: 'Reminder dispatch completed',
      processed: dueReminders.length,
      successful: successCount,
      failed: failCount,
      details: {
        webhookUrl: webhookUrl,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error in reminder dispatch:', error);
    
    res.status(500).json({
      error: 'Failed to dispatch reminders',
      message: 'An internal server error occurred during reminder dispatch',
      details: error.message
    });
  }
});

export default router;