export interface ContactPayload {
  name: string
  email: string
  message: string
}

export type ContactOutcome = { kind: 'mailto'; href: string } | { kind: 'not-connected' }

/**
 * The form is frontend-only. With an email address configured it hands the message to the visitor's
 * own mail app. Without one it reports honestly that nothing was sent.
 * To connect a real backend later, replace this function and keep the return shape.
 */
export function submitContact(values: ContactPayload, toEmail: string): ContactOutcome {
  if (!toEmail) return { kind: 'not-connected' }

  const subject = encodeURIComponent(`Portfolio message from ${values.name}`)
  const body = encodeURIComponent(`${values.message}\n\n${values.name} (${values.email})`)
  return { kind: 'mailto', href: `mailto:${toEmail}?subject=${subject}&body=${body}` }
}
