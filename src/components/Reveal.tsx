import type { ReactNode } from 'react'
import { m } from 'framer-motion'

interface RevealProps {
  children: ReactNode
  className?: string
}

/** A short fade and 8px rise the first time a block scrolls into view. Nothing loops. */
export function Reveal({ children, className }: RevealProps) {
  return (
    <m.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
    >
      {children}
    </m.div>
  )
}
