# Shared libraries

- `policy/` — `can(user, action, resource, context)` / `decide(...)` (F1+)
- `repositories/` — repository interfaces + mock implementations; all filtered by `tenantId`
- `contracts/` — typed cross-service contracts only (no feature→feature imports)

Do not import mock fixtures from feature UI; go through repositories/API.
