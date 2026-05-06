# PRD — Event To-Do App

## Overview

A lightweight personal event management app for 2–3 users (no login required).
Users can create events with details and manage tasks inside each event.
Data is synced across all users in real time via a cloud database.

---

## Tech Stack

| Layer          | Choice                          | Why                                      |
| -------------- | ------------------------------- | ---------------------------------------- |
| Framework      | Next.js 14 (App Router)         | Full-stack, API routes built-in          |
| Language       | TypeScript                      | Type safety                              |
| Styling        | Tailwind CSS + shadcn/ui        | Fast, clean, component-ready             |
| Database       | Turso (SQLite, free tier)       | Free, serverless, syncs across users     |
| ORM            | Drizzle ORM                     | Lightweight, works perfectly with Turso  |
| Deployment     | Vercel (free tier)              | Free hosting, zero-config Next.js deploy |
| Date/Time UI   | react-day-picker + input[time]  | Lightweight pickers                      |
| State          | React useState / Server Actions | Simple, no extra lib needed              |

---

## Free Infrastructure Setup (Do This First)

### 1. Turso Database (Free — 500 DBs, 9GB storage, 1B row reads/month)

```bash
# Install Turso CLI
curl -sSfL https://get.tur.so/install.sh | bash

# Login
turso auth login

# Create database
turso db create event-todo-app

# Get connection URL and auth token
turso db show event-todo-app --url
turso db tokens create event-todo-app
```

Save these two values — you'll need them as environment variables:
```
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your-token-here
```

### 2. Vercel Deployment (Free)

- Push your project to GitHub
- Go to https://vercel.com → Import project → Connect GitHub repo
- Add the two environment variables above in Vercel project settings
- Deploy — done. Every `git push` auto-deploys.

---

## Project Structure

```
/
├── app/
│   ├── page.tsx                    # Home — Event list dashboard
│   ├── layout.tsx                  # Root layout with font + global styles
│   ├── globals.css                 # Tailwind base styles
│   ├── events/
│   │   ├── new/
│   │   │   └── page.tsx            # Create new event form page
│   │   └── [id]/
│   │       └── page.tsx            # Event detail page with tasks
│   └── api/
│       ├── events/
│       │   ├── route.ts            # GET all events, POST new event
│       │   └── [id]/
│       │       └── route.ts        # GET one, PUT update, DELETE event
│       └── tasks/
│           └── [eventId]/
│               ├── route.ts        # GET tasks, POST new task
│               └── [taskId]/
│                   └── route.ts    # PUT toggle/edit task, DELETE task
│
├── components/
│   ├── EventCard.tsx               # Card shown on dashboard
│   ├── EventForm.tsx               # Create/Edit event form
│   ├── EventDetail.tsx             # Full event info display
│   ├── TaskList.tsx                # List of tasks inside event
│   ├── TaskItem.tsx                # Single task row (checkbox, title, delete)
│   └── AddTaskForm.tsx             # Inline form to add a task
│
├── lib/
│   ├── db.ts                       # Turso client setup
│   └── schema.ts                   # Drizzle ORM schema (tables)
│
├── drizzle/
│   └── migrations/                 # Auto-generated SQL migrations
│
├── .env.local                      # Local env vars (never commit this)
├── drizzle.config.ts               # Drizzle config
├── package.json
└── README.md
```

---

## Database Schema

```typescript
// lib/schema.ts

import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";

export const events = sqliteTable("events", {
  id:        text("id").primaryKey(),           // UUID
  name:      text("name").notNull(),            // Event name
  date:      text("date").notNull(),            // "YYYY-MM-DD"
  time:      text("time").notNull(),            // "HH:MM"
  location:  text("location").notNull(),        // Free text
  notes:     text("notes"),                     // Optional "on event" notes
  createdAt: text("created_at").notNull(),      // ISO timestamp
});

export const tasks = sqliteTable("tasks", {
  id:        text("id").primaryKey(),           // UUID
  eventId:   text("event_id").notNull(),        // FK → events.id
  title:     text("title").notNull(),           // Task description
  done:      integer("done", { mode: "boolean" }).default(false),
  createdAt: text("created_at").notNull(),      // ISO timestamp
});
```

