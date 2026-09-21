import { Terminal as TerminalIcon } from 'lucide-react'
import { useInView } from '../hooks/useInView'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { useTypewriter } from '../hooks/useTypewriter'
import type { TerminalLine } from '../types'

interface TerminalProps {
  lines: readonly TerminalLine[]
}

const LINE_REM = 1.75

function Cursor() {
  return (
    <span
      aria-hidden="true"
      className="ml-0.5 inline-block h-[1.05em] w-[0.55em] translate-y-[0.18em] bg-accent motion-safe:animate-blink"
    />
  )
}

export function Terminal({ lines }: TerminalProps) {
  const [ref, inView] = useInView<HTMLDivElement>(0.4)
  const reduced = usePrefersReducedMotion()
  const { visible, done } = useTypewriter(lines, inView, reduced)

  const lastIndex = visible.length - 1
  const transcript = lines.map((line) => (line.kind === 'command' ? `$ ${line.text}` : line.text)).join('\n')

  return (
    <div ref={ref} className="min-w-0 overflow-hidden rounded-lg border border-line bg-canvas">
      <div className="flex items-center gap-2 border-b border-line bg-surface px-3 py-2 font-mono text-xs text-muted">
        <TerminalIcon size={14} aria-hidden="true" />
        ~/agrey-temu
      </div>

      {/* Screen readers get the full transcript; the animated copy is hidden from them. */}
      <pre className="sr-only">{transcript}</pre>

      <div
        aria-hidden="true"
        className="px-4 py-4 font-mono text-sm sm:px-5"
        style={{ minHeight: `${(lines.length + 1) * LINE_REM + 2}rem`, lineHeight: `${LINE_REM}rem` }}
      >
        {visible.map((line, index) => (
          <div key={index} className="flex gap-2 break-words">
            {line.kind === 'command' && <span className="select-none text-accent">$</span>}
            <span className={line.kind === 'command' ? 'text-fg' : 'text-muted'}>
              {line.text}
              {!done && index === lastIndex && <Cursor />}
            </span>
          </div>
        ))}
        {done && (
          <div className="flex gap-2">
            <span className="select-none text-accent">$</span>
            <Cursor />
          </div>
        )}
      </div>
    </div>
  )
}
