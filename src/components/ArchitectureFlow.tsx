import type { ArchitectureNode } from '../types'

interface ArchitectureFlowProps {
  nodes: ArchitectureNode[]
}

/** A layered view of how a project is put together. Layers are grouped, not ordered. */
export function ArchitectureFlow({ nodes }: ArchitectureFlowProps) {
  return (
    <ul className="space-y-2">
      {nodes.map((node) => (
        <li
          key={node.layer}
          className="grid gap-x-4 gap-y-0.5 rounded-md border border-line bg-canvas px-3 py-2.5 sm:grid-cols-[5rem_minmax(0,1fr)]"
        >
          <span className="font-mono text-xs text-muted sm:pt-0.5">{node.layer}</span>
          <div className="min-w-0">
            <p className="font-mono text-[13px] text-fg">{node.label}</p>
            <p className="mt-0.5 text-[13px] leading-snug text-muted">{node.detail}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
