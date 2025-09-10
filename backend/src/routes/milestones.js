import { Router } from "express";
const router = Router();

// PATCH /milestones/:id (update status)
router.patch("/:id", async (req, res) => {
  res.json({ id: req.params.id, ...req.body });
});

export default router;