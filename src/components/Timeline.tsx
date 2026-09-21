import { cn } from '../lib/cn'
import type { JourneyItem } from '../types'
import { StatusBadge } from './StatusBadge'

interface TimelineProps {
  items: JourneyItem[]
}

export function Timeline({ items }: TimelineProps) {
  return (
    <ol>
      {items.map((item, index) => (
        <li key={item.id} className="relative pb-8 pl-9 last:pb-0">
          {index < items.length - 1 && (
            <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-5 w-px bg-line" />
          )}
          <span
            aria-hidden="true"
            className={cn(
              'absolute left-0 top-1 h-[15px] w-[15px] rounded-full border-2',
              item.current ? 'border-accent bg-accent/30' : 'border-line-strong bg-canvas',
            )}
          />
          <h3 className="flex flex-wrap items-center gap-2 font-semibold">
            {item.title}
            {item.current && <StatusBadge tone="accent">Now</StatusBadge>}
          </h3>
          <p className="mt-1 max-w-[52ch] text-sm text-muted">{item.description}</p>
        </li>
      ))}
    </ol>
  )
}
