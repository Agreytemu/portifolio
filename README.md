# Agrey Temu — portfolio

React + Vite + TypeScript + Tailwind CSS 3 + Framer Motion + Lucide.
Dark, GitHub-inspired developer interface with a cached GitHub repository API.

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

## GitHub integration

`src/lib/dataSource.ts` keeps curated portfolio content separate from the live repository collection.
The Vite server exposes `/api/github/repos`, which fetches every public owner repository across GitHub pagination,
enriches language data, and caches the normalized response for ten minutes. The browser only calls this local API.

The account is configured as `Agreytemu` in `src/data/site.ts`. For higher GitHub rate limits, set `GITHUB_TOKEN` in
the backend environment only; never use a `VITE_` variable for this token. The token must belong to `Agreytemu` and
needs only read access to repository metadata (including private repositories) and repository contents metadata as
required by GitHub's token model. A fine-grained token with read-only repository metadata is preferred.

Without `GITHUB_TOKEN`, GitHub's public API is used and private repositories cannot be returned. When the token is
present, the backend uses the authenticated `/user/repos?visibility=all&affiliation=owner` endpoint and validates that
the token account is `Agreytemu`. GitHub errors, authentication failures, and rate limits are returned to the UI as
sync errors. Use the repository section's **Refresh GitHub data** action to bypass the ten-minute cache.

The API is implemented as Vite server middleware for development and preview. A production deployment must run the
same backend route (or move `server/githubApi.ts` into the host's serverless/API function) with `GITHUB_TOKEN` set
server-side.

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
