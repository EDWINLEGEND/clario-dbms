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

export default router;