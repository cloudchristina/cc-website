import { getAllPosts } from '@/lib/content'
import PostCard from '@/components/PostCard'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Writing' }

export default async function WritingPage() {
  const posts = await getAllPosts('writing')
  return (
    <div>
      <div className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-[#2563eb] dark:text-[#60a5fa] mb-1">
          All posts
        </p>
        <h1 className="text-3xl font-bold text-[#111827] dark:text-[#f1f5f9]">Writing</h1>
      </div>
      <div>
        {posts.map(post => (
          <PostCard key={post.slug} post={post} basePath="writing" />
        ))}
        {posts.length === 0 && (
          <p className="text-[#6b7280]">No posts yet.</p>
        )}
      </div>
    </div>
  )
}
