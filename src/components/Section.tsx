import type { ReactNode } from 'react'
import { cn } from '../lib/cn'
import { Container } from './Container'

interface SectionProps {
  id: string
  headingId: string
  children: ReactNode
  className?: string
}

export function Section({ id, headingId, children, className }: SectionProps) {
  return (
    <section id={id} aria-labelledby={headingId} className={cn('py-10 md:py-14', className)}>
      <Container>{children}</Container>
    </section>
  )
}
