import type { StackGroup } from '../types'

export const stackGroups: StackGroup[] = [
  {
    id: 'frontend',
    label: 'Frontend',
    purpose: 'Interfaces and client applications',
    items: ['React', 'TypeScript', 'JavaScript', 'Vite', 'Tailwind CSS', 'HTML', 'CSS'],
    highlight: ['React'],
  },
  { id: 'backend', label: 'Backend', purpose: 'Services and business logic', items: ['Django', 'Laravel', 'Node.js', 'Express', 'FastAPI'] },
  { id: 'database', label: 'Database', purpose: 'Storage and data access', items: ['PostgreSQL', 'Supabase', 'Prisma'] },
  { id: 'infrastructure', label: 'Infrastructure', purpose: 'Hosting and deployment', items: ['Render', 'Railway', 'Vercel', 'GitHub'] },
  {
    id: 'integrations',
    label: 'Integrations',
    purpose: 'Payments, auth, and third-party services',
    items: ['REST APIs', 'Webhooks', 'Payment Gateways', 'Mobile Money APIs', 'Authentication'],
  },
  { id: 'tools', label: 'Tools', purpose: 'Day-to-day workflow', items: ['Git', 'GitHub', 'VS Code', 'Android Studio'] },
]
