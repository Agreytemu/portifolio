import { useEffect, useMemo, useState } from 'react'
import type { TerminalLine } from '../types'

interface Step {
  line: number
  chars: number
}

/** One step per typed character, a short pause after each command, output lines appear at once. */
function buildSteps(lines: readonly TerminalLine[]): Step[] {
  const steps: Step[] = [{ line: -1, chars: 0 }]

  lines.forEach((line, index) => {
    if (line.kind === 'command') {
      for (let chars = 1; chars <= line.text.length; chars++) steps.push({ line: index, chars })
      for (let pause = 0; pause < 8; pause++) steps.push({ line: index, chars: line.text.length })
    } else {
      steps.push({ line: index, chars: line.text.length })
      steps.push({ line: index, chars: line.text.length })
    }
  })

  return steps
}

export interface TypedLine extends TerminalLine {
  /** False for the line that is still being typed. */
  complete: boolean
}

export function useTypewriter(
  lines: readonly TerminalLine[],
  start: boolean,
  instant: boolean,
): { visible: TypedLine[]; done: boolean } {
  const steps = useMemo(() => buildSteps(lines), [lines])
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!start || instant) return

    const id = window.setInterval(() => {
      setIndex((current) => {
        if (current >= steps.length - 1) {
          window.clearInterval(id)
          return current
        }
        return current + 1
      })
    }, 34)

    return () => window.clearInterval(id)
  }, [start, instant, steps])

  const done = instant || index >= steps.length - 1
  const step: Step = done ? { line: lines.length - 1, chars: Number.POSITIVE_INFINITY } : steps[index]

  const visible = lines.slice(0, step.line + 1).map((line, i): TypedLine => {
    const typing = i === step.line && !done && line.kind === 'command' && step.chars < line.text.length
    return typing ? { ...line, text: line.text.slice(0, step.chars), complete: false } : { ...line, complete: true }
  })

  return { visible, done }
}
