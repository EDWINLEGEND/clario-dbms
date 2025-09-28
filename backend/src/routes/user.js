import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /user/:id -> profile + learning type + stats (requires auth)
router.get("/:id", requireAuth, async (req, res) => {
  const requestedId = parseInt(req.params.id, 10);
  if (!requestedId || req.user?.sub !== requestedId) {
    return res.status(403).json({ error: "Forbidden" });
  }
  const user = await prisma.user.findUnique({
    where: { id: requestedId },
    include: { learningType: true, projects: { include: { milestones: true } }, reminders: true }
  });
  if (!user) return res.status(404).json({ error: "User not found" });

  const projectsCount = user.projects.length;
  const milestonesCount = user.projects.reduce((acc, p) => acc + p.milestones.length, 0);

  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    learningType: user.learningType ? { id: user.learningType.id, typeName: user.learningType.typeName } : null,
    stats: { projects: projectsCount, milestones: milestonesCount },
  });
});

// PATCH /user/learning-style -> update user's learning style (requires auth)
router.patch("/learning-style", requireAuth, async (req, res) => {
  try {
    const userId = req.user.sub;
    const { learningTypeId } = req.body;

    // Validate learning type ID
    if (!learningTypeId || typeof learningTypeId !== 'number') {
      return res.status(400).json({ error: "Valid learningTypeId is required" });
    }

    // Check if learning type exists
    const learningType = await prisma.learningType.findUnique({
      where: { id: learningTypeId }
    });

    if (!learningType) {
      return res.status(400).json({ error: "Invalid learning type" });
    }

    // Update user's learning type
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { learningTypeId },
      include: { learningType: true }
    });

    res.json({
      id: updatedUser.id,
      learningType: {
        id: updatedUser.learningType.id,
        typeName: updatedUser.learningType.typeName
      }
    });

  } catch (error) {
    console.error("Error updating learning style:", error);
    res.status(500).json({ error: "Failed to update learning style" });
  }
});

export default router;