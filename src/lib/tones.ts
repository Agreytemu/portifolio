import type { Tone } from '../types'

export const toneStyles: Record<Tone, { wrap: string; dot: string; text: string }> = {
  accent: { wrap: 'border-accent/30 bg-accent/10 text-accent', dot: 'bg-accent', text: 'text-accent' },
  warn: { wrap: 'border-warn/30 bg-warn/10 text-warn', dot: 'bg-warn', text: 'text-warn' },
  info: { wrap: 'border-info/30 bg-info/10 text-info', dot: 'bg-info', text: 'text-info' },
  neutral: { wrap: 'border-line-strong bg-raised text-soft', dot: 'bg-muted', text: 'text-soft' },
}
