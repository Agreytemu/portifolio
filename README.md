# Agrey Temu — portfolio

React + Vite + TypeScript + Tailwind CSS 3 + Framer Motion + Lucide.
Dark, GitHub-inspired developer interface. Static data today, GitHub-API-ready.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build
npm run lint
```

Requires Node 20.19 or newer (Vite 7).

## Fill in the real details (all in `src/data/`)

| What | Where |
| --- | --- |
| GitHub username, LinkedIn URL, email, profile photo | `data/site.ts` |
| Repository / demo links, status, language | `data/projects.ts` (`repoUrl`, `liveUrl`) |
| Stack, principles, journey, terminal text | `data/stack.ts`, `principles.ts`, `journey.ts`, `terminal.ts` |
| "Now" focus list | `nowFocus` in `data/site.ts` (the building project comes from `status` in `data/projects.ts`) |
| Build log entries | `data/buildLog.ts` (undated on purpose; add dates only if they are real) |
| Project category shown on cards | `category` in `data/projects.ts` |

Until a link is set, its button renders as a dashed, non-clickable placeholder with an explanation,
so nothing points at an invented URL. Set `githubUsername` and every GitHub button lights up.

To use a photo: put `avatar.jpg` in `public/` and set `avatarSrc: '/avatar.jpg'`.

## Command palette

`Ctrl + K` (or `Cmd + K`) opens it from anywhere. It jumps to sections, opens project details, and links to GitHub once
`githubUsername` is set. It is also reachable from the search button in the navbar. Commands live in
`src/components/CommandPalette.tsx`.

## Data rules

Nothing on the page is invented: no employers, clients, users, revenue, testimonials or GitHub stats.
The activity graph is generated sample data and is labelled **Demo data** in the UI.
The stat cards are computed from the data files.

**Placeholders to confirm before publishing**
- Status of AgreyFlix, Lyvora Shop Drop and MIHS Student Portal is `coming-soon`.
- The `language` field of each project is inferred from its stack.
- Problem / solution / architecture copy is written from the stack and descriptions you gave. Check it reads true.

## GitHub integration (optional, off by default)

`src/lib/dataSource.ts` returns everything the UI needs (`PortfolioData`) synchronously from static data.
Set `githubUsername` and create `.env.local` with `VITE_GITHUB_SYNC=true` to enable `src/lib/github.ts`, which:

- matches repositories to projects by name and fills in the link, stars and language
- builds the activity graph from public push events (about the last 90 days only; a full-year
  contribution calendar needs the GraphQL API and a token, which should live behind a server)

Failures fall back to static data. This code has not been run against the live API.

## Contact form

Frontend-only. If `email` is set, submitting opens the visitor's mail app with the message prefilled.
Otherwise it says plainly that nothing was sent. To add a backend, replace `submitContact` in `src/lib/contact.ts`.

## Structure

```
src/
  components/  reusable UI (Navbar, RepositoryCard, ActivityGraph, Terminal, ProjectModal, ...)
  sections/    one file per page section
  pages/       HomePage composes the sections
  data/        static content
  hooks/       scroll-spy, focus trap, typewriter, portfolio data
  lib/         data source, GitHub client, activity generator, tokenizer
  types/       shared types
```

## Before you deploy

- Add `og:url` and a 1200x630 PNG `og:image` in `index.html` (a comment marks the spot).
- Fonts (Hanken Grotesk, Spline Sans Mono) load from Google Fonts; self-host with `@fontsource` if you prefer.
