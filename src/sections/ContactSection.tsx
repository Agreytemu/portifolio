import { ContactForm } from '../components/ContactForm'
import { Reveal } from '../components/Reveal'
import { Section } from '../components/Section'
import { SocialLinks } from '../components/SocialLinks'
import { getSocialLinks } from '../data/site'

export function ContactSection() {
  return (
    <Section id="contact" headingId="contact-heading" className="pb-16 md:pb-20">
      <Reveal className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-14">
        <div className="min-w-0">
          <h2 id="contact-heading" className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Let’s build something useful.
          </h2>
          <p className="mt-3 max-w-[46ch] text-soft">
            Have an idea, project, or technical problem?
            <br />
            Let’s talk.
          </p>
          <SocialLinks links={getSocialLinks()} variant="button" className="mt-6" />
        </div>
        <ContactForm />
      </Reveal>
    </Section>
  )
}