---

## Data Models (TypeScript Types)

```typescript
type Event = {
  id: string;
  name: string;
  date: string;       // "YYYY-MM-DD"
  time: string;       // "HH:MM"
  location: string;
  notes?: string;
  createdAt: string;
};

type Task = {
  id: string;
  eventId: string;
  title: string;
  done: boolean;
  createdAt: string;
};
```

---

## API Routes

### Events

| Method | Route              | Description           |
| ------ | ------------------ | --------------------- |
| GET    | /api/events        | Get all events        |
| POST   | /api/events        | Create new event      |
| GET    | /api/events/[id]   | Get single event      |
| PUT    | /api/events/[id]   | Update event details  |
| DELETE | /api/events/[id]   | Delete event + tasks  |

### Tasks

| Method | Route                           | Description              |
| ------ | ------------------------------- | ------------------------ |
| GET    | /api/tasks/[eventId]            | Get all tasks for event  |
| POST   | /api/tasks/[eventId]            | Add task to event        |
| PUT    | /api/tasks/[eventId]/[taskId]   | Toggle done / edit title |
| DELETE | /api/tasks/[eventId]/[taskId]   | Delete a task            |

---

## Pages & UI

### Page 1: Dashboard (`/`)

- Header: "My Events" + "＋ New Event" button (top right)
- If no events: empty state with illustration and CTA button
- Event cards in a responsive grid (2 cols desktop, 1 col mobile)
- Each card shows:
  - Event name (bold, large)
  - Date + time (with calendar icon)
  - Location (with map pin icon)
  - Task progress: "3 / 5 tasks done" (with progress bar)
  - Click card → goes to Event Detail page

### Page 2: Create / Edit Event (`/events/new` or modal)

Form fields:
- **Event Name** — text input, required
- **Date** — date picker (react-day-picker), required
- **Time** — `<input type="time">`, required
- **Location** — text input, required
- **Notes / On Event** — textarea, optional (e.g. "Bring ID", "Dress code: formal")

Actions:
- Save Event → POST /api/events → redirect to event detail
- Cancel → back to dashboard

### Page 3: Event Detail (`/events/[id]`)

Top section — Event info card:
- Event name (h1)
- Date, time, location (with icons)
- Notes/On-Event section (if present)
- Edit button → opens edit form (same fields, prefilled)
- Delete button → confirm dialog → delete event + all tasks → redirect home

Tasks section:
- Title: "Tasks" + count badge
- Add task input: text field + "Add" button (inline, at top of list)
- Task list:
  - Checkbox (toggle done/undone)
  - Task title text (strikethrough when done)
  - Delete icon button (right side)
- Empty state: "No tasks yet — add one above"

---

## UI Design Guidelines

