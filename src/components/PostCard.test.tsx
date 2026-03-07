import { render, screen } from '@testing-library/react'
import PostCard from './PostCard'

// Mock next/link to render a plain <a> tag
jest.mock('next/link', () => {
  return function MockLink({ href, children, ...props }: any) {
    return <a href={href} {...props}>{children}</a>
  }
})

const post = {
  slug: 'my-post',
  title: 'My Post',
  date: '2026-01-15',
  description: 'A great post about things',
  tags: ['ml', 'systems'],
  published: true,
}

describe('PostCard', () => {
  it('renders title as a link', () => {
    render(<PostCard post={post} basePath="writing" />)
    const link = screen.getByRole('link', { name: 'My Post' })
    expect(link).toHaveAttribute('href', '/writing/my-post')
  })

  it('renders formatted date', () => {
    render(<PostCard post={post} basePath="writing" />)
    expect(screen.getByText(/jan/i)).toBeInTheDocument()
  })

  it('renders description', () => {
    render(<PostCard post={post} basePath="writing" />)
    expect(screen.getByText('A great post about things')).toBeInTheDocument()
  })
})
