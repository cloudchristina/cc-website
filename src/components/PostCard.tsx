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
    <article className="py-6 border-b border-[#e2e8f0] dark:border-[#1e293b] last:border-0">
      <div className="flex items-baseline justify-between gap-4">
        <Link
          href={`/${basePath}/${post.slug}`}
          className="font-semibold text-[#111827] dark:text-[#f1f5f9] hover:text-[#374151] dark:hover:text-white transition-colors"
        >
          {post.title}
        </Link>
        <time className="text-sm text-[#9ca3af] dark:text-[#6b7280] shrink-0">
          {formatted}
        </time>
      </div>
      {post.description && (
        <p className="mt-1.5 text-sm text-[#6b7280] dark:text-[#94a3b8] leading-relaxed">
          {post.description}
        </p>
      )}
      {post.tags && post.tags.length > 0 && (
        <div className="mt-3 flex gap-2 flex-wrap">
          {post.tags.map(tag => (
            <span
              key={tag}
              className="text-xs bg-[#f3f4f6] dark:bg-[#1e293b] text-[#6b7280] dark:text-[#94a3b8] rounded px-2 py-0.5"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  )
}
