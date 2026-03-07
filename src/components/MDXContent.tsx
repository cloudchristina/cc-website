import { MDXRemote } from 'next-mdx-remote/rsc'
import { MermaidPre } from './MDXComponents'
import remarkGfm from 'remark-gfm'

interface Props {
  source: string
}

export default function MDXContent({ source }: Props) {
  return (
    <article className="prose dark:prose-invert max-w-none
      prose-headings:text-[#111827] dark:prose-headings:text-[#f1f5f9] prose-headings:font-semibold prose-headings:tracking-tight
      prose-p:text-[#374151] dark:prose-p:text-[#cbd5e1] prose-p:leading-relaxed
      prose-a:text-[#2563eb] dark:prose-a:text-[#60a5fa] prose-a:no-underline hover:prose-a:underline
      prose-code:before:content-none prose-code:after:content-none
      prose-code:bg-transparent prose-code:text-inherit
      prose-code:px-0 prose-code:py-0 prose-code:font-mono
      prose-pre:bg-[#f8fafc] dark:prose-pre:bg-[#0f172a]
      prose-pre:text-[#374151] dark:prose-pre:text-[#cbd5e1]
      prose-pre:border prose-pre:border-[#e2e8f0] dark:prose-pre:border-[#1e293b]
      prose-blockquote:border-l-[#d1d5db] dark:prose-blockquote:border-l-[#374151] prose-blockquote:text-[#6b7280]
      prose-strong:text-[#111827] dark:prose-strong:text-[#f1f5f9]
      prose-hr:border-[#e5e7eb] dark:prose-hr:border-[#1e293b]">
      <MDXRemote
        source={source}
        components={{ pre: MermaidPre as never }}
        options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
      />
    </article>
  )
}
