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
