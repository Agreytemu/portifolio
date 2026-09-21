import { site } from '../data/site'

/** Builds the developer.ts snippet from site data so there is one source of truth. */
export function buildDeveloperSnippet(): string {
  const focus = site.focus.map((item) => `    "${item}"`).join(',\n')
  return [
    'const developer = {',
    `  name: "${site.name}",`,
    `  role: "${site.role}",`,
    '  focus: [',
    focus,
    '  ],',
    `  location: "${site.location}"`,
    '};',
  ].join('\n')
}
