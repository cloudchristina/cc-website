import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = { title: 'About' }

export default function AboutPage() {
  return (
    <div className="space-y-10">

      {/* ── Profile ── */}
      <div className="flex items-start gap-8">
        <Image
          src="/profile.jpeg"
          alt="Christina Chen"
          width={100}
          height={100}
          className="rounded-full object-cover ring-2 ring-[#e5e7eb] dark:ring-[#1e293b] shadow-sm shrink-0"
        />
        <div>
          <h1 className="text-3xl font-bold text-[#111827] dark:text-[#f1f5f9] mb-1">Christina Chen</h1>
          <p className="text-sm text-[#6b7280] dark:text-[#94a3b8]">DevOps Engineer · Builder</p>
        </div>
      </div>

      {/* ── Story ── */}
      <div className="space-y-3 text-[#374151] dark:text-[#cbd5e1] leading-relaxed">
        <p>I build on AWS and Kubernetes, and I&apos;m drawn to automation and GenAI.</p>
        <p>This site is where I share what I&apos;m figuring out.</p>
      </div>

    </div>
  )
}
