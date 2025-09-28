import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// POST /projects -> create a new project
router.post("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub;
    const { title, description, deadline } = req.body;

    // Validate required fields
    if (!title) {
      return res.status(400).json({ error: "Title is required" });
    }

    // Create new project
    const project = await prisma.project.create({
      data: {
        title,
        description: description || null,
        deadline: deadline ? new Date(deadline) : null,
        userId,
      },
      include: {
        milestones: true,
      },
    });

    res.status(201).json(project);
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ error: "Failed to create project" });
  }
});

// GET /projects -> get all user's projects
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub;

    const projects = await prisma.project.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
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
    });

    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: "Failed to fetch projects" });
  }
});

// GET /projects/:id -> get single project with authorization
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    const userId = req.user.sub;

    if (!projectId || isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Authorization check: ensure user owns the project
    if (project.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You can only access your own projects" });
    }

    res.json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: "Failed to fetch project" });
  }
});

// PATCH /projects/:id -> update project with authorization
router.patch("/:id", requireAuth, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    const userId = req.user.sub;
    const { title, description, deadline } = req.body;

    if (!projectId || isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    // First, check if project exists and user owns it
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Authorization check: ensure user owns the project
    if (existingProject.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You can only update your own projects" });
    }

    // Prepare update data (only include fields that are provided)
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;

    // Update the project
    const updatedProject = await prisma.project.update({
      where: { id: projectId },
      data: updateData,
    });

    res.json(updatedProject);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: "Failed to update project" });
  }
});

// DELETE /projects/:id -> delete project with authorization
router.delete("/:id", requireAuth, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    const userId = req.user.sub;

    if (!projectId || isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    // First, check if project exists and user owns it
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Authorization check: ensure user owns the project
    if (existingProject.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You can only delete your own projects" });
    }

    // Delete the project (cascade will handle related records)
    await prisma.project.delete({
      where: { id: projectId },
    });

    res.status(204).end();
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ error: "Failed to delete project" });
  }
});

// POST /projects/:id/milestones -> add milestone
router.post("/:id/milestones", requireAuth, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    const userId = req.user.sub;
    const { title, description, deadline } = req.body;

    if (!projectId || isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    if (!title) {
      return res.status(400).json({ error: "Milestone title is required" });
    }

    // First, check if project exists and user owns it
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Authorization check: ensure user owns the project
    if (existingProject.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You can only add milestones to your own projects" });
    }

    // Create the milestone
    const milestone = await prisma.milestone.create({
      data: {
        title,
        description: description || null,
        deadline: deadline ? new Date(deadline) : null,
        projectId,
      },
    });

    res.status(201).json(milestone);
  } catch (error) {
    console.error("Error creating milestone:", error);
    res.status(500).json({ error: "Failed to create milestone" });
  }
});

// POST /projects/:id/fee -> lock credits
router.post("/:id/fee", requireAuth, async (req, res) => {
  try {
    const projectId = parseInt(req.params.id, 10);
    const userId = req.user.sub;
    const { amount } = req.body;

    if (!projectId || isNaN(projectId)) {
      return res.status(400).json({ error: "Invalid project ID" });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Valid amount is required" });
    }

    // First, check if project exists and user owns it
    const existingProject = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!existingProject) {
      return res.status(404).json({ error: "Project not found" });
    }

    // Authorization check: ensure user owns the project
    if (existingProject.userId !== userId) {
      return res.status(403).json({ error: "Forbidden: You can only lock fees for your own projects" });
    }

    // Create the accountability fee
    const fee = await prisma.accountabilityFee.create({
      data: {
        amount,
        status: 'LOCKED',
        projectId,
        userId,
      },
    });

    res.status(201).json(fee);
  } catch (error) {
    console.error("Error creating accountability fee:", error);
    res.status(500).json({ error: "Failed to create accountability fee" });
  }
});

export default router;