'use client'

import Mermaid from './Mermaid'
import type { ReactElement } from 'react'

export default function MermaidPre({ children, ...props }: { children?: ReactElement }) {
  const code = children as ReactElement<{ className?: string; children?: string }>
  if (code?.props?.className === 'language-mermaid') {
    return <Mermaid>{code.props.children ?? ''}</Mermaid>
  }
  return <pre {...props}>{children}</pre>
}
