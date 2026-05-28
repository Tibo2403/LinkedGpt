# LinkedGPT

[![CI](https://github.com/Tibo2403/LinkedGpt/actions/workflows/ci.yml/badge.svg)](https://github.com/Tibo2403/LinkedGpt/actions/workflows/ci.yml)

LinkedGPT is a React and TypeScript web app for LinkedIn-focused content creation, outreach planning, and professional networking workflows.

## Features

- AI-assisted LinkedIn post generation.
- Message templates for connection and follow-up workflows.
- Calendar-oriented planning for meetings and outreach.
- Contact and activity tracking.
- Analytics views for post and engagement performance.
- Supabase-backed authentication and persistence.
- Multilingual UI foundations.

## Tech Stack

- React, TypeScript, and Vite.
- Tailwind CSS for styling.
- Supabase for authentication and data storage.
- Zustand for local state.
- Vitest for tests.
- Lucide React for icons.

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

Required environment variables:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_DEMO_MODE=false
```

Optional integrations can be configured for OpenAI, LinkedIn, Google Calendar, and Outlook. See `.env.example` for the full list.

## Demo Mode

Set `VITE_DEMO_MODE=true` to use built-in demo responses for content generation, publishing, scheduling, metrics, and calendar sync. This lets the app run as a portfolio demo without Supabase, OpenAI, or LinkedIn credentials.

```bash
VITE_DEMO_MODE=true npm run demo
```

On Windows PowerShell:

```powershell
$env:VITE_DEMO_MODE="true"; npm run demo
```

## Portfolio Assets

- `docs/portfolio.md` explains the project in recruiter/client terms.
- `docs/demo-media.md` lists the screenshots and GIFs to capture in demo mode.
- `docs/issue-backlog.md` contains ready-to-create GitHub issues.
- `CHANGELOG.md` tracks release notes.

## Quality Checks

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

Or run the full local gate:

```bash
npm run check
```

## Project Structure

```text
src/
  components/     Reusable UI and workflow components
  pages/          Main application screens
  services/       API, persistence, and integration helpers
  store/          Client-side state
supabase/         Database migrations and Supabase assets
```

## Roadmap

- Add the screenshots and short demo flow listed in `docs/demo-media.md`.
- Add more tests around message generation and scheduling flows.
- Document Supabase schema setup in a dedicated deployment guide.
- Add safer rate-limit handling for external APIs.
