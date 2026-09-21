import type { ArchitectureNode } from '../types'

interface SystemOverviewProps {
  nodes: ArchitectureNode[]
}

function Connector() {
  return (
    <span
      aria-hidden="true"
      className="relative mx-auto block h-5 w-px bg-line-strong after:absolute after:-bottom-px after:left-1/2 after:-translate-x-1/2 after:border-x-[4px] after:border-t-[5px] after:border-x-transparent after:border-t-line-strong"
    />
  )
}

/** A connected request path, top to bottom. Pure HTML and CSS. */
export function SystemOverview({ nodes }: SystemOverviewProps) {
  return (
    <ol aria-label="System overview, from the client to payments">
      {nodes.map((node, index) => (
        <li key={node.layer}>
          {index > 0 && <Connector />}
          <div className="rounded-md border border-line bg-canvas px-3 py-2.5 shadow-panel">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
              <span className="flex items-baseline gap-2 text-[13px] font-medium text-fg">
                <span aria-hidden="true" className="font-mono text-[11px] font-normal text-faint">
                  {String(index + 1).padStart(2, '0')}
                </span>
                {node.layer}
              </span>
              <span className="font-mono text-xs text-accent">{node.label}</span>
            </div>
            <p className="mt-1 text-[13px] leading-snug text-muted">{node.detail}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}
