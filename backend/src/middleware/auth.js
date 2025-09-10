import { verifyAccessToken } from "../services/jwt.js";

export function requireAuth(req, res, next) {
  try {
    const auth = req.headers["authorization"] || "";
    const parts = auth.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = verifyAccessToken(parts[1]);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}