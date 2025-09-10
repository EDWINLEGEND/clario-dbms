import dotenv from "dotenv";
dotenv.config();

const isProd = process.env.NODE_ENV === "production";

function parseList(val) {
  return (val || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

const allowedRedirects = parseList(process.env.OAUTH_ALLOWED_REDIRECTS);
const allowedOrigins = parseList(process.env.CORS_ALLOWED_ORIGINS || process.env.FRONTEND_URL);

export const config = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 4000,
  jwtSecret: process.env.JWT_SECRET || "change-me",
  accessTokenTtlMin: parseInt(process.env.ACCESS_TOKEN_TTL_MIN || "15", 10),
  refreshTokenTtlDays: parseInt(process.env.REFRESH_TOKEN_TTL_DAYS || "7", 10),
  databaseUrl: process.env.DATABASE_URL || "",
  youtubeApiKey: process.env.YOUTUBE_API_KEY || "",
  googleClientId: process.env.GOOGLE_CLIENT_ID || "",
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || "",
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || "",
  twilioFrom: process.env.TWILIO_FROM || "",
  whatsappFrom: process.env.WHATSAPP_TWILIO_FROM || "",
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY || "",
  smtpHost: process.env.SMTP_HOST || "localhost",
  smtpPort: parseInt(process.env.SMTP_PORT || "1025", 10),
  smtpUser: process.env.SMTP_USER || "",
  smtpPass: process.env.SMTP_PASS || "",
  n8nWebhookUrl: process.env.N8N_WEBHOOK_URL || "",
  cookie: {
    secure: isProd, // set true in production (HTTPS)
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    domain: process.env.COOKIE_DOMAIN || undefined
  },
  oauth: {
    allowedRedirects
  },
  cors: {
    allowedOrigins
  },
  refreshJwtSecret: process.env.REFRESH_JWT_SECRET || process.env.JWT_SECRET,
};