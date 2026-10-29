# EMP Frontend Progress

Last updated: 2026-10-28 (ingested PRD v3.1 + Brief/Overview PDFs)

## Source of truth

| Doc | Location |
|-----|----------|
| PRD v3.1 | `docs/PRD.md` (+ PDF `docs/source/EMP_PRD_v3.1.pdf`) |
| Design | `docs/design.md` |
| Module packaging | `docs/MODULE_MODEL.md` (synced to PRD §04) |
| Project Brief v2.0 | `docs/PROJECT_BRIEF.md` + `docs/source/` |
| Solution Overview v2.0 | `docs/SOLUTION_OVERVIEW.md` + `docs/source/` |
| Server enforcement | `docs/SERVER_ENFORCEMENT.md` |

## Milestone table

| ID | Name | Status | Date | Notes |
|----|------|--------|------|-------|
| M0 | Audit + docs scaffold | **Done** | 2026-10-27 | |
| Docs sync | PRD 3.1 + Brief + Overview imported | **Done** | 2026-10-28 | |
| **X0** | Confirm open decisions §25 (esp. #7–9) + quarantine map | **Not started** | — | Optional short gate |
| **X1** | Manifests, entitlements, toggles, not-available screen, contracts, import-boundary test, DEV demo label, `can()` skeleton | **Not started** | — | = Phase 1 entitlement slice |
| X2 | Org: depts, HoD appointment, PRD roles, hierarchy flags | Not started | — | |
| X3 | HR core | Not started | — | |
| X4 | Leave PRD §08 | Not started | — | |
| X5 | CRM | Not started | — | |
| … | Projects, Service Desk, PRM, EPM, Workflow | Not started | — | Per Brief phasing |
| Ops | Finance/Sales/… | Blocked | — | Need PRD addendum (Brief + PRD Phase 5) |
| X10 | Bundles + composed dashboards | Not started | — | |
| X11 | Module combination matrix tests | Not started | — | |

## Decisions locked by PRD v3.1 / Brief

| Topic | Decision |
|-------|----------|
| Packaging | Separately chosen services; core always on |
| EPM budgets | Only when Finance entitled |
| Ops services | Planned; **addendum before build** |
| Pricing/billing | Out of scope (flags only) |
| Party model | Core owns Party; modules add profiles |
| First product | HR + CRM after foundation |

## Known limitations (codebase)

- Legacy roles / ERP-ish UI still present; quarantine until X1 entitlements + later Sales module.  
- No manifests / Party / import-boundary test yet.  
- Leave statuses ≠ PRD names.  
- RTL Testing Library not installed.

## Next increment

**Awaiting your go on X0 or X1.**  
Recommended: **X1** (entitlement platform) unless you want X0 only to tick open decisions #7–9 first.
