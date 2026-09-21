import { useEffect, useMemo, useRef, useState } from 'react'
import { formatDay, getMonthLabels } from '../lib/activity'
import { cn } from '../lib/cn'
import type { ActivityData, ActivityLevel } from '../types'
import { StatusBadge } from './StatusBadge'

const levelClasses: Record<ActivityLevel, string> = {
  0: 'bg-raised ring-1 ring-inset ring-white/[0.04]',
  1: 'bg-accent/25',
  2: 'bg-accent/50',
  3: 'bg-accent/75',
  4: 'bg-accent',
}

const levels: ActivityLevel[] = [0, 1, 2, 3, 4]
const dayLabels = ['', 'Mon', '', 'Wed', '', 'Fri', '']

// Cell size is a CSS variable so phones get a tighter grid without any JavaScript.
const CELL = 'var(--cell)'
const STEP = 'calc(var(--cell) + var(--gap))'

interface TooltipState {
  left: number
  top: number
  date: string
  level: ActivityLevel
}

interface ActivityGraphProps {
  activity: ActivityData
}

export function ActivityGraph({ activity }: ActivityGraphProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [tip, setTip] = useState<TooltipState | null>(null)

  const { weeks } = activity
  const isDemo = activity.source === 'demo'
  const monthLabels = useMemo(() => getMonthLabels(weeks), [weeks])
  const activeDays = useMemo(() => weeks.flat().filter((day) => day.level > 0).length, [weeks])

  // Start scrolled to the most recent weeks.
  useEffect(() => {
    const element = scrollRef.current
    if (element) element.scrollLeft = element.scrollWidth
  }, [weeks])

  const showTip = (target: EventTarget) => {
    const card = cardRef.current
    const cell = target instanceof HTMLElement ? target.closest<HTMLElement>('[data-date]') : null
    if (!card || !cell) {
      setTip(null)
      return
    }
    const cellBox = cell.getBoundingClientRect()
    const cardBox = card.getBoundingClientRect()
    const half = 92
    setTip({
      left: Math.min(Math.max(cellBox.left - cardBox.left + cellBox.width / 2, half), cardBox.width - half),
      top: cellBox.top - cardBox.top,
      date: cell.dataset.date ?? '',
      level: Number(cell.dataset.level) as ActivityLevel,
    })
  }

  return (
    <div ref={cardRef} className="relative min-w-0 rounded-lg border border-line bg-surface shadow-panel">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2 border-b border-line px-4 py-3.5">
        <div>
          <h3 className="text-sm font-semibold">{activity.title}</h3>
          <p className="mt-1 text-[13px] text-muted">
            <span className="font-mono text-soft">{activeDays}</span> active days across {weeks.length} weeks
          </p>
        </div>
        <StatusBadge tone={isDemo ? 'warn' : 'accent'}>{activity.badge}</StatusBadge>
      </div>

      <div
        ref={scrollRef}
        role="region"
        aria-label="Activity graph, scrollable"
        tabIndex={0}
        onScroll={() => setTip(null)}
        className="scroll-thin overflow-x-auto px-4 pb-3 pt-4"
      >
        <div
          role="img"
          aria-label={`${activity.title}: ${activeDays} active days across ${weeks.length} weeks. ${activity.note}`}
          className="flex w-max gap-2 text-[11px] leading-none text-muted [--cell:12px] [--gap:3px] md:[--cell:15px]"
        >
          <div
            aria-hidden="true"
            className="grid pt-[18px]"
            style={{ gridTemplateRows: `repeat(7, ${CELL})`, rowGap: 'var(--gap)' }}
          >
            {dayLabels.map((label, index) => (
              <span key={index} className="flex items-center">
                {label}
              </span>
            ))}
          </div>

          <div aria-hidden="true">
            <div className="relative mb-1.5 h-3" style={{ width: `calc(${weeks.length} * ${STEP})` }}>
              {monthLabels.map((month) => (
                <span key={month.column} className="absolute top-0" style={{ left: `calc(${month.column} * ${STEP})` }}>
                  {month.label}
                </span>
              ))}
            </div>
            <div
              className="grid grid-flow-col"
              style={{ gridTemplateRows: `repeat(7, ${CELL})`, gridAutoColumns: CELL, gap: 'var(--gap)' }}
              onPointerOver={(event) => showTip(event.target)}
              onPointerLeave={() => setTip(null)}
              onClick={(event) => showTip(event.target)}
            >
              {weeks.flatMap((week) =>
                week.map((day) => (
                  <span
                    key={day.date}
                    data-date={day.date}
                    data-level={day.level}
                    className={cn(
                      'rounded-[3px] transition-shadow duration-100 hover:ring-1 hover:ring-inset hover:ring-white/60',
                      levelClasses[day.level],
                    )}
                  />
                )),
              )}
            </div>
          </div>
        </div>
      </div>

      {tip && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-md border border-line-strong bg-raised px-2.5 py-1.5 text-xs shadow-panel-hover"
          style={{ left: tip.left, top: tip.top - 8 }}
        >
          <p className="font-medium text-fg">{formatDay(tip.date)}</p>
          <p className="mt-0.5 text-muted">
            {tip.level === 0 ? 'No activity' : `Level ${tip.level} of 4`}
            {isDemo && ' · sample data'}
          </p>
        </div>
      )}

      <div className="space-y-3 border-t border-line px-4 py-3.5 text-xs text-muted">
        <p className="md:hidden">Swipe sideways to see earlier weeks.</p>
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p className="max-w-[60ch] leading-relaxed">{activity.note}</p>
          <div className="flex items-center gap-1.5" aria-hidden="true">
            Less
            {levels.map((level) => (
              <span key={level} className={cn('h-3 w-3 rounded-[3px]', levelClasses[level])} />
            ))}
            More
          </div>
        </div>
      </div>
    </div>
  )
}
