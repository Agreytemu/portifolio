import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SectionHeading } from '../components/SectionHeading'
import { Terminal } from '../components/Terminal'
import { terminalLines } from '../data/terminal'

export function TerminalSection() {
  return (
    <Section id="terminal" headingId="terminal-heading">
      <Reveal className="grid grid-cols-1 gap-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-14">
        <SectionHeading id="terminal-heading" title="Terminal" description="Where things stand right now." />
        <div className="max-w-2xl">
          <Terminal lines={terminalLines} />
        </div>
      </Reveal>
    </Section>
  )
}
