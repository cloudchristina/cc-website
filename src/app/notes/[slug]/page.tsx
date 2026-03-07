import { getAllPosts, getPostBySlug } from '@/lib/content'
import MDXContent from '@/components/MDXContent'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const notes = await getAllPosts('notes')
  return notes.map(n => ({ slug: n.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const notes = await getAllPosts('notes')
  const note = notes.find(n => n.slug === slug)
  if (!note) return {}
  return { title: note.title, description: note.description }
}

export default async function NotePage({ params }: Props) {
  const { slug } = await params
  let note
  try {
    note = await getPostBySlug('notes', slug)
  } catch {
    notFound()
  }

  const formatted = new Date(note.date + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{note.title}</h1>
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <time>{formatted}</time>
          {note.tags.length > 0 && (
            <span className="flex gap-2">
              {note.tags.map(tag => (
                <span key={tag} className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-xs">
                  {tag}
                </span>
              ))}
            </span>
          )}
        </div>
      </header>
      <MDXContent source={note.content} />
    </div>
  )
}
