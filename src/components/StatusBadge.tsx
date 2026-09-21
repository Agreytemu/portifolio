import type { ReactNode } from 'react'
import type { Tone } from '../types'
import { cn } from '../lib/cn'
import { toneStyles } from '../lib/tones'

interface StatusBadgeProps {
  tone?: Tone
  pulse?: boolean
  children: ReactNode
  className?: string
}

export function StatusBadge({ tone = 'neutral', pulse = false, children, className }: StatusBadgeProps) {
  const style = toneStyles[tone]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-medium',
        style.wrap,
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn('h-1.5 w-1.5 rounded-full', style.dot, pulse && 'motion-safe:animate-pulse')}
      />
      {children}
    </span>
  )
}
