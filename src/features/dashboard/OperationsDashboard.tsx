import { ActionCard, DashboardShell } from '@/features/dashboard/dashboard-shared'

export function OperationsDashboard() {
  return (
    <DashboardShell
      title="Operations dashboard"
      description="Procurement, inventory, and manufacturing work queues."
      stats={[
        { label: 'Open POs', value: 6, href: '/erp/purchasing' },
        { label: 'Receipts due', value: 3, href: '/scm/inventory' },
        { label: 'Work orders', value: 8, href: '/scm/production' },
        { label: 'Suppliers', value: 24, href: '/scm/suppliers' },
      ]}
    >
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <ActionCard
          title="Purchasing"
          body="ERP purchase requests connected to SCM suppliers."
          to="/erp/purchasing"
          label="Open purchasing"
        />
        <ActionCard
          title="Inventory"
          body="Stock movements and receipts for manufacturing consumption."
          to="/scm/inventory"
          label="Open inventory"
        />
        <ActionCard
          title="Production"
          body="Work orders consuming materials and recording finished goods."
          to="/scm/production"
          label="Open production"
        />
      </div>
    </DashboardShell>
  )
}
