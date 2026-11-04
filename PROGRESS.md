# EMP Frontend Progress

Last updated: 2026-11-03 (F2 — profile self-service)

## Source of truth

| Doc | Location |
|-----|----------|
| PRD v3.1 | `docs/PRD.md` |
| Design | `docs/design.md` |
| Module packaging | `docs/MODULE_MODEL.md` |
| Server enforcement | `docs/SERVER_ENFORCEMENT.md` |

**Conflict rule:** PRD wins on existing behavior. MODULE_MODEL wins on packaging. F-series prompt wins on goals/evals/profile/signatures/feature customisation.

---

## Milestone table — F-series

| ID | Name | Status | Date | Notes |
|----|------|--------|------|-------|
| **F0** | Audit | **Done** | 2026-11-03 | |
| **F1** | Feature framework + entitlements | **Done** | 2026-11-03 | |
| **F2** | Profile self-service + HR approval + sensitivity | **Done** | 2026-11-03 | Direct / needs approval / locked; HR Head for HR staff |
| **F3** | Employee goal setting + HoD approval + locking | Not started | — | |
| **F4** | Evaluation cycles + appeal | Not started | — | |
| **F5** | Digital signatures | Not started | — | |
| **F6** | Integration + hardening | Not started | — | |

---

## F2 delivered

- Employee profile records (tenant-scoped) + change requests + immutable field history.
- Sensitivity from `hr.profile_self_service` config; submit splits direct vs approval; locked rejected.
- HR queue + side-by-side review; approve / reject (reason) / return; withdraw by requester.
- HR officer changes assign to **HR Head** (`user-hr-head` / `hr_head` role); no self-approval.
- Requests freeze `configVersionId` at submit; approve applies under that snapshot.
- Routes: `/profile` (self-service panel), `/profile/hr-queue`, `/profile/changes/:id` behind feature gate.
- Permissions: `profile.edit.self`, `profile.approve.hr`.
- Tests: sensitivity split, transitions, SoD, tenant isolation, feature-off, config version retain.

### F2 verification

| Command | Result |
|---------|--------|
| `npm run test` | **Pass** — 8 files, **52** tests |
| `npm run lint` | **Pass** (existing warnings) |
| `npm run build` | **Pass** |

---

## Try it

1. `employee@norf.example` → Profile → change phone (direct) + legal name (approval).
2. `hr@norf.example` → Profile approvals → approve/reject.
3. As HR, submit own legal name change → appears for `hr.head@norf.example` only.

Password for all demo users: `password`.

---

## Known limitations

- Attachment is filename mock only (no upload binary).
- Not all demo users have rich seed profiles (auto-created empty shell if missing).
- HR “notified” on direct edits is audit-history only (no notification center write).
- Leave status names still ≠ PRD.

---

## Next increment

**Awaiting go on F3** (goal setting with HoD approval and locking).
