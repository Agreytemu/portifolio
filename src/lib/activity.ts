import type { ActivityData, ActivityDay, ActivityLevel } from '../types'

const WEEKS = 53
const DAY_MS = 86_400_000
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function toIso(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10)
}

/** Small seeded PRNG so the demo graph looks the same on every load. */
function mulberry32(seed: number): () => number {
  let a = seed
  return () => {
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

/** Lays out 53 week-columns (Sunday first) ending on the week that contains `end`. */
function buildCalendar(
  end: Date,
  levelFor: (date: string, weekday: number, dayIndex: number) => ActivityLevel,
): ActivityDay[][] {
  const endUtc = Date.UTC(end.getFullYear(), end.getMonth(), end.getDate())
  const endWeekday = new Date(endUtc).getUTCDay()
  const totalDays = (WEEKS - 1) * 7 + endWeekday + 1
  const start = endUtc - (totalDays - 1) * DAY_MS

  const weeks: ActivityDay[][] = []
  for (let i = 0; i < totalDays; i++) {
    const weekday = i % 7
    const date = toIso(start + i * DAY_MS)
    if (weekday === 0) weeks.push([])
    weeks[weeks.length - 1].push({ date, level: levelFor(date, weekday, i) })
  }
  return weeks
}

/** Generated sample data. It is not GitHub contribution data and is labelled as such in the UI. */
export function generateDemoActivity(end: Date = new Date()): ActivityData {
  const random = mulberry32(2026)

  const weeks = buildCalendar(end, (_date, weekday, index) => {
    const wave = 0.5 + 0.5 * Math.sin(index / 9) // busy and quiet stretches
    const weekendDamping = weekday === 0 || weekday === 6 ? 0.45 : 1
    const chance = (0.3 + 0.5 * wave) * weekendDamping
    if (random() > chance) return 0

    const intensity = random() * (0.5 + wave)
    if (intensity > 1.05) return 4
    if (intensity > 0.75) return 3
    if (intensity > 0.4) return 2
    return 1
  })

  return {
    weeks,
    source: 'demo',
    title: 'Development Activity',
    badge: 'Demo data',
    note: 'Generated sample data for layout purposes. These are not GitHub contribution statistics.',
  }
}

function levelForCount(count: number): ActivityLevel {
  if (count === 0) return 0
  if (count <= 2) return 1
  if (count <= 5) return 2
  if (count <= 9) return 3
  return 4
}

/** Builds the graph from real per-day counts (used by the optional GitHub sync). */
export function activityFromCounts(counts: Map<string, number>, end: Date = new Date()): ActivityData {
  return {
    weeks: buildCalendar(end, (date) => levelForCount(counts.get(date) ?? 0)),
    source: 'github',
    title: 'Activity Overview',
    badge: 'GitHub events',
    note: 'Based on push events from the public GitHub API, which only covers roughly the last 90 days.',
  }
}

export interface MonthLabel {
  column: number
  label: string
}

export function getMonthLabels(weeks: ActivityDay[][]): MonthLabel[] {
  const labels: MonthLabel[] = []
  let lastMonth = -1
  let lastColumn = -10

  weeks.forEach((week, column) => {
    const first = week[0]
    if (!first) return
    const month = Number(first.date.slice(5, 7)) - 1
    if (month === lastMonth) return
    lastMonth = month
    if (column - lastColumn >= 3) {
      labels.push({ column, label: MONTHS[month] })
      lastColumn = column
    }
  })

  return labels
}

export function formatDay(date: string): string {
  const [year, month, day] = date.split('-')
  return `${MONTHS[Number(month) - 1]} ${Number(day)}, ${year}`
}
