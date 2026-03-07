import { getAllPosts, getPostBySlug } from './content'

describe('getAllPosts', () => {
  it('returns posts sorted by date descending', async () => {
    const posts = await getAllPosts('writing')
    expect(posts.length).toBeGreaterThan(0)
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
