import { Router } from "express";
import { prisma } from "../config/prisma.js";
import { exchangeCodeForProfile } from "../services/google.js";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../services/jwt.js";
import { config } from "../config/env.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

function setRefreshCookie(res, token) {
  const maxAgeMs = config.refreshTokenTtlDays * 24 * 60 * 60 * 1000;
  res.cookie("rt", token, { ...config.cookie, maxAge: maxAgeMs });
}

function isRedirectAllowed(uri) {
  const list = config.oauth.allowedRedirects;
  
  // Special case for 'postmessage' used in popup-based auth-code flow
  if (uri === 'postmessage') {
    return list.includes('postmessage');
  }
  
  return list.some((allowed) => {
    try {
      const a = new URL(allowed);
      const u = new URL(uri);
      return a.origin === u.origin && u.pathname.startsWith(a.pathname);
    } catch {
      return false;
    }
  });
}

// POST /auth/google -> { code, redirectUri, codeVerifier? }
router.post("/google", async (req, res) => {
  try {
    const { code, redirectUri, codeVerifier } = req.body || {};
    if (!code || !redirectUri) {
      return res.status(400).json({ error: "Missing code or redirectUri" });
    }
    if (!isRedirectAllowed(redirectUri)) {
      return res.status(400).json({ error: "Unapproved redirectUri" });
    }

    const profile = await exchangeCodeForProfile({ code, redirectUri, codeVerifier });
    if (!profile?.email) {
      return res.status(400).json({ error: "Google account has no email" });
    }

    const user = await prisma.user.upsert({
      where: { email: profile.email },
      update: { name: profile.name ?? undefined },
      create: { email: profile.email, name: profile.name ?? null },
    });

    const accessToken = signAccessToken(user);
    const refreshToken = signRefreshToken(user);
    setRefreshCookie(res, refreshToken);

    return res.json({
      accessToken,
      user: { id: user.id, email: user.email, name: user.name, learningTypeId: user.learningTypeId ?? null },
    });
  } catch (err) {
    console.error("/auth/google error", err?.message);
    return res.status(401).json({ error: "Authentication failed" });
  }
});

// POST /auth/refresh -> issues new access token and rotates refresh token
router.post("/refresh", async (req, res) => {
  try {
    const refreshJwt = req.cookies?.rt;
    if (!refreshJwt) return res.status(401).json({ error: "Missing refresh token" });

    const decoded = verifyRefreshToken(refreshJwt);
    if (!decoded || decoded.typ !== "refresh" || !decoded.sub) {
      return res.status(401).json({ error: "Invalid refresh token" });
    }

    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) return res.status(401).json({ error: "User not found" });

    // rotate refresh token (stateless)
    const newRefresh = signRefreshToken(user);
    setRefreshCookie(res, newRefresh);

    const accessToken = signAccessToken(user);
    return res.json({ accessToken });
  } catch (err) {
    console.error("/auth/refresh error", err?.message);
    return res.status(401).json({ error: "Could not refresh token" });
  }
});

// POST /auth/logout -> clear refresh cookie
router.post("/logout", async (req, res) => {
  try {
    res.clearCookie("rt", { path: "/" });
    return res.status(204).end();
  } catch (err) {
    return res.status(204).end();
  }
});

// GET /auth/me -> validates access token and returns user profile
router.get("/me", requireAuth, async (req, res) => {
  const userId = req.user?.sub;
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return res.status(404).json({ error: "User not found" });
  return res.json({ id: user.id, email: user.email, name: user.name, learningTypeId: user.learningTypeId ?? null });
});

export default router;