# EMP Project Brief (v2.0) — working summary

Canonical PDF: [`source/EMP_Project_Brief_v2.0.pdf`](./source/EMP_Project_Brief_v2.0.pdf)  
Extract: [`source/EMP_Project_Brief_v2.0.extracted.txt`](./source/EMP_Project_Brief_v2.0.extracted.txt)

Use this summary for orientation; **PRD v3.1** remains authoritative for requirements.

## Intent

EMP is a modular multi-tenant SaaS platform. Clients enable services independently. Foundation first, then HR + CRM as the core product, then operations and intelligence modules.

## Delivery emphasis (aligns with PRD roadmap)

1. Foundation: auth, org/hierarchy, RBAC, **entitlements/manifests**  
2. Core product: HR (incl. leave) + CRM  
3. Projects, Service Desk, PRM  
4. EPM + workflow builder  
5. Optional ops services (Sales, Procurement, Inventory, Finance, …) via addendum  
6. Advanced enterprise

## Frontend implication

Build against mock repositories and module manifests. Do not assume peer modules. See `MODULE_MODEL.md`.
