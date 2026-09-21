import type { Principle } from '../types'

export const principles: Principle[] = [
  {
    id: 'understand',
    title: 'Understand the problem',
    body: 'Start with who uses the system and what breaks without it. Map the workflows, the data that moves through them, and the edge cases, like failed payments or duplicate requests, before writing code.',
    outputs: ['User flows', 'Data shape', 'Edge cases'],
  },
  {
    id: 'design',
    title: 'Design the system',
    body: 'Model the data first: entities, relations, constraints. Define the API contract and auth boundaries, and decide how money and state changes are recorded so they can be audited later.',
    outputs: ['Schema', 'API contract', 'Auth rules'],
  },
  {
    id: 'build',
    title: 'Build and integrate',
    body: 'Ship in vertical slices (schema, endpoint, interface) so each piece works end to end. Keep third-party services such as payment gateways behind thin adapters, and treat webhooks as untrusted input.',
    outputs: ['Vertical slices', 'Adapters', 'Webhook handlers'],
  },
  {
    id: 'ship',
    title: 'Test, deploy, improve',
    body: 'Cover the critical paths with tests, deploy through a repeatable process, and watch logs for failures. Then iterate on what real usage shows.',
    outputs: ['Tests', 'Deploys', 'Logs'],
  },
]
