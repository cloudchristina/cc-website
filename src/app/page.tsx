import { getAllPosts } from '@/lib/content'
import PostCard from '@/components/PostCard'
import Link from 'next/link'
import Image from 'next/image'

export default async function Home() {
  const posts = await getAllPosts('writing')
  const recent = posts.slice(0, 5)

  return (
    <div className="space-y-14">

      {/* ── Hero ── */}
      <section className="rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50/50 dark:from-[#131720] dark:via-[#0f1117] dark:to-[#1a2035] px-8 pt-10 pb-10 text-center shadow-sm border border-[#e5e7eb]/60 dark:border-[#1e293b]">
        <div className="relative inline-block mb-6">
          <Image
            src="/profile.jpeg"
            alt="Christina Chen"
            width={260}
            height={260}
            className="rounded-full object-cover shadow-2xl ring-4 ring-white dark:ring-[#1e293b]"
            priority
          />
          <span className="absolute bottom-3 right-3 w-5 h-5 bg-green-400 border-2 border-white dark:border-[#0f1117] rounded-full" title="Open to opportunities" />
        </div>

        <h1 className="text-4xl font-bold mb-2 text-[#111827] dark:text-[#f1f5f9] leading-tight">
          Hi, I&apos;m Christina
        </h1>
        <p className="text-base font-medium text-[#6b7280] dark:text-[#94a3b8] mb-3 tracking-wide">
          A Builder
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <a
            href="https://github.com/cloudchristina"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#111827] dark:bg-[#f1f5f9] text-white dark:text-[#111827] text-sm font-medium rounded-lg hover:bg-[#374151] dark:hover:bg-white transition-colors shadow-sm"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            GitHub
          </a>
          <a
            href="https://www.linkedin.com/in/christina-cloud/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#e5e7eb] dark:border-[#374151] text-[#374151] dark:text-[#cbd5e1] text-sm font-medium rounded-lg hover:bg-[#f9fafb] dark:hover:bg-[#1e293b] transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
            LinkedIn
          </a>
          <Link
            href="/blogs"
            className="inline-flex items-center gap-1 px-5 py-2.5 border border-[#e5e7eb] dark:border-[#374151] text-[#374151] dark:text-[#cbd5e1] text-sm font-medium rounded-lg hover:bg-[#f9fafb] dark:hover:bg-[#1e293b] transition-colors"
          >
            Writing →
          </Link>
        </div>
      </section>

      {/* ── Tech Stack ── */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af] dark:text-[#6b7280] mb-5">
          Tech Stack
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: 'Cloud',      icons: 'aws,gcp',              src: null, desc: 'AWS · GCP (learning)' },
            { label: 'Containers', icons: 'kubernetes,docker',    src: null, desc: 'Kubernetes · Docker' },
            { label: 'IaC',        icons: 'terraform,cloudformation', src: null, desc: 'Terraform · CloudFormation' },
            { label: 'CI/CD',      icons: 'github,githubactions,jenkins', src: null, desc: 'GitHub Actions · Jenkins' },
            { label: 'Scripting',  icons: 'bash,py',              src: null, desc: 'Bash · Python' },
            { label: 'OS',         icons: 'linux,windows',        src: null, desc: 'Linux · Windows' },
            { label: 'AI / GenAI', icons: null, src: '/bedrock.svg', desc: 'AWS Bedrock · LLMs' },
            { label: 'Agile',      icons: null, src: null,         desc: 'Scrum · Kanban' },
          ].map(({ label, icons, src, desc }) => (
            <div
              key={label}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-white dark:bg-[#131720] border border-[#e5e7eb] dark:border-[#1e293b] hover:border-[#d1d5db] dark:hover:border-[#374151] transition-colors"
            >
              {icons ? (
                <img
                  src={`https://skillicons.dev/icons?i=${icons}&perline=2`}
                  alt={desc}
                  className="h-10"
                />
              ) : src ? (
                <img src={src} alt={desc} className="h-10 w-10 object-contain" />
              ) : (
                <div className="h-10 flex items-center justify-center">
                  <svg className="w-9 h-9 text-[#6b7280] dark:text-[#94a3b8]" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                  </svg>
                </div>
              )}
              <span className="text-xs font-medium text-[#374151] dark:text-[#94a3b8]">{label}</span>
              <span className="text-[10px] text-[#9ca3af] dark:text-[#6b7280] text-center leading-tight">{desc}</span>
            </div>
          ))}
        </div>
      </section>

{/* ── Recent Writing ── */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-[#9ca3af] dark:text-[#6b7280]">
            Recent Writing
          </h2>
          <Link
            href="/blogs"
            className="text-sm text-[#6b7280] hover:text-[#111827] dark:text-[#94a3b8] dark:hover:text-[#f1f5f9] transition-colors"
          >
            All →
          </Link>
        </div>
        <div>
          {recent.map(post => (
            <PostCard key={post.slug} post={post} basePath="blogs" />
          ))}
        </div>
      </section>

    </div>
  )
}
