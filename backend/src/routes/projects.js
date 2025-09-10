import { Router } from "express";
const router = Router();

// POST /projects -> create
router.post("/", async (req, res) => {
  res.status(201).json({ project: req.body, id: "demo" });
});

// GET /projects/:id -> project + milestones
router.get("/:id", async (req, res) => {
  res.json({ id: req.params.id, milestones: [] });
});

// PATCH /projects/:id -> update
router.patch("/:id", async (req, res) => {
  res.json({ id: req.params.id, ...req.body });
});

// DELETE /projects/:id
router.delete("/:id", async (req, res) => {
  res.status(204).end();
});

// POST /projects/:id/milestones -> add milestone
router.post("/:id/milestones", async (req, res) => {
  res.status(201).json({ projectId: req.params.id, milestone: req.body });
});

// POST /projects/:id/fee -> lock credits
router.post("/:id/fee", async (req, res) => {
  res.status(201).json({ projectId: req.params.id, amount: req.body?.amount ?? 0, status: "locked" });
});

export default router;