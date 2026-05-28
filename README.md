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
```

Optional integrations can be configured for OpenAI, LinkedIn, Google Calendar, and Outlook. See `.env.example` for the full list.

## Quality Checks

```bash
npm run lint
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

- Add screenshots and a short demo flow to the README.
- Add more tests around message generation and scheduling flows.
- Resolve the remaining strict TypeScript issues and add `tsc -b` to CI.
- Document Supabase schema setup in a dedicated deployment guide.
- Add safer rate-limit handling for external APIs.
