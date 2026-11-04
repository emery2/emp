# Server-side enforcement requirements (FastAPI)

Frontend permission checks, module flags, feature flags, and demo-user switching are **prototype UX only**. Production FastAPI must enforce every rule below independently of the browser.

## Always enforce

| Area | Requirement |
|------|-------------|
| Tenant isolation | Every query filters by `tenant_id`; PostgreSQL RLS; never trust client-sent tenant |
| AuthN | Valid JWT/session; inactive users rejected |
| AuthZ | Role + permission + record scope (org / department / self / owner) via server-side `can` equivalent |
| Self-approval | Reject any approval where actor is the requester |
| Workflow state | Only allow transitions valid for the current step and actor role |
| Module flags | Disabled modules return 403 even if the user has a permission key |
| Feature flags | Disabled features return 403; UI “plan unavailable” is not sufficient |
| Feature config | Validate body against the feature’s Zod/JSON schema version; reject unknown keys outside schema |
| Config versioning | Never mutate historical config rows; new saves insert a version; in-progress entities keep `config_version_id` |
| External / Partner | Restrict to rows linked to that user’s customer or partner id |
| Audit | Immutable log of create/update/delete/login, leave decisions, feature entitlement changes, and feature config versions |

## Leave (PRD §08) — when leave ships to API

- Line approver vs HR step must match `current_step` and requester’s place in hierarchy.
- Statutory leave: line reject must be rejected by the API.
- Status machine: Draft → Pending line approval → Pending HR verification → Approved | Rejected | Returned | Cancelled.
- Balance, notice period, and blackout checks on submit and on HR verify.
- Feature `hr.leave` must be entitled for the tenant.

## Feature entitlements (F1+)

- Super Administrator (platform) may toggle module and feature entitlements **per tenant**.
- Organization Administrator / HR may change **configuration** only for features already entitled and only within `configureRoles` on the manifest.
- Enabling a feature requires its owning module to be enabled.
- Disabling a module clears effective access to its features without deleting stored data.
- `features.entitle` and `features.configure` are distinct permissions.

## Digital signatures (planned F5 — document now)

Real external provider integration (e.g. DocuSign) will require:

- Per-tenant or platform-level account credentials (secrets never in the browser).
- Webhooks for envelope status (sent, completed, declined, voided) with signature verification.
- Durable storage of the signed document bytes and certificate of completion.
- Mapping of EMP signature-request ids to provider envelope ids.
- Legal review before launch: validity differs by country and document type.

Frontend F5 ships a **mock** adapter only.

## Profile self-service (F2)

- Field sensitivity from tenant feature config (`direct` | `needs_approval` | `locked`).
- Direct fields apply immediately and must audit who/when; notify HR (server-side notification).
- Approval fields create a change request; only `profile.approve.hr` may decide; **no self-approval**.
- HR staff / HR Head own changes escalate to HR Head (or Executive fallback); assigned approver enforced.
- Reject / return require a reason.
- Withdraw only by requester while pending/returned.
- Apply approvals using the **`config_version_id` frozen at submit**, not the latest config.
- Immutable field history: every applied change stores from/to, actor, reason, optional request id.

## Goals / evaluations (planned F3–F4)

- Segregation of duties: no self-approval of goals, evaluations, or appeals.
- Evaluation visibility: deny by default except employee, reviewer chain, and HR.
- Store immutable history of ratings and comments.
- Bind each in-progress goal set / evaluation cycle to the `config_version_id` active at start.

## Update log

| Date | Change |
|------|--------|
| 2026-10-27 | Initial checklist from M0 audit (EMP PRD v3.0) |
| 2026-11-03 | F1: feature entitlements, config versioning, `can()`, signature integration notes |
| 2026-11-03 | F2: profile self-service sensitivity, HR approval, config snapshot, field history |
