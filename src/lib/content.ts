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
  link?: string
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
      link: data.link,
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
    link: data.link,
    content,
  }
}
