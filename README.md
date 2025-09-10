# Clario (MVP Scaffold)

This repository contains the initial project structure for Clario based on the MVP PRD.

## Structure

- `backend/` — Node.js Express API with stubbed routes matching the PRD
  - `src/routes/` — Auth, User, Videos, Projects, Milestones, Fees, Reminders
  - `src/config/` — Environment configuration
  - `prisma/` — Prisma schema mapping the PRD database
- `infra/` — Docker Compose for Postgres, n8n, and MailHog (dev email)
- `.env.example` — Example environment variables to copy into `.env`

## Prerequisites

- Node.js 18+
- Docker Desktop (for Postgres/n8n/Mailhog)

## Quick Start

1. Copy env file

```bash
cp .env.example .env
```

2. Start infrastructure (Postgres, n8n, Mailhog)

```bash
cd infra
docker compose up -d
cd ..
```

3. Install backend dependencies

```bash
cd backend
npm install
```

4. Generate Prisma client and create initial schema

```bash
npm run prisma:generate
npm run prisma:migrate
```

5. Start API server

```bash
npm run dev
```

- API: http://localhost:4000/health
- n8n: http://localhost:5678/ (user/pass: admin/admin)
- MailHog: http://localhost:8025/

## Stubbed API (per PRD)

- `POST /auth/google` → returns JWT + user profile (stub)
- `GET /user/:id` → profile + learning type + stats
- `GET /videos?search=query` → list with compatibility scores
- `GET /videos/:id` → details + transcript + tags
- `POST /projects` → create
- `GET /projects/:id` → project + milestones
- `PATCH /projects/:id` → update
- `DELETE /projects/:id` → delete
- `POST /projects/:id/milestones` → add milestone
- `PATCH /milestones/:id` → update status
- `POST /projects/:id/fee` → lock credits
- `PATCH /fees/:id` → update fee status
- `POST /reminders` → schedule reminder
- `GET /reminders/:user_id` → list reminders for user

## Notes

- Prisma models align with the PRD entities in 3NF.
- n8n is intended to orchestrate reminder workflows; MailHog captures dev emails.
- Twilio/WhatsApp and ElevenLabs integrations are not wired yet; environment keys are stubbed.

## Next Steps

- Implement Google OAuth and JWT issuance.
- Implement YouTube search + compatibility scoring formula.
- CRUD implementations for Projects/Milestones with progress calculation.
- Reminder flows using n8n webhooks and fallbacks.
- Basic auth middleware and rate limiting.