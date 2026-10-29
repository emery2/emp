import {
  Boxes,
  BriefcaseBusiness,
  ChartNoAxesCombined,
  Handshake,
  Headphones,
  Users,
  type LucideIcon,
} from 'lucide-react'

export interface MarketingProduct {
  id: string
  slug: string
  icon: LucideIcon
  title: string
  shortTitle: string
  tagline: string
  body: string
  bullets: string[]
}

export const marketingProducts: MarketingProduct[] = [
  {
    id: 'hr',
    slug: 'hr',
    icon: Users,
    title: 'Human Capital',
    shortTitle: 'HR',
    tagline: 'People ops that follow your reporting line.',
    body: 'Employees, attendance, recruitment, and two-part leave approval—line approver first, then HR verification—scoped to your hierarchy.',
    bullets: [
      'Employee profiles and reporting lines',
      'Leave: pending line approval → HR verification',
      'Statutory leave rules and no self-approval',
      'Team calendar and balances',
    ],
  },
  {
    id: 'crm',
    slug: 'crm',
    icon: BriefcaseBusiness,
    title: 'CRM',
    shortTitle: 'CRM',
    tagline: 'Pipeline and customers on one Party record.',
    body: 'Leads, contacts, customers, and opportunities with a pipeline you configure. Heads of Department see their scope; executives see all.',
    bullets: [
      'Leads and customer database',
      'Configurable opportunity stages',
      'Owner-based visibility',
      'Optional links to Service Desk and Sales',
    ],
  },
  {
    id: 'prm',
    slug: 'prm',
    icon: Handshake,
    title: 'Partner Relationship',
    shortTitle: 'PRM',
    tagline: 'Vendors and resellers in their own workspace.',
    body: 'Partner directory, onboarding, agreements, referrals into CRM, and a portal scoped to each Partner User.',
    bullets: [
      'Partner tiers and contacts',
      'Agreements and document expiry',
      'Deal registration and referrals',
      'Scorecards that can feed EPM',
    ],
  },
  {
    id: 'epm',
    slug: 'epm',
    icon: ChartNoAxesCombined,
    title: 'Performance',
    shortTitle: 'EPM',
    tagline: 'Objectives and KPIs from live module data.',
    body: 'Cascade OKRs down the hierarchy. KPIs and scorecards appear only for services you have enabled—budgets only if Finance is entitled.',
    bullets: [
      'Strategic objectives and key results',
      'Cascading department and individual goals',
      'Review cycles and scorecards',
      'Executive performance rollup',
    ],
  },
  {
    id: 'projects',
    slug: 'projects',
    icon: Boxes,
    title: 'Projects & Tasks',
    shortTitle: 'Projects',
    tagline: 'Assign work without booking people who are away.',
    body: 'Heads of Department create projects and assign tasks. Approved leave surfaces in assignment views so coverage stays honest.',
    bullets: [
      'Projects owned by department',
      'Kanban, list, and timeline views',
      'Leave-aware assignment',
      'Completion feeds EPM KPIs',
    ],
  },
  {
    id: 'service-desk',
    slug: 'service-desk',
    icon: Headphones,
    title: 'Service Desk',
    shortTitle: 'Service',
    tagline: 'Internal and external tickets with SLAs.',
    body: 'HR, IT, and customer support queues with priorities, escalation, and links to customers or partners when those services are on.',
    bullets: [
      'Internal and external request types',
      'SLA and escalation rules',
      'Comments and attachments',
      'External and Partner scoped views',
    ],
  },
]

export function getProductBySlug(slug: string): MarketingProduct | undefined {
  return marketingProducts.find((product) => product.slug === slug)
}

/** Primary marketing nav — Salesforce.com-style labels, EMP destinations */
export const marketingNav = [
  { label: 'Products', to: '/products' },
  { label: 'Industries', to: '/industries' },
  { label: 'Customers', to: '/customers' },
  { label: 'Events', to: '/events' },
  { label: 'Learning', to: '/learning' },
  { label: 'Support', to: '/support' },
  { label: 'Company', to: '/company' },
] as const

export const homeProductStrip = marketingProducts.map((product) => ({
  id: product.id,
  slug: product.slug,
  title: product.shortTitle,
  icon: product.icon,
}))

export const whyPillars = [
  {
    title: 'Choose your services',
    body: 'Enable only what you need. Every service runs on the shared core and its hard dependencies—never assumes peers are present.',
  },
  {
    title: 'One shared core',
    body: 'Users, roles, approvals, documents, notifications, and Party masters stay consistent wherever you expand.',
  },
  {
    title: 'Hierarchy-aware authority',
    body: 'Permissions and leave approvals mirror Board → CEO → Executives → Heads of Department → teams.',
  },
  {
    title: 'Built to expand',
    body: 'Start with HR and CRM. Add Projects, Service Desk, PRM, EPM, and later operations services without a migration project.',
  },
] as const

export const customerStories = [
  {
    name: 'NORF Industries',
    industry: 'Manufacturing',
    quote:
      'We run people and pipeline on one tenant—leave queues and CRM owners finally share the same org chart.',
    focus: 'HR + CRM',
  },
  {
    name: 'Apex Logistics',
    industry: 'Distribution',
    quote:
      'Department leave approvals and HR verification cut email chasing. Managers see cover before they assign routes.',
    focus: 'HR + Projects',
  },
  {
    name: 'Helios Energy',
    industry: 'Energy',
    quote:
      'Opportunities sit on shared Party records. When we turn on Service Desk later, history is already there.',
    focus: 'CRM',
  },
] as const
