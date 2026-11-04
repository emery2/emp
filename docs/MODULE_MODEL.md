# EMP module and shared-data model

**Status:** Binding — keep in sync with [`PRD.md`](./PRD.md) **§04** (v3.1).  
**Conflict rule:** If this file and the PRD differ, **resolve before building**; the **PRD wins** on product questions. Feature-level packaging for goals / evaluations / profile / signatures follows the F-series extension (see [`../PROGRESS.md`](../PROGRESS.md)).

Source copies: `docs/source/EMP_PRD_v3.1.pdf`, Project Brief v2.0, Solution Overview v2.0.

## Always-on core (every tenant)

Authentication · organization and hierarchy · users and roles · **module entitlements** · **feature entitlements** · notifications · documents · shared approval engine · item catalog · shared reference data (units, currencies, tax codes, payment terms)

## Optional services (PRD §04)

| Service | Code id | Hard requires | Optional integrations |
|---------|---------|---------------|------------------------|
| HR | `hr` | None | Projects, EPM, Manufacturing |
| CRM | `crm` | None | Sales, Service Desk, PRM, CX, EPM |
| PRM | `prm` | None | CRM, Procurement, EPM |
| EPM | `epm` | None | Every service (KPI feeds); Finance (budgets/forecasts) |
| Projects & Tasks | `projects` | None | HR, EPM |
| Service Desk | `cx` (cases surface; full desk later) | None | CRM, PRM, CX |
| Documents | `documents` | None | HR, CRM, PRM |
| Finance / Sales / … | planned | see PRD | — |

> Frontend module id is **`hr`** (renamed from legacy `hcm` in F1).

Operations services (Finance→Manufacturing): planned; detailed requirements in a PRD addendum before build.

## Feature entitlements (F1+)

Two layers on top of module flags:

1. **Owner (Super Administrator)** — which features each tenant may use (`features.entitle`).
2. **Client (Org Admin / HR where permitted)** — bounded configuration for entitled features (`features.configure`), validated with Zod, **versioned**, audit-logged. In-progress work stores `configVersionId` and does not rewrite history.

| Feature key | Owning service | Default on |
|-------------|----------------|------------|
| `hr.leave` | hr | yes |
| `hr.goals` | hr | yes |
| `hr.evaluations` | hr | yes |
| `hr.evaluations.appeals` | hr | yes |
| `hr.profile_self_service` | hr | yes |
| `documents.signatures.builtin` | documents | yes |
| `documents.signatures.external` | documents | no |

Manifests live in `src/modules/feature-manifests.ts` with schemas in `src/modules/feature-schemas.ts`.

Enforcement: router (`RequireModule` / `RequireFeature`), nav, repositories, dashboards, and `can()` in `src/shared/policy`. Disabled features show **Plan unavailable** (`/plan-unavailable`), not a generic permission denial.

## Shared data

- Core owns **Party**, item catalog, reference data.  
- Modules add **profiles** on Party (customer/supplier without requiring CRM/PRM).  
- Graceful degradation when peers are off.  
- Typed contracts + domain events in `src/shared/contracts`; **no feature→feature imports** (enforced by `src/shared/import-boundary.test.ts`).  
- Optional **adapters** only when both sides entitled; listed in manifests.

## Entitlements

Manifest per service · per-tenant module + feature flags · enforce in router, nav, repos, dashboards, `can()` · “not available on your plan” · hard-dep enable/disable rules · disable keeps data · Super Admin toggles per tenant · Org Admin configures enabled features · presets = bundles only · no pricing UI.

### Industry / product bundles (defaults only)

| Bundle | Typical services |
|--------|------------------|
| People & Work | HR, Projects, EPM |
| Sales & Customers | CRM, Service Desk, CX |
| Partners & Suppliers | PRM, Procurement |
| Distribution & Retail | Sales, Procurement, Inventory, Logistics, Finance |
| Manufacturing | Inventory, Manufacturing, Planning, Procurement, Sales, Finance, HR |
| Full suite | All services |

## Frontend milestone mapping

See [`../PROGRESS.md`](../PROGRESS.md). **F1** delivers manifests, feature framework, entitlement enforcement, plan-unavailable screen, contracts folder, import-boundary test, `can()` skeleton. Legacy X1 is superseded by F1.
