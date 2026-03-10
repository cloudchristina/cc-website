'use client'
import { useState, useEffect, useRef } from 'react'
import { SearchItem, searchPosts } from '@/lib/search'
import Link from 'next/link'

export default function SearchModal() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [index, setIndex] = useState<SearchItem[]>([])
  const [results, setResults] = useState<SearchItem[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open && index.length === 0) {
      fetch('/api/search').then(r => r.json()).then(setIndex)
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  useEffect(() => {
    setResults(searchPosts(query, index))
  }, [query, index])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [])

  return (
    <>
      <button onClick={() => setOpen(true)} aria-label="Search"
        className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 px-4">
          <div className="absolute inset-0 bg-black/40 dark:bg-black/60" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1a1a1a] rounded-lg shadow-xl border border-gray-200 dark:border-gray-700">
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search posts and notes..."
              className="w-full px-4 py-3 bg-transparent outline-none text-sm"
            />
            {results.length > 0 && (
              <div className="border-t border-gray-100 dark:border-gray-800 max-h-80 overflow-y-auto">
                {results.map(r => (
                  <Link key={`${r.basePath}/${r.slug}`} href={`/${r.basePath}/${r.slug}`}
                    onClick={() => { setOpen(false); setQuery('') }}
                    className="flex flex-col px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-50 dark:border-gray-800 last:border-0">
                    <span className="text-sm font-medium">{r.title}</span>
                    <span className="text-xs text-gray-500 mt-0.5">{r.description}</span>
                  </Link>
                ))}
              </div>
            )}
            {query && results.length === 0 && (
              <p className="px-4 py-3 text-sm text-gray-500 border-t border-gray-100 dark:border-gray-800">
                No results for &quot;{query}&quot;
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}
