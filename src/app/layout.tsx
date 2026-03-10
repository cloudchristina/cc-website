import type { Metadata } from 'next'
import { Merriweather, Raleway } from 'next/font/google'
import './globals.css'
import Providers from '@/components/Providers'
import Header from '@/components/Header'

const merriweather = Merriweather({ subsets: ['latin'], weight: ['400', '700'], variable: '--font-merriweather' })
const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway' })

export const metadata: Metadata = {
  title: { default: 'cloudchristina', template: '%s | cloudchristina' },
  description: 'Technical writing, reflections, and notes.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${merriweather.variable} ${raleway.variable}`}>
      <body>
        <Providers>
          <Header />
          <main className="max-w-2xl mx-auto px-4 py-8 sm:py-14">
            {children}
          </main>
          <footer className="max-w-2xl mx-auto px-4 py-8 mt-16 border-t border-[#e2e8f0] dark:border-[#1e293b] text-xs text-[#9ca3af] dark:text-[#6b7280] flex items-center justify-between gap-4">
            <span>© {new Date().getFullYear()} Christina Chen. All rights reserved.</span>
            <nav className="flex items-center gap-4">
              <a href="https://github.com/cloudchristina" target="_blank" rel="noopener noreferrer" className="hover:text-[#374151] dark:hover:text-[#94a3b8] transition-colors">GitHub</a>
              <a href="https://www.linkedin.com/in/christina-cloud/" target="_blank" rel="noopener noreferrer" className="hover:text-[#374151] dark:hover:text-[#94a3b8] transition-colors">LinkedIn</a>
            </nav>
          </footer>
        </Providers>
      </body>
    </html>
  )
}
