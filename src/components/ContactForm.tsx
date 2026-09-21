import { Info, Send } from 'lucide-react'
import { useState } from 'react'
import type { ChangeEvent, FormEvent, ReactNode } from 'react'
import { site } from '../data/site'
import { submitContact } from '../lib/contact'
import type { ContactPayload } from '../lib/contact'
import { Button } from './Button'

type Field = keyof ContactPayload
type Errors = Partial<Record<Field, string>>

const FIELDS: Field[] = ['name', 'email', 'message']
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(values: ContactPayload): Errors {
  const errors: Errors = {}
  if (!values.name.trim()) errors.name = 'Enter your name.'
  if (!values.email.trim()) errors.email = 'Enter your email address.'
  else if (!EMAIL_PATTERN.test(values.email.trim())) errors.email = 'Enter a valid email address, like name@example.com.'
  if (values.message.trim().length < 10) errors.message = 'Write at least 10 characters so the message has some context.'
  return errors
}

const inputClasses =
  'w-full rounded-md border bg-canvas px-3 py-2 text-base text-fg placeholder:text-faint transition-colors focus:border-accent sm:text-[15px]'

function FieldGroup({ id, label, error, children }: { id: string; label: string; error?: string; children: ReactNode }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="mt-1.5 text-[13px] text-warn">
          {error}
        </p>
      )}
    </div>
  )
}

export function ContactForm() {
  const [values, setValues] = useState<ContactPayload>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Errors>({})
  const [notice, setNotice] = useState<string | null>(null)

  const onChange = (field: Field) => (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { value } = event.target
    setValues((current) => ({ ...current, [field]: value }))
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }))
  }

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const found = validate(values)
    setErrors(found)

    const firstInvalid = FIELDS.find((field) => found[field])
    if (firstInvalid) {
      setNotice(null)
      document.getElementById(`contact-${firstInvalid}`)?.focus()
      return
    }

    const outcome = submitContact(values, site.email)
    if (outcome.kind === 'mailto') {
      setNotice('Opening your email app with this message. This form does not send anything by itself.')
      window.location.href = outcome.href
    } else {
      setNotice('Nothing was sent. This form is not connected to a backend yet, and no email address is set up.')
    }
  }

  const describedBy = (field: Field) => (errors[field] ? `contact-${field}-error` : undefined)
  const borderFor = (field: Field) => (errors[field] ? 'border-warn' : 'border-line-strong')

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4 rounded-lg border border-line bg-surface p-5 shadow-panel sm:p-6">
      <FieldGroup id="contact-name" label="Name" error={errors.name}>
        <input
          id="contact-name"
          name="name"
          type="text"
          autoComplete="name"
          value={values.name}
          onChange={onChange('name')}
          aria-invalid={errors.name ? true : undefined}
          aria-describedby={describedBy('name')}
          className={`${inputClasses} ${borderFor('name')}`}
        />
      </FieldGroup>

      <FieldGroup id="contact-email" label="Email" error={errors.email}>
        <input
          id="contact-email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={values.email}
          onChange={onChange('email')}
          aria-invalid={errors.email ? true : undefined}
          aria-describedby={describedBy('email')}
          className={`${inputClasses} ${borderFor('email')}`}
        />
      </FieldGroup>

      <FieldGroup id="contact-message" label="Message" error={errors.message}>
        <textarea
          id="contact-message"
          name="message"
          rows={5}
          value={values.message}
          onChange={onChange('message')}
          aria-invalid={errors.message ? true : undefined}
          aria-describedby={describedBy('message')}
          className={`${inputClasses} ${borderFor('message')} resize-y`}
        />
      </FieldGroup>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <Button type="submit" variant="primary">
          <Send size={16} aria-hidden="true" />
          Send Message
        </Button>
        <p className="text-[13px] text-muted">Frontend-only for now: submitting checks the form but does not send it.</p>
      </div>

      <div role="status" aria-live="polite">
        {notice && (
          <p className="flex items-start gap-2 rounded-md border border-info/30 bg-info/10 px-3 py-2 text-[13px] text-info">
            <Info size={15} aria-hidden="true" className="mt-0.5 shrink-0" />
            {notice}
          </p>
        )}
      </div>
    </form>
  )
}
