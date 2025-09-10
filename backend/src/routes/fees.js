import { Router } from "express";
const router = Router();

// PATCH /fees/:id -> update fee status
router.patch("/:id", async (req, res) => {
  res.json({ id: req.params.id, status: req.body?.status ?? "refunded" });
});

export default router;