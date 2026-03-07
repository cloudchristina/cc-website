import { getAllPosts, getPostBySlug } from '@/lib/content'
import MDXContent from '@/components/MDXContent'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const posts = await getAllPosts('writing')
  return posts.map(p => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const posts = await getAllPosts('writing')
  const post = posts.find(p => p.slug === slug)
  if (!post) return {}
  return { title: post.title, description: post.description }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  let post
  try {
    post = await getPostBySlug('writing', slug)
  } catch {
    notFound()
  }

  const formatted = new Date(post.date + 'T00:00:00').toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold text-[#111827] dark:text-[#f1f5f9]">{post.title}</h1>
        <div className="flex items-center gap-3 text-sm text-[#6b7280] dark:text-[#94a3b8]">
          <time>{formatted}</time>
          {post.tags.length > 0 && (
            <span className="flex gap-2 flex-wrap">
              {post.tags.map(tag => (
                <span key={tag} className="bg-[#f3f4f6] dark:bg-[#1e293b] text-[#6b7280] dark:text-[#94a3b8] rounded px-2 py-0.5 text-xs">
                  {tag}
                </span>
              ))}
            </span>
          )}
        </div>
      </header>
      <MDXContent source={post.content} />
    </div>
  )
}
