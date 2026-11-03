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

/** Primary marketing nav — Anaplan-style top labels, EMP destinations */
export const marketingNav = [
  { label: 'Products', to: '/products', hasMenu: true },
  { label: 'Customer Success', to: '/customers', hasMenu: true },
  { label: 'Resources', to: '/learning', hasMenu: true },
  { label: 'Company', to: '/company', hasMenu: true },
] as const

export type MegaMenuId = 'Products' | 'Customer Success' | 'Resources' | 'Company'

export interface MegaMenuLink {
  label: string
  to: string
}

export interface MegaMenuColumn {
  title: string
  links: MegaMenuLink[]
}

export interface MegaMenuPromo {
  eyebrow: string
  title: string
  body: string
  cta: string
  to: string
  tone: 'light' | 'dark'
}

export interface MegaMenuPanel {
  id: MegaMenuId
  rail: MegaMenuLink[]
  railGroupLabel?: string
  railGrouped?: MegaMenuLink[]
  railFooter?: MegaMenuLink
  heading: string
  subheading: string
  description: string
  columns: MegaMenuColumn[]
  promos: MegaMenuPromo[]
}

export const productsMegaMenu: MegaMenuPanel = {
  id: 'Products',
  rail: [
    { label: 'Featured Applications', to: '/products' },
    { label: 'Platform Overview', to: '/why-emp' },
    { label: 'By Industry', to: '/industries' },
  ],
  railGroupLabel: 'By Function',
  railGrouped: [
    { label: 'People & HR', to: '/products/hr' },
    { label: 'Sales & CRM', to: '/products/crm' },
    { label: 'Partners', to: '/products/prm' },
    { label: 'Performance', to: '/products/epm' },
    { label: 'Service Desk', to: '/products/service-desk' },
  ],
  railFooter: { label: 'Solutions Overview', to: '/products' },
  heading: 'Featured Applications',
  subheading: 'EMP Applications',
  description:
    'Modular enterprise services on a shared core—enable only what you need, with hierarchy-aware permissions.',
  columns: [
    {
      title: 'People',
      links: [
        { label: 'Human Capital', to: '/products/hr' },
        { label: 'Leave & Attendance', to: '/products/hr' },
        { label: 'Recruitment', to: '/products/hr' },
        { label: 'Projects & Tasks', to: '/products/projects' },
      ],
    },
    {
      title: 'Revenue',
      links: [
        { label: 'CRM Pipeline', to: '/products/crm' },
        { label: 'Leads & Customers', to: '/products/crm' },
        { label: 'Partner Relationship', to: '/products/prm' },
        { label: 'Deal Registration', to: '/products/prm' },
      ],
    },
    {
      title: 'Operations',
      links: [
        { label: 'Service Desk', to: '/products/service-desk' },
        { label: 'SLA & Escalation', to: '/products/service-desk' },
        { label: 'Leave-aware Assignment', to: '/products/projects' },
      ],
    },
    {
      title: 'Performance',
      links: [
        { label: 'Objectives & KPIs', to: '/products/epm' },
        { label: 'Cascading Goals', to: '/products/epm' },
        { label: 'Executive Rollup', to: '/products/epm' },
      ],
    },
  ],
  promos: [
    {
      eyebrow: 'Next-generation platform',
      title: 'Meet the modular EMP suite',
      body: 'Assemble HR, CRM, PRM, EPM, Projects, and Service Desk on one tenant.',
      cta: 'Learn more',
      to: '/products',
      tone: 'light',
    },
    {
      eyebrow: 'Why EMP',
      title: 'Shared core. Hierarchy-aware authority.',
      body: 'Permissions and approvals mirror your org chart—from Board to teams.',
      cta: 'Learn more',
      to: '/why-emp',
      tone: 'dark',
    },
  ],
}

export const customerSuccessMegaMenu: MegaMenuPanel = {
  id: 'Customer Success',
  rail: [
    { label: 'Customer Stories', to: '/customers' },
    { label: 'Why EMP', to: '/why-emp' },
    { label: 'Industries', to: '/industries' },
  ],
  heading: 'Customer Success',
  subheading: 'Proof in production',
  description:
    'See how teams run people, pipeline, and work on one modular suite.',
  columns: [
    {
      title: 'Explore',
      links: [
        { label: 'Customer Stories', to: '/customers' },
        { label: 'Why EMP', to: '/why-emp' },
        { label: 'Industries', to: '/industries' },
      ],
    },
  ],
  promos: [
    {
      eyebrow: 'Customers',
      title: 'Customers of every size succeed with EMP',
      body: 'Manufacturing, distribution, and energy teams on one hierarchy.',
      cta: 'Learn more',
      to: '/customers',
      tone: 'light',
    },
    {
      eyebrow: 'Platform',
      title: 'Start with HR and CRM—expand when ready',
      body: 'No migration project when you turn on the next service.',
      cta: 'Learn more',
      to: '/why-emp',
      tone: 'dark',
    },
  ],
}

