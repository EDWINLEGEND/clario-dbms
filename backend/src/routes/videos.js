import { Router } from "express";
const router = Router();

// GET /videos?search=query -> list of YouTube videos + compatibility scores (stub)
router.get("/", async (req, res) => {
  const query = req.query.search || "";
  res.json({ query, items: [], metrics: { fetched: 0 } });
});

// GET /videos/:id -> details + transcript + tags (stub)
router.get("/:id", async (req, res) => {
  res.json({ id: req.params.id, transcript: null, tags: [] });
});

export default router;