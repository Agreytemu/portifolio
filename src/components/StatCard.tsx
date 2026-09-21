interface StatCardProps {
  label: string
  value: string | number
  hint: string
}

/** Must be rendered inside a <dl>. */
export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="rounded-lg border border-line bg-surface p-4 shadow-panel">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 font-mono text-2xl font-semibold tabular-nums">{value}</dd>
      <p className="mt-1 text-xs text-muted">{hint}</p>
    </div>
  )
}