- **Color scheme:** Clean white background, indigo/violet accent (#6366f1), neutral grays for text
- **Font:** Inter (via next/font)
- **Component library:** shadcn/ui — use Button, Card, Input, Textarea, Dialog, Checkbox, Badge, Progress
- **Icons:** lucide-react (already included with shadcn)
- **Border radius:** rounded-xl on cards, rounded-lg on inputs
- **Mobile first:** all layouts must work on 375px width screens
- **Hover states:** cards have subtle shadow on hover
- **Transitions:** 150ms ease for checkbox and hover states

---

## Environment Variables

```bash
# .env.local (local development)
TURSO_DATABASE_URL=libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token
```

Add the same two variables in your Vercel project settings under:
Settings → Environment Variables

---

## Package Dependencies

```bash
# Core
npx create-next-app@latest event-todo --typescript --tailwind --app

# Database
npm install @libsql/client drizzle-orm
npm install -D drizzle-kit

# UI Components
npx shadcn@latest init
npx shadcn@latest add button card input textarea dialog checkbox badge progress

# Icons (comes with shadcn but install explicitly)
npm install lucide-react

# Date picker
npm install react-day-picker date-fns

# Utilities
npm install uuid
npm install -D @types/uuid
```

---

## Drizzle Config

```typescript
// drizzle.config.ts
import type { Config } from "drizzle-kit";

export default {
  schema: "./lib/schema.ts",
  out: "./drizzle/migrations",
  dialect: "turso",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
} satisfies Config;
```

Run migrations:
```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

---

## Turso DB Client Setup

```typescript
// lib/db.ts
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "./schema";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export const db = drizzle(client, { schema });
```

---

## Step-by-Step Build Order for AI Agent

Tell your AI agent (Cursor / Windsurf) to build in this exact order:

```
Step 1: Scaffold Next.js 14 app with TypeScript, Tailwind, App Router
Step 2: Install all dependencies listed in this PRD
Step 3: Set up Turso client in lib/db.ts and schema in lib/schema.ts
Step 4: Run drizzle-kit generate + migrate to create tables
Step 5: Build API route GET + POST /api/events
Step 6: Build API route GET + PUT + DELETE /api/events/[id]
Step 7: Build API route GET + POST /api/tasks/[eventId]
Step 8: Build API route PUT + DELETE /api/tasks/[eventId]/[taskId]
Step 9: Build EventForm component (all fields, validation)
Step 10: Build EventCard component
Step 11: Build dashboard page (/) with event grid
Step 12: Build /events/new page using EventForm
Step 13: Build TaskItem and TaskList components
Step 14: Build AddTaskForm component
Step 15: Build event detail page /events/[id]
Step 16: Add edit event functionality (prefilled form in dialog)
Step 17: Add delete event with confirm dialog
Step 18: Polish: empty states, loading states, error states
Step 19: Mobile responsiveness check on all pages
Step 20: Deploy to Vercel, add env vars, test sync between 2 browser tabs
```

---

## Prompts to Paste into Cursor / Windsurf

### Prompt 1 — Project Setup
```
Create a Next.js 14 App Router project with TypeScript and Tailwind CSS.
Install these packages: @libsql/client drizzle-orm drizzle-kit lucide-react uuid react-day-picker date-fns.
Initialize shadcn/ui and add: button, card, input, textarea, dialog, checkbox, badge, progress components.
Create lib/db.ts and lib/schema.ts exactly as defined in the PRD.
Create drizzle.config.ts as defined in the PRD.
Create .env.local with placeholder values for TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.
```

### Prompt 2 — API Routes
```
Build all API routes as defined in the PRD.
Use Drizzle ORM with the Turso client from lib/db.ts.
Use crypto.randomUUID() for generating IDs.
All routes should return JSON. Handle errors with try/catch and return status 500 on failure.
When deleting an event, also delete all tasks where eventId matches.
```

### Prompt 3 — Components & Pages
```
Build all components and pages as described in the PRD UI section.
Use shadcn/ui components for all UI elements.
Use lucide-react for icons (Calendar, MapPin, Clock, Trash2, Plus, CheckCircle).
The dashboard should fetch events from /api/events and show them in a responsive card grid.
Each EventCard shows name, date, time, location, and a task progress bar.
The event detail page fetches event + tasks, shows full info, and has an inline add-task form.
Tasks toggle done/undone via PUT /api/tasks/[eventId]/[taskId].
Follow the color scheme: white background, indigo accent (#6366f1), Inter font.
```

---

## Cost Summary

| Service    | Free Tier Limits                          | Cost    |
| ---------- | ----------------------------------------- | ------- |
| Turso DB   | 500 DBs, 9GB storage, 1B row reads/month  | $0/mo   |
| Vercel     | 100GB bandwidth, unlimited deployments    | $0/mo   |
| **Total**  |                                           | **$0**  |

This setup will comfortably handle 2–3 users forever on the free tier.

---

## Notes for AI Agent

- Always use App Router (`app/` directory), NOT the old `pages/` directory
- Use `async/await` in Server Components where possible to avoid client-side fetching
- Do NOT add authentication — the app is intentionally public for 2-3 trusted users
- Do NOT use any paid services or APIs
- Keep components small and focused — one responsibility per file
- Use TypeScript strict mode throughout