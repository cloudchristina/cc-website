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
