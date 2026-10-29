# EMP module and shared-data model

**Status:** Binding — keep in sync with [`PRD.md`](./PRD.md) **§04** (v3.1).  
**Conflict rule:** If this file and the PRD differ, **resolve before building**; the **PRD wins** on product questions.

Source copies: `docs/source/EMP_PRD_v3.1.pdf`, Project Brief v2.0, Solution Overview v2.0.

## Always-on core (every tenant)

Authentication · organization and hierarchy · users and roles · **module entitlements** · notifications · documents · shared approval engine · item catalog · shared reference data (units, currencies, tax codes, payment terms)

## Optional services (PRD §04)

| Service | Hard requires | Optional integrations |
|---------|---------------|------------------------|
| HR | None | Projects, EPM, Manufacturing |
| CRM | None | Sales, Service Desk, PRM, CX, EPM |
| PRM | None | CRM, Procurement, EPM |
| EPM | None | Every service (KPI feeds); Finance (budgets/forecasts) |
| Projects & Tasks | None | HR, EPM |
| Service Desk | None | CRM, PRM, CX |
| Finance | None | Postings from Sales, Procurement, Inventory, Manufacturing |
| Sales | None | CRM, Inventory, Finance, CX |
| Procurement | None | Inventory, Finance, PRM, Planning |
| Inventory | None | Sales, Procurement, Manufacturing, Finance |
| Logistics | None | Sales, Procurement, Inventory |
| Planning | **Inventory** | Procurement, Manufacturing, Sales |
| Manufacturing | **Inventory** | HR, Finance, Planning |
| CX | None | CRM, Service Desk, Sales |

Operations services (Finance→CX): planned; detailed requirements in a PRD addendum before build. Phase 5 in PRD.

## Shared data

- Core owns **Party**, item catalog, reference data.  
- Modules add **profiles** on Party (customer/supplier without requiring CRM/PRM).  
- Graceful degradation when peers are off.  
- Typed contracts + domain events in `src/shared/contracts`; **no feature→feature imports**.  
- Optional **adapters** only when both sides entitled; listed in manifests.

## Entitlements

Manifest per service · tenant entitlement flags · enforce in router, nav, repos, dashboards, `can()` · “not available on your plan” · hard-dep enable/disable rules · disable keeps data · Super Admin toggles per tenant · Org Admin sees enabled set · presets = bundles only · no pricing UI.

### Industry / product bundles (defaults only)

| Bundle | Typical services |
|--------|------------------|
| People & Work | HR, Projects, EPM |
| Sales & Customers | CRM, Service Desk, CX |
| Partners & Suppliers | PRM, Procurement |
| Distribution & Retail | Sales, Procurement, Inventory, Logistics, Finance |
| Manufacturing | Inventory, Manufacturing, Planning, Procurement, Sales, Finance, HR |
| Full suite | All services |

## Frontend milestone mapping (X-series)

See [`../PROGRESS.md`](../PROGRESS.md). X1 delivers manifests, entitlement enforcement, toggle screens, contracts folder, import-boundary test.
