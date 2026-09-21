interface SectionHeadingProps {
  id: string
  title: string
  count?: number | string
  description?: string
}

export function SectionHeading({ id, title, count, description }: SectionHeadingProps) {
  return (
    <div className="mb-5 md:mb-6">
      <h2 id={id} className="flex items-center gap-2.5 text-[1.375rem] font-semibold leading-tight tracking-[-0.015em]">
        {title}
        {count !== undefined && (
          <span className="rounded-full border border-line bg-raised px-2 py-0.5 font-mono text-xs font-normal text-muted">
            {count}
          </span>
        )}
      </h2>
      {description && <p className="mt-1 text-sm text-muted">{description}</p>}
    </div>
  )
}
