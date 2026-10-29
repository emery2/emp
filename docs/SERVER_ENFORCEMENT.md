# Server-side enforcement requirements (FastAPI)

Frontend permission checks, module flags, and demo-user switching are **prototype UX only**. Production FastAPI must enforce every rule below independently of the browser.

## Always enforce

| Area | Requirement |
|------|-------------|
| Tenant isolation | Every query filters by `tenant_id`; PostgreSQL RLS; never trust client-sent tenant |
| AuthN | Valid JWT/session; inactive users rejected |
| AuthZ | Role + permission + record scope (org / department / self / owner) |
| Self-approval | Reject any approval where actor is the requester |
| Workflow state | Only allow transitions valid for the current step and actor role |
| Module flags | Disabled modules return 403 even if the user has a permission key |
| External / Partner | Restrict to rows linked to that user’s customer or partner id |
| Audit | Immutable log of create/update/delete/login and every leave (and later workflow) decision |

## Leave (PRD §08) — when leave ships to API

- Line approver vs HR step must match `current_step` and requester’s place in hierarchy.
- Statutory leave: line reject must be rejected by the API.
- Status machine: Draft → Pending line approval → Pending HR verification → Approved | Rejected | Returned | Cancelled.
- Balance, notice period, and blackout checks on submit and on HR verify.

## Update log

| Date | Change |
|------|--------|
| 2026-10-27 | Initial checklist from M0 audit (EMP PRD v3.0) |
