import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Timeline } from '../components/Timeline'
import { journey } from '../data/journey'

export function JourneySection() {
  return (
    <Section id="journey" headingId="journey-heading">
      <Reveal className="grid grid-cols-1 gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-14">
        <SectionHeading
          id="journey-heading"
          title="Journey"
          description="How the work has developed, based on the projects themselves."
        />
        <Timeline items={journey} />
      </Reveal>
    </Section>
  )
}
