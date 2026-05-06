# Event To-Do App

A lightweight Next.js event planner with real-time syncing on Turso.

## Step 1 — Turso Setup

1. Install the Turso CLI:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```
2. Login:
   ```bash
   turso auth login
   ```
3. Create your database:
   ```bash
   turso db create event-todo-app
   ```
4. Get the connection URL and auth token:
   ```bash
   turso db show event-todo-app --url
   turso db tokens create event-todo-app
   ```

Save the resulting values into `.env.local`:
```bash
TURSO_DATABASE_URL=libsql://your-db-name.turso.io
TURSO_AUTH_TOKEN=your-turso-auth-token
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the development server:
   ```bash
   npm run dev
   ```