export const resourcesMegaMenu: MegaMenuPanel = {
  id: 'Resources',
  rail: [
    { label: 'Learning', to: '/learning' },
    { label: 'Events', to: '/events' },
    { label: 'Support', to: '/support' },
  ],
  heading: 'Resources',
  subheading: 'Learn and get help',
  description: 'Guides, events, and support for your EMP rollout.',
  columns: [
    {
      title: 'Learn',
      links: [
        { label: 'Learning Center', to: '/learning' },
        { label: 'Events', to: '/events' },
        { label: 'Support', to: '/support' },
        { label: 'Contact', to: '/contact' },
      ],
    },
  ],
  promos: [
    {
      eyebrow: 'Learning',
      title: 'Get productive on EMP faster',
      body: 'Role-based paths for HR, CRM, and department leads.',
      cta: 'Learn more',
      to: '/learning',
      tone: 'light',
    },
    {
      eyebrow: 'Support',
      title: 'Help when you need it',
      body: 'Support queues and contact paths for your tenant admins.',
      cta: 'Learn more',
      to: '/support',
      tone: 'dark',
    },
  ],
}

export const companyMegaMenu: MegaMenuPanel = {
  id: 'Company',
  rail: [
    { label: 'About EMP', to: '/company' },
    { label: 'Contact', to: '/contact' },
  ],
  heading: 'Company',
  subheading: 'About EMP',
  description: 'Building a modular enterprise suite you can assemble.',
  columns: [
    {
      title: 'Company',
      links: [
        { label: 'About', to: '/company' },
        { label: 'Contact', to: '/contact' },
        { label: 'Get a demo', to: '/login' },
      ],
    },
  ],
  promos: [
    {
      eyebrow: 'Contact',
      title: 'Talk to us about your rollout',
      body: 'Demo the suite with hierarchy-aware permissions in minutes.',
      cta: 'Learn more',
      to: '/contact',
      tone: 'light',
    },
    {
      eyebrow: 'Demo',
      title: 'Start free demo',
      body: 'Switch roles and walk leave, CRM, and projects end to end.',
      cta: 'Learn more',
      to: '/login',
      tone: 'dark',
    },
  ],
}

export const megaMenus: Record<MegaMenuId, MegaMenuPanel> = {
  Products: productsMegaMenu,
  'Customer Success': customerSuccessMegaMenu,
  Resources: resourcesMegaMenu,
  Company: companyMegaMenu,
}

export const heroTechLogos = [
  'SAP',
  'Microsoft 365',
  'Azure',
  'AWS',
  'Salesforce',
  'Oracle',
  'Google Workspace',
  'Power BI',
  'Slack',
  'Teams',
  'PostgreSQL',
  'WhatsApp Business',
] as const

export interface IntelligentAppCategory {
  id: string
  label: string
  color: string
  apps: [string, string, string]
}

export const intelligentAppCategories: IntelligentAppCategory[] = [
  {
    id: 'finance',
    label: 'Finance',
    color: '#8b97a8',
    apps: [
      'Budget & Forecast Control',
      'Cost Center Planning',
      'Cash Position Overview',
    ],
  },
  {
    id: 'ops',
    label: 'Operations',
    color: '#4f7cac',
    apps: [
      'Demand & Capacity Planning',
      'Inventory Coverage',
      'Fulfillment Readiness',
    ],
  },
  {
    id: 'crm',
    label: 'Sales & CRM',
    color: '#b84a3a',
    apps: [
      'Pipeline Forecasting',
      'Account Planning',
      'Quota & Territory Mix',
    ],
  },
  {
    id: 'hr',
    label: 'HR & Workforce',
    color: '#ff6a00',
    apps: [
      'Operational Workforce Planning',
      'Project Resource Planning',
      'Leave Coverage Planning',
    ],
  },
  {
    id: 'service',
    label: 'Service & Partners',
    color: '#6d7a8b',
    apps: [
      'Service Desk Capacity',
      'Partner Scorecards',
      'SLA Risk Planning',
    ],
  },
]

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

export const marketingFooterColumns = [
  {
    title: 'Quick links',
    links: [
      { label: 'Why EMP', to: '/why-emp' },
      { label: 'Products', to: '/products' },
      { label: 'Customer Stories', to: '/customers' },
      { label: 'Learning', to: '/learning' },
      { label: 'Events', to: '/events' },
      { label: 'Get a demo', to: '/login' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Platform Overview', to: '/why-emp' },
      { label: 'Shared Core', to: '/why-emp' },
      { label: 'EMP Applications', to: '/products' },
      { label: 'Hierarchy & Permissions', to: '/why-emp' },
      { label: 'Integrations', to: '/company' },
      { label: 'Enterprise Capabilities', to: '/company' },
    ],
  },
  {
    title: 'Solutions',
    links: [
      { label: 'Solutions Overview', to: '/products' },
      { label: 'Human Capital', to: '/products/hr' },
      { label: 'Sales & CRM', to: '/products/crm' },
      { label: 'Partners', to: '/products/prm' },
      { label: 'HR & Workforce', to: '/products/hr' },
      { label: 'Service Desk', to: '/products/service-desk' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Learning Center', to: '/learning' },
      { label: 'Events & Webinars', to: '/events' },
      { label: 'Support Center', to: '/support' },
      { label: 'Documentation', to: '/support' },
      { label: 'Customer Success', to: '/customers' },
      { label: 'Industries', to: '/industries' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', to: '/company' },
      { label: 'Leadership', to: '/company' },
      { label: 'Partners', to: '/company' },
      { label: 'Newsroom', to: '/company' },
      { label: 'Careers', to: '/company' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  {
    title: 'Also of interest',
    links: [
      { label: 'Leave Approval Workflows', to: '/products/hr' },
      { label: 'Pipeline on Party Records', to: '/products/crm' },
      { label: 'What is Modular ERP?', to: '/why-emp' },
      { label: 'Hierarchy-aware Planning', to: '/products/epm' },
    ],
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
