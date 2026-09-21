import { cn } from '../lib/cn'

interface AvatarProps {
  name: string
  src?: string
  size: 'sm' | 'lg'
  priority?: boolean
}

const sizes = {
  sm: 'h-8 w-8 text-xs',
  lg: 'h-24 w-24 text-3xl sm:h-32 sm:w-32 sm:text-4xl',
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export function Avatar({ name, src, size, priority = false }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={`Portrait of ${name}`}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        className={cn('shrink-0 rounded-full object-cover ring-1 ring-line-strong', sizes[size])}
      />
    )
  }

  return (
    <span
      role="img"
      aria-label={`${name} (avatar placeholder)`}
      className={cn(
        'inline-flex shrink-0 items-center justify-center rounded-full bg-raised font-mono font-semibold text-accent ring-1 ring-line-strong',
        sizes[size],
      )}
    >
      {initials(name)}
    </span>
  )
}
