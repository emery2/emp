# Shared libraries

- `policy/` — future home of `can(user, action, resource, context)` (M1+)
- `repositories/` — repository interfaces + mock implementations (M1+)

Do not import mock fixtures from feature UI; go through repositories/API.
