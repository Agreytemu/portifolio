import { FileText } from 'lucide-react'
import { CodeBlock } from '../components/CodeBlock'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { site } from '../data/site'
import { buildDeveloperSnippet } from '../lib/snippets'

export function AboutSection() {
  return (
    <Section id="about" headingId="about-heading">
      <Reveal>
        <div className="overflow-hidden rounded-lg border border-line bg-surface shadow-panel">
          <div className="flex items-center gap-2 border-b border-line bg-raised/50 px-4 py-2.5 font-mono text-[13px] text-muted">
            <FileText size={14} aria-hidden="true" />
            README.md
          </div>

          <div className="grid grid-cols-1 gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:gap-10">
            <div className="min-w-0">
              <h2 id="about-heading" className="border-b border-line pb-2 text-[1.375rem] font-semibold leading-tight tracking-[-0.015em]">
                About
              </h2>
              <div className="mt-4 max-w-[62ch] space-y-4 leading-7 text-soft">
                {site.about.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <CodeBlock code={buildDeveloperSnippet()} filename="developer.ts" />
          </div>
        </div>
      </Reveal>
    </Section>
  )
}
