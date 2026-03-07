# Personal Website Design

**Date:** 2026-03-07
**Status:** Approved

## Overview

A minimalist personal website for publishing technical blogs, personal reflections, book/paper notes, and projects. Inspired by eugeneyan.com — clean, text-first, generous whitespace.

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Content:** MDX + next-mdx-remote + gray-matter
- **Search:** Fuse.js (client-side, no backend)
- **Dark mode:** next-themes (persisted in localStorage)
- **Deployment:** Vercel (git-push-to-deploy)

## Routes

| Route | Description |
|---|---|
| `/` | Home — intro, recent posts, featured content |
| `/writing` | All technical blogs + personal reflections |
| `/notes` | Book/paper notes |
| `/projects` | Portfolio / side projects |
| `/about` | Bio, contact links |
| `/writing/[slug]` | Individual blog post |
| `/notes/[slug]` | Individual note |

## Content Structure

All content lives in `content/` as MDX files with frontmatter.

```
content/
├── writing/        ← technical blogs + personal reflections
├── notes/          ← book/paper notes
└── projects/       ← project descriptions
```

**Frontmatter schema:**
```yaml
title: string
date: YYYY-MM-DD
description: string
tags: string[]
type: technical | reflection | notes | project
published: boolean
```

## Design System

- **Font:** Inter, with system-stack fallback; monospace for code blocks
- **Layout:** Single centered column, ~680px max content width
- **Colors:** Near-black on white (light) / near-white on dark (dark mode)
- **Dark mode toggle:** Header button, persisted via next-themes + localStorage
- **Search:** Fuse.js fuzzy search over title + description fields; triggered by search icon in header, rendered as overlay modal

## Key Components

| Component | Purpose |
|---|---|
| `Header` | Navigation links, dark mode toggle, search icon |
| `PostCard` | Title, date, description for listing views |
| `MDXContent` | Renders MDX with styled prose typography |
| `SearchModal` | Client-side fuzzy search overlay |
| `TagFilter` | Optional tag-based filter on listing pages |

## Deployment

- GitHub repo → Vercel (auto-deploy on push to main)
- Vercel default URL for now; custom domain can be added later
