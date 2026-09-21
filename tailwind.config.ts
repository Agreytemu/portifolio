import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#121517',
        surface: '#181C1F',
        raised: '#1F2428',
        lift: '#262C31',
        line: { DEFAULT: '#2A3136', strong: '#3B454C' },
        fg: '#E7ECEE',
        soft: '#B4BEC4',
        muted: '#8E9AA2',
        faint: '#66727A',
        ink: '#08110F',
        accent: { DEFAULT: '#3DB8A0', strong: '#58CDB5' },
        warn: '#D9A441',
        info: '#6AAEE8',
        syntax: {
          keyword: '#6AAEE8',
          string: '#8CCFB0',
          number: '#D9A441',
          comment: '#7B878F',
        },
      },
      fontFamily: {
        sans: ['"Hanken Grotesk"', 'ui-sans-serif', 'system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"Spline Sans Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Consolas', 'monospace'],
      },
      maxWidth: { page: '75rem' },
      boxShadow: {
        // A 1px top highlight and a tight contact shadow: enough depth to separate surfaces, nothing more.
        panel: 'inset 0 1px 0 rgba(255,255,255,0.03), 0 1px 2px rgba(0,0,0,0.28)',
        'panel-hover': 'inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 24px -14px rgba(0,0,0,0.65)',
      },
      keyframes: {
        blink: {
          '0%, 49%': { opacity: '1' },
          '50%, 100%': { opacity: '0' },
        },
      },
      animation: { blink: 'blink 1.1s steps(1) infinite' },
    },
  },
  plugins: [],
} satisfies Config
