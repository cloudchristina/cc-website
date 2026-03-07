import { searchPosts } from './search'

const samplePosts = [
  { slug: 'ml-systems', title: 'ML Systems at Scale', description: 'How to build ML systems', tags: ['ml'], basePath: 'writing' },
  { slug: 'simplicity', title: 'On Simplicity', description: 'Why simplicity matters', tags: ['design'], basePath: 'writing' },
]

describe('searchPosts', () => {
  it('finds posts by title', () => {
    const results = searchPosts('simplicity', samplePosts)
    expect(results.some(r => r.slug === 'simplicity')).toBe(true)
  })

  it('returns empty array for no match', () => {
    const results = searchPosts('zzznomatch', samplePosts)
    expect(results).toHaveLength(0)
  })

  it('is case insensitive', () => {
    const results = searchPosts('ML', samplePosts)
    expect(results.some(r => r.slug === 'ml-systems')).toBe(true)
  })
})
