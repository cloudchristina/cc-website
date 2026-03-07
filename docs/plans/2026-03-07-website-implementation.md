# Personal Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a minimalist personal website with Next.js for publishing technical blogs, personal reflections, book notes, and projects — inspired by eugeneyan.com.

**Architecture:** Next.js 14 App Router with MDX files as content source. All content lives in `content/` as `.mdx` files with frontmatter. Pages read content at build/request time using `gray-matter` + `next-mdx-remote`. Client-side search uses Fuse.js over a pre-built index.

**Tech Stack:** Next.js 14, Tailwind CSS, @tailwindcss/typography, next-mdx-remote, gray-matter, next-themes, Fuse.js, Jest + React Testing Library

---

### Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`, `next.config.mjs`, `tailwind.config.ts`, `tsconfig.json` (auto-generated)

**Step 1: Scaffold the project**

Run from `/Users/xc/Desktop/cc-website`:
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-git
```
When prompted, accept all defaults.

**Step 2: Verify it runs**

```bash
npm run dev
```
Expected: Server starts at http://localhost:3000, default Next.js page visible.

**Step 3: Stop the dev server (Ctrl+C)**

**Step 4: Install content and theme dependencies**

```bash
npm install next-mdx-remote gray-matter next-themes fuse.js
npm install -D @tailwindcss/typography
```

**Step 5: Install testing dependencies**

```bash
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom ts-jest @types/jest
```

**Step 6: Create Jest config**

Create `jest.config.ts`:
```typescript
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
```

Create `jest.setup.ts`:
```typescript
import '@testing-library/jest-dom'
```

**Step 7: Add test script to package.json**

In `package.json`, add to `"scripts"`:
```json
"test": "jest",
"test:watch": "jest --watch"
```

**Step 8: Commit**

```bash
git init
git add .
git commit -m "chore: initialize Next.js project with dependencies"
```

---

### Task 2: Configure Tailwind and typography plugin

**Files:**
- Modify: `tailwind.config.ts`
- Modify: `src/app/globals.css`

**Step 1: Update tailwind.config.ts**

```typescript
import type { Config } from 'tailwindcss'
import typography from '@tailwindcss/typography'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '68ch',
            color: 'inherit',
            a: { color: 'inherit', textDecoration: 'underline' },
            'h1,h2,h3,h4': { color: 'inherit' },
            code: { color: 'inherit' },
          },
        },
      },
    },
  },
  plugins: [typography],
}

export default config
```

**Step 2: Replace src/app/globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --bg: 255 255 255;
    --fg: 17 17 17;
    --muted: 107 114 128;
  }
  .dark {
    --bg: 17 17 17;
    --fg: 237 237 237;
    --muted: 156 163 175;
  }
  body {
    @apply bg-white dark:bg-[#111] text-[#111] dark:text-[#ededed] antialiased;
  }
}
```

**Step 3: Commit**

```bash
git add tailwind.config.ts src/app/globals.css
git commit -m "chore: configure Tailwind with typography plugin and dark mode"
```

---

### Task 3: Set up content directory and lib utilities

**Files:**
- Create: `content/writing/.gitkeep`
- Create: `content/notes/.gitkeep`
- Create: `content/projects/.gitkeep`
- Create: `src/lib/content.ts`
- Create: `src/lib/content.test.ts`

**Step 1: Write the failing test**

Create `src/lib/content.test.ts`:
```typescript
import { getAllPosts, getPostBySlug } from './content'
import path from 'path'

// These tests use actual fixture files we'll create in Step 2
describe('getAllPosts', () => {
  it('returns posts sorted by date descending', async () => {
    const posts = await getAllPosts('writing')
    expect(posts.length).toBeGreaterThan(0)
    // dates should be descending
    for (let i = 0; i < posts.length - 1; i++) {
      expect(posts[i].date >= posts[i + 1].date).toBe(true)
    }
  })

  it('only returns published posts', async () => {
    const posts = await getAllPosts('writing')
    posts.forEach(p => expect(p.published).toBe(true))
  })
})

describe('getPostBySlug', () => {
  it('returns post with content and frontmatter', async () => {
    const post = await getPostBySlug('writing', 'test-post')
    expect(post.title).toBeDefined()
    expect(post.content).toBeDefined()
    expect(post.slug).toBe('test-post')
  })
})
```

