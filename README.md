# ODR India – Online Dispute Resolution Innovation Platform

**Connect, Collaborate, and Create innovative ODR systems — Shaping access to Justice**

## Overview

ODR India is a full-stack web platform for co-creating Online Dispute Resolution (ODR) systems. It brings together students, legal professionals, technologists, and industry mentors to ideate, discuss, and develop innovative solutions for accessible, efficient, and fair dispute resolution.

## Features

- **Idea Board & ODR Labs:** Submit, discuss, and collaborate on new ODR ideas and technologies.
- **Mentor & Ideator Registration:** Join as a mentor or ideator to contribute or seek guidance.
- **Chatbot Legal Assistant:** Get instant answers to legal and ODR-related queries.
- **Discussion Forums:** Engage in detailed discussions on submitted ideas.
- **Virtual Meeting Integration:** Conduct real-time meetings with Jitsi Meet integration for seamless collaboration.
- **Collaborative Note-Taking:** Take and share notes during meetings to document discussions and decisions.
- **File Attachments:** Share research, proposals, and supporting documents.
- **Multilingual & Inclusive:** Designed to support diverse users and cross-border collaboration.
- **Secure Authentication:** User registration and login with role-based access.
- **Modern UI:** Built with Next.js, Tailwind CSS, and Radix UI for a responsive, accessible experience.

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS, Radix UI
- **Backend:** Next.js API routes, Prisma ORM, PostgreSQL
- **Authentication:** Custom (with Prisma)
- **Chatbot:** Integrated with Gradio/LLM backend
- **File Storage:** Local (with Prisma references)
- **Other:** TypeScript, ESLint, Zod validation

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- PostgreSQL database
- [Bun](https://bun.sh/) (if using bun for package management)

### Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd odrindia
   ```

2. **Install dependencies:**
   ```bash
   bun install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and set your `DATABASE_URL` for PostgreSQL.

4. **Run database migrations:**
   ```bash
   npx prisma db push
   ```

5. **Start the development server:**
   ```bash
   bun run dev
   ```

6. **Open in browser:**  
   Visit [http://localhost:3000](http://localhost:3000)

## Project Structure

- `src/app/` – Next.js app directory (pages, API routes, components)
- `src/components/` – Reusable UI components
- `prisma/` – Prisma schema and migrations
- `public/` – Static assets (images, logos)
- `tailwind.config.ts` – Tailwind CSS configuration

## Video Conferencing Integration

This project integrates Jitsi Meet for video conferencing to enable collaborative meetings for each idea workspace. Each idea has a dedicated meeting room where participants can discuss, share screens, and collaborate in real-time.

### Jitsi Meet Setup

1. The integration uses `@jitsi/react-sdk` to embed Jitsi Meet into the application
2. Install with: `npm install @jitsi/react-sdk`
3. Each idea has a unique room based on its ID (`odrindia-idea-{ideaId}`)

### Workplace Features

The workspace for each idea includes:
- Video conferencing (Jitsi Meet)
- Shared note-taking
- Calendar for scheduling events
- Todo list for tracking tasks

### Database Migration

To add the required database fields for the workplace functionality:

1. The schema needs a `workplaceData` JSONB field in the `Idea` table
2. Apply this using the migration file at: `/prisma/migrations/20250525120000_add_workplace_data/migration.sql`
3. Run migration: `npx prisma migrate resolve --applied 20250525120000_add_workplace_data`
4. If manual migration is needed, run this SQL directly on your database:
   ```sql
   ALTER TABLE "Idea" ADD COLUMN IF NOT EXISTS "workplaceData" JSONB;
   ```

The `workplaceData` field stores:
- Meeting configuration
- Shared notes
- Calendar events
- Todo items

## Documentation

- [Database Troubleshooting Guide](./docs/DATABASE_TROUBLESHOOTING.md) - Solutions for common database issues
- [Meeting Logs Guide](./docs/MEETING_LOGS.md) - How to use the meeting logs functionality
- [Production Deployment Guide](./docs/PRODUCTION_DEPLOYMENT.md) - Instructions for deploying to production
- [Jitsi Integration Guide](./docs/JITSI_INTEGRATION.md) - Details on the Jitsi Meet integration
- [Authentication Testing](./docs/AUTHENTICATION_TESTING.md) - Guide for testing the authentication flow

## Contributing

We welcome contributions from legal professionals, technologists, students, and anyone passionate about ODR.  
- Submit your ideas via the "Submit Idea" page.
- Join discussions in ODR Labs.
- Reach out via the Contact page for collaboration.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](./LICENSE) file for details.
