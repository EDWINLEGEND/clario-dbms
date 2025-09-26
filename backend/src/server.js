import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { config } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/user.js";
import videoRoutes from "./routes/videos.js";
import projectsRoutes from "./routes/projects.js";
import milestonesRoutes from "./routes/milestones.js";
import feesRoutes from "./routes/fees.js";
import remindersRoutes from "./routes/reminders.js";
import historyRoutes from "./routes/history.js";

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(
  cors({
    origin: (origin, cb) => {
      const { allowedOrigins } = config.cors;
      if (!origin || allowedOrigins.length === 0) return cb(null, true);
      if (allowedOrigins.includes(origin)) return cb(null, true);
      return cb(new Error("CORS not allowed"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
// Use combined format for production-ready logging
app.use(morgan("combined"));

app.get("/health", (req, res) => res.json({ ok: true }));

app.use("/auth", authRoutes);
app.use("/user", userRoutes);
app.use("/videos", videoRoutes);
app.use("/projects", projectsRoutes);
app.use("/milestones", milestonesRoutes);
app.use("/fees", feesRoutes);
app.use("/reminders", remindersRoutes);
app.use("/history", historyRoutes);

app.use((err, req, res, next) => {
  if (err?.message === "CORS not allowed") {
    return res.status(403).json({ error: "Origin not allowed" });
  }
  next(err);
});

app.use((req, res) => res.status(404).json({ error: "Not Found" }));

app.listen(config.port, () => {
  console.log(`API listening on http://localhost:${config.port}`);
});