**Step 2: Create fixture MDX files for tests**

Create `content/writing/test-post.mdx`:
```mdx
---
title: Test Post
date: 2026-01-15
description: A test post
tags: [test]
published: true
---

This is the test post content.
```

Create `content/writing/draft-post.mdx`:
```mdx
---
title: Draft Post
date: 2026-01-10
description: A draft post
tags: [test]
published: false
---

This is a draft.
```

**Step 3: Run tests to verify they fail**

```bash
npm test -- src/lib/content.test.ts
```
Expected: FAIL — `Cannot find module './content'`

**Step 4: Implement src/lib/content.ts**

```typescript
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const contentDir = path.join(process.cwd(), 'content')

export interface PostMeta {
  slug: string
  title: string
  date: string
  description: string
  tags: string[]
  published: boolean
  type?: string
}

export interface Post extends PostMeta {
  content: string
}

export async function getAllPosts(dir: string): Promise<PostMeta[]> {
  const folder = path.join(contentDir, dir)
  if (!fs.existsSync(folder)) return []

  const files = fs.readdirSync(folder).filter(f => f.endsWith('.mdx'))

  const posts = files.map(file => {
    const slug = file.replace(/\.mdx$/, '')
    const raw = fs.readFileSync(path.join(folder, file), 'utf-8')
    const { data } = matter(raw)
    return {
      slug,
      title: data.title ?? '',
      date: data.date ? String(data.date).slice(0, 10) : '',
      description: data.description ?? '',
      tags: data.tags ?? [],
      published: data.published ?? true,
      type: data.type,
    } as PostMeta
  })

  return posts
    .filter(p => p.published)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(dir: string, slug: string): Promise<Post> {
  const filePath = path.join(contentDir, dir, `${slug}.mdx`)
  const raw = fs.readFileSync(filePath, 'utf-8')
  const { data, content } = matter(raw)
  return {
    slug,
    title: data.title ?? '',
    date: data.date ? String(data.date).slice(0, 10) : '',
    description: data.description ?? '',
    tags: data.tags ?? [],
    published: data.published ?? true,
    type: data.type,
    content,
  }
}
```

**Step 5: Run tests to verify they pass**

```bash
npm test -- src/lib/content.test.ts
```
Expected: PASS (2 test suites, all pass)

**Step 6: Commit**

```bash
git add content/ src/lib/content.ts src/lib/content.test.ts
git commit -m "feat: content reading utilities with tests"
```

---

### Task 4: Build Header component

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/Header.test.tsx`
- Create: `src/components/ThemeToggle.tsx`

**Step 1: Write the failing test**

Create `src/components/Header.test.tsx`:
```typescript
import { render, screen } from '@testing-library/react'
import Header from './Header'

// Mock next-themes
jest.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'light', setTheme: jest.fn(), resolvedTheme: 'light' }),
}))

describe('Header', () => {
  it('renders navigation links', () => {
    render(<Header />)
    expect(screen.getByText('Writing')).toBeInTheDocument()
    expect(screen.getByText('Notes')).toBeInTheDocument()
    expect(screen.getByText('Projects')).toBeInTheDocument()
    expect(screen.getByText('About')).toBeInTheDocument()
  })

  it('renders the site name as a link to home', () => {
    render(<Header />)
    const homeLink = screen.getByRole('link', { name: /home/i })
    expect(homeLink).toHaveAttribute('href', '/')
  })
})
```

**Step 2: Run to verify failure**

```bash
npm test -- src/components/Header.test.tsx
```
Expected: FAIL — `Cannot find module './Header'`

**Step 3: Create ThemeToggle.tsx**

```typescript
'use client'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])
  if (!mounted) return <div className="w-8 h-8" />

  return (
    <button
      onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle dark mode"
      className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
    >
      {resolvedTheme === 'dark' ? (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
      ) : (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
      )}
    </button>
  )
}
```

**Step 4: Create Header.tsx**

```typescript
import Link from 'next/link'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { href: '/writing', label: 'Writing' },
  { href: '/notes', label: 'Notes' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
]

