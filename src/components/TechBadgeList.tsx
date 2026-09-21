import { cn } from '../lib/cn'

interface TechBadgeListProps {
  items: readonly string[]
  label: string
  size?: 'sm' | 'md'
  highlight?: readonly string[]
  /** Optional hover text per item. */
  titles?: Readonly<Record<string, string>>
  className?: string
}

export function TechBadgeList({ items, label, size = 'md', highlight, titles, className }: TechBadgeListProps) {
  return (
    <ul aria-label={label} className={cn('flex flex-wrap content-start gap-1.5', className)}>
      {items.map((item) => (
        <li
          key={item}
          title={titles?.[item]}
          className={cn(
            'rounded border font-mono',
            size === 'sm' ? 'px-1.5 py-0.5 text-[11.5px]' : 'px-2 py-1 text-xs',
            highlight?.includes(item) ? 'border-accent/40 bg-accent/10 text-accent' : 'border-line bg-canvas text-soft',
          )}
        >
          {item}
        </li>
      ))}
    </ul>
  )
}
