# EMP — Enterprise Management Platform

Multi-tenant SaaS frontend unifying HR, CRM, projects, ticketing, workflows, documents, and reporting. UI follows [`design.md`](./design.md) (SAP Analytics / Fiori Horizon flat surfaces).

## Stack

React 18 · Vite · TypeScript · Tailwind CSS · shadcn/ui-style primitives · React Query · React Router · Lucide · Recharts

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

### Demo login

1. Any demo email from the login form (default prefilled).
2. Any password.
3. MFA code: `123456`

Roles available via email: `ava.chen@norf.example` (Org Admin), `marcus.okonkwo@norf.example` (Dept Manager), `sofia.alvarez@norf.example` (Employee), `jordan.lee@norf.example` (Super Admin).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Typecheck + production build |
| `npm run preview` | Preview production build |

## Architecture

- `src/api` — React Query–backed query functions (swap for FastAPI later)
- `src/mocks` — typed fixtures
- `src/components/ui` — design-system primitives
- `src/components/shared` — DataTable, KanbanBoard, StatCard, RoleGate, …
- `src/features` — route pages by domain
- Tokens live in `src/styles/globals.css` per `design.md`
