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
