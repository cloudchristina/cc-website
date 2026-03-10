'use client'

import Script from 'next/script'
import { useTheme } from 'next-themes'

interface Props {
  children: string
}

export default function Mermaid({ children }: Props) {
  const { resolvedTheme } = useTheme()

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          // @ts-expect-error mermaid is loaded globally from CDN
          window.mermaid?.initialize({
            startOnLoad: true,
            theme: resolvedTheme === 'dark' ? 'dark' : 'neutral',
            fontFamily: 'inherit',
          })
          // @ts-expect-error mermaid is loaded globally from CDN
          window.mermaid?.run()
        }}
      />
      <div className="mermaid my-6 flex justify-center overflow-x-auto">
        {children.trim()}
      </div>
    </>
  )
}
