import jwt from "jsonwebtoken";
import { config } from "../config/env.js";

export function signAccessToken(user) {
  const payload = { sub: user.id, email: user.email, lt: user.learningTypeId ?? null };
  return jwt.sign(payload, config.jwtSecret, { expiresIn: `${config.accessTokenTtlMin}m` });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.jwtSecret);
}

export function signRefreshToken(user) {
  const payload = { sub: user.id, typ: "refresh" };
  return jwt.sign(payload, config.refreshJwtSecret, { expiresIn: `${config.refreshTokenTtlDays}d` });
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, config.refreshJwtSecret);
}