export default function Header() {
  return (
    <header className="py-6 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-2xl mx-auto px-4 flex items-center justify-between">
        <Link href="/" aria-label="home" className="font-semibold text-sm tracking-tight hover:opacity-70 transition-opacity">
          your name
        </Link>
        <nav className="flex items-center gap-5">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
```

**Step 5: Run tests to verify they pass**

```bash
npm test -- src/components/Header.test.tsx
```
Expected: PASS

**Step 6: Commit**

```bash
git add src/components/
git commit -m "feat: Header and ThemeToggle components"
```

---

### Task 5: Set up layout, providers, and ThemeProvider

**Files:**
- Create: `src/components/Providers.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Create Providers.tsx**

```typescript
'use client'
import { ThemeProvider } from 'next-themes'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
    </ThemeProvider>
  )
}
```

**Step 2: Update src/app/layout.tsx**

```typescript
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: { default: 'Your Name', template: '%s | Your Name' },
  description: 'Technical writing, reflections, and notes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="max-w-2xl mx-auto px-4 py-12">
            {children}
          </main>
          <footer className="max-w-2xl mx-auto px-4 py-8 mt-16 border-t border-gray-100 dark:border-gray-800 text-sm text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} Your Name
          </footer>
        </Providers>
      </body>
    </html>
  )
}
```

**Step 3: Verify it compiles**

```bash
npm run build
```
Expected: Build succeeds (or dev server starts without errors with `npm run dev`)

**Step 4: Commit**

```bash
git add src/components/Providers.tsx src/app/layout.tsx
git commit -m "feat: root layout with ThemeProvider and Header"
```

---

### Task 6: Build PostCard component

**Files:**
- Create: `src/components/PostCard.tsx`
- Create: `src/components/PostCard.test.tsx`

**Step 1: Write the failing test**

Create `src/components/PostCard.test.tsx`:
```typescript
import { render, screen } from '@testing-library/react'
import PostCard from './PostCard'

const post = {
  slug: 'my-post',
  title: 'My Post',
  date: '2026-01-15',
  description: 'A great post about things',
  tags: ['ml', 'systems'],
  published: true,
}

describe('PostCard', () => {
  it('renders title as a link', () => {
    render(<PostCard post={post} basePath="writing" />)
    const link = screen.getByRole('link', { name: 'My Post' })
    expect(link).toHaveAttribute('href', '/writing/my-post')
  })

  it('renders formatted date', () => {
    render(<PostCard post={post} basePath="writing" />)
    expect(screen.getByText(/jan/i)).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<PostCard post={post} basePath="writing" />)
    expect(screen.getByText('A great post about things')).toBeInTheDocument()
  })
})
```

**Step 2: Run to verify failure**

```bash
npm test -- src/components/PostCard.test.tsx
```
Expected: FAIL — `Cannot find module './PostCard'`

**Step 3: Create PostCard.tsx**

```typescript
import Link from 'next/link'
import { PostMeta } from '@/lib/content'

interface Props {
  post: PostMeta
  basePath: string
}

export default function PostCard({ post, basePath }: Props) {
  const formatted = new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
  return (
    <article className="py-5 border-b border-gray-100 dark:border-gray-800 last:border-0">
      <div className="flex items-baseline justify-between gap-4">
        <Link
          href={`/${basePath}/${post.slug}`}
          className="font-medium hover:underline underline-offset-4"
        >
          {post.title}
        </Link>
        <time className="text-sm text-gray-400 dark:text-gray-500 shrink-0">
          {formatted}
        </time>
      </div>
      {post.description && (
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          {post.description}
        </p>
      )}
    </article>
  )
}
```

**Step 4: Run tests to verify they pass**

```bash
npm test -- src/components/PostCard.test.tsx
```
Expected: PASS

**Step 5: Commit**

```bash
git add src/components/PostCard.tsx src/components/PostCard.test.tsx
git commit -m "feat: PostCard component with tests"
```

---

### Task 7: Build Home page

**Files:**
- Modify: `src/app/page.tsx`

**Step 1: Add sample writing content**

Create `content/writing/hello-world.mdx`:
```mdx
---
title: Hello World
date: 2026-03-01
description: My first post on this site.
tags: [meta]
published: true
---

Hello! This is my first post.
```

Create `content/writing/on-simplicity.mdx`:
```mdx
---
title: On Simplicity
date: 2026-02-15
description: Why I keep coming back to simplicity as a design principle.
tags: [design, philosophy]
published: true
---

Simplicity is hard.
```

**Step 2: Replace src/app/page.tsx**

```typescript
import { getAllPosts } from '@/lib/content'
import PostCard from '@/components/PostCard'
import Link from 'next/link'

export default async function Home() {
  const posts = await getAllPosts('writing')
  const recent = posts.slice(0, 5)

  return (
    <div className="space-y-16">
      {/* Intro */}
      <section>
        <h1 className="text-2xl font-semibold mb-4">Hi, I'm [Your Name]</h1>
        <p className="text-gray-600 dark:text-gray-400 leading-relaxed max-w-prose">
          I write about [what you do]. This site is where I publish technical deep-dives,
          personal reflections, and notes on things I'm reading.
        </p>
      </section>

      {/* Recent writing */}
      <section>
        <div className="flex items-baseline justify-between mb-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
            Recent Writing
          </h2>
          <Link href="/writing" className="text-sm hover:underline">All →</Link>
        </div>
        <div>
          {recent.map(post => (
            <PostCard key={post.slug} post={post} basePath="writing" />
          ))}
        </div>
      </section>
    </div>
  )
}
```

**Step 3: Verify in browser**

```bash
npm run dev
```
Open http://localhost:3000 — should show intro and recent posts list.

**Step 4: Commit**

```bash
git add content/writing/ src/app/page.tsx
git commit -m "feat: home page with recent writing list"
```

---

### Task 8: Build Writing listing page

**Files:**
- Create: `src/app/writing/page.tsx`

**Step 1: Create src/app/writing/page.tsx**

```typescript
import { getAllPosts } from '@/lib/content'
import PostCard from '@/components/PostCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Writing' }

export default async function WritingPage() {
  const posts = await getAllPosts('writing')

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Writing</h1>
      <div>
        {posts.map(post => (
          <PostCard key={post.slug} post={post} basePath="writing" />
        ))}
        {posts.length === 0 && (
          <p className="text-gray-500">No posts yet.</p>
        )}
      </div>
    </div>
  )
}
```

**Step 2: Verify in browser**

Open http://localhost:3000/writing — should list all published posts.

**Step 3: Commit**

```bash
git add src/app/writing/page.tsx
git commit -m "feat: writing listing page"
```

---

### Task 9: Build individual post page (MDX rendering)

**Files:**
- Create: `src/app/writing/[slug]/page.tsx`
- Create: `src/components/MDXContent.tsx`

**Step 1: Create MDXContent.tsx**

```typescript
'use client'
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote'

interface Props {
  source: MDXRemoteSerializeResult
}

export default function MDXContent({ source }: Props) {
  return (
    <article className="prose dark:prose-invert prose-gray max-w-none
      prose-headings:font-semibold prose-a:text-blue-600 dark:prose-a:text-blue-400
      prose-code:before:content-none prose-code:after:content-none
      prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded">
      <MDXRemote {...source} />
    </article>
  )
}
```

**Step 2: Create src/app/writing/[slug]/page.tsx**

```typescript
import { getAllPosts, getPostBySlug } from '@/lib/content'
import { serialize } from 'next-mdx-remote/serialize'
import MDXContent from '@/components/MDXContent'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: { slug: string }
}

export async function generateStaticParams() {
  const posts = await getAllPosts('writing')
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const posts = await getAllPosts('writing')
  const post = posts.find(p => p.slug === params.slug)
  if (!post) return {}
  return { title: post.title, description: post.description }
}

export default async function PostPage({ params }: Props) {
  let post
  try {
    post = await getPostBySlug('writing', params.slug)
  } catch {
    notFound()
  }

  const mdxSource = await serialize(post.content)
  const formatted = new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <time>{formatted}</time>
          {post.tags.length > 0 && (
            <span className="flex gap-2">
              {post.tags.map(tag => (
                <span key={tag} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">
                  {tag}
                </span>
              ))}
            </span>
          )}
        </div>
      </header>
      <MDXContent source={mdxSource} />
    </div>
  )
}
```

**Step 3: Verify in browser**

Open http://localhost:3000/writing/hello-world — should render the post with title, date, and styled content.

**Step 4: Commit**

```bash
git add src/app/writing/ src/components/MDXContent.tsx
git commit -m "feat: individual post page with MDX rendering"
```

---

### Task 10: Build Notes pages (listing + individual)

**Files:**
- Create: `content/notes/atomic-habits.mdx`
- Create: `src/app/notes/page.tsx`
- Create: `src/app/notes/[slug]/page.tsx`

**Step 1: Create a sample note**

Create `content/notes/atomic-habits.mdx`:
```mdx
---
title: "Atomic Habits — James Clear"
date: 2026-02-20
description: Notes on building systems for lasting change.
tags: [books, productivity]
published: true
---

## Key ideas

- Habits are the compound interest of self-improvement.
- Focus on systems, not goals.
- Identity change is the real outcome: "I am a reader" vs "I want to read more."
```

**Step 2: Create src/app/notes/page.tsx**

```typescript
import { getAllPosts } from '@/lib/content'
import PostCard from '@/components/PostCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Notes' }

export default async function NotesPage() {
  const notes = await getAllPosts('notes')
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Notes</h1>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-8">
        Notes on books, papers, and talks.
      </p>
      <div>
        {notes.map(note => (
          <PostCard key={note.slug} post={note} basePath="notes" />
        ))}
        {notes.length === 0 && <p className="text-gray-500">No notes yet.</p>}
      </div>
    </div>
  )
}
```

**Step 3: Create src/app/notes/[slug]/page.tsx**

```typescript
import { getAllPosts, getPostBySlug } from '@/lib/content'
import { serialize } from 'next-mdx-remote/serialize'
import MDXContent from '@/components/MDXContent'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props { params: { slug: string } }

export async function generateStaticParams() {
  const notes = await getAllPosts('notes')
  return notes.map(n => ({ slug: n.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const notes = await getAllPosts('notes')
  const note = notes.find(n => n.slug === params.slug)
  if (!note) return {}
  return { title: note.title, description: note.description }
}

export default async function NotePage({ params }: Props) {
  let post
  try {
    post = await getPostBySlug('notes', params.slug)
  } catch {
    notFound()
  }
  const mdxSource = await serialize(post.content)
  const formatted = new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{post.title}</h1>
        <time className="text-sm text-gray-500 dark:text-gray-400">{formatted}</time>
      </header>
      <MDXContent source={mdxSource} />
    </div>
  )
}
```

**Step 4: Verify in browser**

Open http://localhost:3000/notes — should list notes. Click through to note page.

**Step 5: Commit**

```bash
git add content/notes/ src/app/notes/
git commit -m "feat: notes listing and detail pages"
```

---

### Task 11: Build Projects page

**Files:**
- Create: `content/projects/my-project.mdx`
- Create: `src/app/projects/page.tsx`

**Step 1: Create a sample project**

Create `content/projects/my-project.mdx`:
```mdx
---
title: My Project
date: 2026-01-01
description: A brief description of what this project does.
tags: [python, ml]
published: true
link: https://github.com/yourname/my-project
---

More details about the project, what problem it solves, and how I built it.
```

**Step 2: Update PostMeta interface to include optional link**

In `src/lib/content.ts`, add `link?: string` to the `PostMeta` interface and parse it in `getAllPosts`:
```typescript
// in the map function, add:
link: data.link,
```

**Step 3: Create src/app/projects/page.tsx**

```typescript
import { getAllPosts } from '@/lib/content'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Projects' }

export default async function ProjectsPage() {
  const projects = await getAllPosts('projects')
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Projects</h1>
      <div className="space-y-8">
        {projects.map(p => (
          <div key={p.slug} className="border-b border-gray-100 dark:border-gray-800 pb-8 last:border-0">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-medium">{p.title}</h2>
              {(p as any).link && (
                <a href={(p as any).link} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-gray-500 hover:underline shrink-0">
                  GitHub →
                </a>
              )}
            </div>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{p.description}</p>
            <div className="mt-2 flex gap-2 flex-wrap">
              {p.tags.map(tag => (
                <span key={tag} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
        {projects.length === 0 && <p className="text-gray-500">No projects yet.</p>}
      </div>
    </div>
  )
}
```

**Step 4: Verify in browser**

Open http://localhost:3000/projects.

**Step 5: Commit**

```bash
git add content/projects/ src/app/projects/ src/lib/content.ts
git commit -m "feat: projects page"
```

---

### Task 12: Build About page

**Files:**
- Create: `src/app/about/page.tsx`

**Step 1: Create src/app/about/page.tsx**

```typescript
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div className="prose dark:prose-invert prose-gray max-w-none">
      <h1>About</h1>
      <p>
        Hi, I'm [Your Name]. I work on [what you do].
      </p>
      <p>
        I write about [topics]. This site is a place for my technical writing,
        personal reflections, and notes on things I'm reading.
      </p>
      <h2>Find me</h2>
      <ul>
        <li><a href="https://github.com/yourname" target="_blank" rel="noopener noreferrer">GitHub</a></li>
        <li><a href="https://twitter.com/yourname" target="_blank" rel="noopener noreferrer">Twitter / X</a></li>
        <li><a href="mailto:you@example.com">Email</a></li>
      </ul>
    </div>
  )
}
```

**Step 2: Verify in browser**

Open http://localhost:3000/about.

**Step 3: Commit**

```bash
git add src/app/about/page.tsx
git commit -m "feat: about page"
```

---

### Task 13: Build client-side search

**Files:**
- Create: `src/lib/search.ts`
- Create: `src/lib/search.test.ts`
- Create: `src/app/api/search/route.ts`
- Create: `src/components/SearchModal.tsx`

**Step 1: Write the failing test for search utility**

Create `src/lib/search.test.ts`:
```typescript
import { buildSearchIndex, searchPosts } from './search'

const samplePosts = [
  { slug: 'ml-systems', title: 'ML Systems at Scale', description: 'How to build ML systems', tags: ['ml'], basePath: 'writing' },
  { slug: 'simplicity', title: 'On Simplicity', description: 'Why simplicity matters', tags: ['design'], basePath: 'writing' },
]

describe('searchPosts', () => {
  it('finds posts by title', () => {
    const results = searchPosts('simplicity', samplePosts)
    expect(results.some(r => r.slug === 'simplicity')).toBe(true)
  })

  it('returns empty array for no match', () => {
    const results = searchPosts('zzznomatch', samplePosts)
    expect(results).toHaveLength(0)
  })

  it('is case insensitive', () => {
    const results = searchPosts('ML', samplePosts)
    expect(results.some(r => r.slug === 'ml-systems')).toBe(true)
  })
})
```

**Step 2: Run to verify failure**

```bash
npm test -- src/lib/search.test.ts
```
Expected: FAIL — `Cannot find module './search'`

**Step 3: Create src/lib/search.ts**

```typescript
import Fuse from 'fuse.js'

export interface SearchItem {
  slug: string
  title: string
  description: string
  tags: string[]
  basePath: string
}

export function searchPosts(query: string, items: SearchItem[]): SearchItem[] {
  if (!query.trim()) return []
  const fuse = new Fuse(items, {
    keys: ['title', 'description', 'tags'],
    threshold: 0.4,
    ignoreLocation: true,
  })
  return fuse.search(query).map(r => r.item)
}
```

**Step 4: Run tests to verify they pass**

```bash
npm test -- src/lib/search.test.ts
```
Expected: PASS

**Step 5: Create API route for search index**

Create `src/app/api/search/route.ts`:
```typescript
import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/content'

export async function GET() {
  const [writing, notes] = await Promise.all([
    getAllPosts('writing'),
    getAllPosts('notes'),
  ])

  const index = [
    ...writing.map(p => ({ slug: p.slug, title: p.title, description: p.description, tags: p.tags, basePath: 'writing' })),
    ...notes.map(p => ({ slug: p.slug, title: p.title, description: p.description, tags: p.tags, basePath: 'notes' })),
  ]

  return NextResponse.json(index)
}
```

**Step 6: Create SearchModal.tsx**

```typescript
'use client'
import { useState, useEffect, useRef } from 'react'
import { SearchItem, searchPosts } from '@/lib/search'
import Link from 'next/link'

export default function SearchModal() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState<SearchItem[]>([])
  const [results, setResults] = useState<SearchItem[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Load search index once
  useEffect(() => {
    if (open && index.length === 0) {
      fetch('/api/search').then(r => r.json()).then(setIndex)
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  // Search on query change
  useEffect(() => {
    setResults(searchPosts(query, index))
  }, [query, index])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Search"
        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4"
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false) }}>
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1a1a1a] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search posts and notes..."
              className="w-full px-4 py-3 bg-transparent outline-none text-sm"
            />
            {results.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-800 max-h-80 overflow-y-auto">
                {results.map(r => (
                  <Link key={`${r.basePath}/${r.slug}`} href={`/${r.basePath}/${r.slug}`}
                    onClick={() => { setOpen(false); setQuery('') }}
                    className="flex flex-col px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-50 dark:border-gray-800 last:border-0">
                    <span className="text-sm font-medium">{r.title}</span>
                    <span className="text-xs text-gray-500 mt-0.5">{r.description}</span>
                  </Link>
                ))}
              </div>
            )}
            {query && results.length === 0 && (
              <p className="px-4 py-3 text-sm text-gray-500 border-t border-gray-100 dark:border-gray-800">
                No results for "{query}"
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
```

**Step 7: Add SearchModal to Header**

In `src/components/Header.tsx`, import and add `<SearchModal />` next to `<ThemeToggle />`:
```typescript
import SearchModal from './SearchModal'
// ...
<SearchModal />
<ThemeToggle />
```

**Step 8: Verify in browser**

Click the search icon — modal opens. Type "simplicity" — post appears. Press Escape — modal closes.

**Step 9: Commit**

```bash
git add src/lib/search.ts src/lib/search.test.ts src/app/api/ src/components/SearchModal.tsx src/components/Header.tsx
git commit -m "feat: client-side search with Fuse.js"
```

---

### Task 14: Final polish and deploy setup

**Files:**
- Modify: `next.config.mjs`
- Create: `.gitignore` (if not present)

**Step 1: Run all tests**

```bash
npm test
```
Expected: All tests pass.

**Step 2: Run production build**

```bash
npm run build
```
Expected: Build succeeds with no errors.

**Step 3: Check next.config.mjs**

Ensure it is:
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {}
export default nextConfig
```

**Step 4: Push to GitHub**

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

**Step 5: Deploy to Vercel**

1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Accept all defaults (Next.js is auto-detected)
4. Click Deploy

Expected: Site live at `https://your-repo.vercel.app`

**Step 6: Final commit if any polish needed**

```bash
git add -A
git commit -m "chore: final polish and deploy config"
git push
```

---

## Summary

| Task | What it builds |
|---|---|
| 1 | Next.js + all dependencies initialized |
| 2 | Tailwind + typography configured |
| 3 | Content reading utilities (`getAllPosts`, `getPostBySlug`) |
| 4 | Header + dark mode toggle |
| 5 | Root layout with ThemeProvider |
| 6 | PostCard component |
| 7 | Home page |
| 8 | Writing listing page |
| 9 | Individual post page with MDX rendering |
| 10 | Notes listing + detail pages |
| 11 | Projects page |
| 12 | About page |
| 13 | Client-side search with Fuse.js |
| 14 | Tests + build + deploy to Vercel |
