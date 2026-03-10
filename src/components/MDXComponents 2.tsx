'use client'

import dynamic from 'next/dynamic'

export const MermaidPre = dynamic(() => import('./MermaidPre'), {
  ssr: false,
  loading: () => <pre className="text-sm text-gray-400">Loading diagram...</pre>,
})
