import { Router } from "express";
const router = Router();

// POST /reminders -> schedule reminder (stub)
router.post("/", async (req, res) => {
  res.status(201).json({ reminder: req.body, id: "demo" });
});

// GET /reminders/:user_id
router.get("/:user_id", async (req, res) => {
  res.json({ userId: req.params.user_id, reminders: [] });
});

export default router;