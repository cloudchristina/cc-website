import { getAllPosts, PostMeta } from '@/lib/content'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Projects' }

interface ProjectMeta extends PostMeta {
  link?: string
}

export default async function ProjectsPage() {
  const projects = await getAllPosts('projects') as ProjectMeta[]
  return (
    <div>
      <h1 className="text-2xl font-semibold mb-8">Projects</h1>
      <div className="space-y-8">
        {projects.map(p => (
          <div key={p.slug} className="border-b border-gray-100 dark:border-gray-800 pb-8 last:border-0">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="font-medium">{p.title}</h2>
              {p.link && (
                <a href={p.link} target="_blank" rel="noopener noreferrer"
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
