import Link from 'next/link'
import ThemeToggle from './ThemeToggle'
import SearchModal from './SearchModal'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blogs', label: 'Blogs' },
  { href: '/projects', label: 'Projects' },
  { href: '/about', label: 'About' },
]

export default function Header() {
  return (
    <header className="py-5 border-b border-[#e2e8f0] dark:border-[#1e293b] bg-[#f7fafb] dark:bg-[#0f1117]">
      <div className="max-w-2xl mx-auto px-4 flex items-center justify-between">
        <Link
          href="/"
          aria-label="home"
          className="font-semibold text-sm tracking-tight text-[#111827] dark:text-[#f1f5f9] hover:text-[#374151] dark:hover:text-white transition-colors"
        >
          Christina Chen
        </Link>
        <nav className="flex items-center gap-5">
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm text-[#6b7280] dark:text-[#94a3b8] hover:text-[#111827] dark:hover:text-[#f1f5f9] transition-colors font-medium"
            >
              {link.label}
            </Link>
          ))}
          <SearchModal />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
