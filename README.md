<<<<<<< HEAD
# EMP — Enterprise Management Platform

Integrated enterprise SaaS frontend spanning HCM, CRM, PRM, ERP, SCM/manufacturing, CX, EPM, and projects. UI follows [`design.md`](./design.md) (SAP Analytics / Fiori Horizon flat surfaces).

## Stack

React 18 · Vite · TypeScript · Tailwind CSS · shadcn/ui-style primitives · React Query · React Router · Lucide · Recharts · Vitest

## Quick start

```bash
npm install
npm run dev
```

Public landing: `/` · App (after login): `/app` (role-specific dashboard redirect)

### Demo login

Password for **all** demo accounts: `password`

Use the **Demo accounts** list on `/login`, ShellBar **Switch demo user**, and ShellBar **Organization** switcher (tenant branding).

| Email | Role |
|-------|------|
| `board@norf.example` | Board Member |
| `ceo@norf.example` | CEO / Executive |
| `hod.eng@norf.example` | Head of Engineering |
| `hod.sales@norf.example` | Head of Sales |
| `finance@norf.example` | Finance Officer |
| `hr@norf.example` | HR Officer |
| `procurement@norf.example` | Procurement Officer |
| `warehouse@norf.example` | Warehouse / Manufacturing |
| `sales@norf.example` | Sales / Customer Service |
| `crm@norf.example` | CRM / PRM / Project member |
| `employee@norf.example` | Regular Employee |
| `admin@norf.example` | System Administrator |
| `auditor@norf.example` | Employee + HR permission overrides |

### Functional demo paths

**Leave (HCM)**  
1. `employee@norf.example` → Request leave → submit  
2. `hod.eng@norf.example` → Manager approvals → Approve  
3. `hr@norf.example` → HR verification → Verify  

**CRM → ERP quotation**  
1. `sales@norf.example` → Opportunities → open `opp-100` (or create one) → Convert to ERP quotation  
2. `finance@norf.example` → Quotations → Approve (Finance)  
3. Sales can then **Mark sent to customer**

Forbidden routes → `/access-denied`. Disabled modules (Settings → Modules) also deny module routes.

## Security disclaimer

**UI permission checks and module flags are prototype-only.** Production FastAPI must independently enforce every permission, module entitlement, and record-level scope.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server |
| `npm run build` | Typecheck + production build |
| `npm test` | Vitest |
| `npm run preview` | Preview production build |

## Architecture

- `src/access` — permissions, roles, modules, evaluate, gates
- `src/api` — React Query functions (FastAPI-ready boundaries)
- `src/mocks` — org hierarchy, users, leave, commercial, modules, branding
- `src/components/shared/workflow` — reusable approval timeline + actions
- `src/features` — domain UIs (auth, dashboards, leave, crm, erp, settings, …)
=======
# emp
>>>>>>> 0317fafc31b1bb73bf03edbd2d13073c6215d801
