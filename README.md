# Aurora Second Brain

Aurora Second Brain is a mobile-first Next.js application that blends notes, tasks, reminders, file storage, and an AI copilot into a single dashboard. Everything persists locally in your browser, making the app private by default while still feeling responsive and rich.

## 🚀 Quick Start

```bash
npm install
npm run dev
# visit http://localhost:3000
```

## 🧠 Core Features

- **Dashboard pulse** with live metrics for notes, tasks, reminders, and files.
- **Notes workspace** for capturing rich ideas with tags, search, and color accents.
- **Task cockpit** to prioritize, schedule, and complete todos with smart filters.
- **Reminder queue** with channel preferences and upcoming vs. past toggles.
- **File manager** that stores attachments in localStorage and supports downloads.
- **AI chat bubble** overlay that expands into a copilot for summaries, planning, and ideation.

## 🛠️ Tech Stack

- [Next.js 14](https://nextjs.org/) App Router
- [React 18](https://react.dev/) with client components
- Local persistence via `localStorage`
- TypeScript for end-to-end typing

## 📦 Scripts

- `npm run dev` – start the development server
- `npm run build` – create a production build
- `npm start` – serve the production build
- `npm run lint` – run ESLint checks
- `npm run typecheck` – validate TypeScript types

## 📁 Structure

```
app/               # App Router pages, including API routes
components/        # UI building blocks for core sections
hooks/             # Shared hooks (e.g. local persistence)
lib/               # Shared types and utilities
```

## 🔐 Data Privacy

All captured content (notes, tasks, etc.) is stored locally in your browser. Clearing browser storage removes the data entirely. No account or external storage is required.

## 🚢 Deployment

1. Build the project: `npm run build`
2. Deploy to Vercel: `vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-f700a963`

---

Aurora Second Brain helps you orchestrate everything you know, need to do, and want to remember—with an AI assistant always one tap away.
