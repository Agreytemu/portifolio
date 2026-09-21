import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { TechBadgeList } from '../components/TechBadgeList'
import { principles } from '../data/principles'

export function HowIBuildSection() {
  return (
    <Section id="build" headingId="build-heading">
      <Reveal>
        <SectionHeading
          id="build-heading"
          title="How I Build"
          description="From the first conversation to production."
        />
        <div className="overflow-hidden rounded-lg border border-line bg-line shadow-panel">
          {/* gap-px over a line-coloured background gives clean 1px dividers at every breakpoint */}
          <ol className="grid grid-cols-1 gap-px md:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle, index) => (
              <li key={principle.id} className="flex flex-col bg-surface p-5">
                <span className="font-mono text-sm text-accent">{String(index + 1).padStart(2, '0')}</span>
                <h3 className="mt-2 font-semibold">{principle.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{principle.body}</p>
                <TechBadgeList
                  items={principle.outputs}
                  label={`${principle.title}: outputs`}
                  size="sm"
                  className="mt-auto pt-4"
                />
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </Section>
  )
}
