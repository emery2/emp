# EMP Solution Overview (v2.0) — working summary

Canonical PDF: [`source/EMP_Solution_Overview_v2.0.pdf`](./source/EMP_Solution_Overview_v2.0.pdf)  
Extract: [`source/EMP_Solution_Overview_v2.0.extracted.txt`](./source/EMP_Solution_Overview_v2.0.extracted.txt)

## Architecture snapshot

- Multi-tenant SaaS; shared schema + `tenant_id` / RLS (backend)  
- Modular services with always-on core + optional entitlements  
- Shared Party / item / reference masters; module profiles  
- React + FastAPI target stack; frontend currently mock-backed  

## Audience

Stakeholders and engineers needing a short picture of EMP without reading the full PRD. For build decisions, use **PRD v3.1** + **design.md**.
