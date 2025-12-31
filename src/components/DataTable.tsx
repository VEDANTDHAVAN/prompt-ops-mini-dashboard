interface DataTableProps {
  header: React.ReactNode;
  filters: React.ReactNode;
  table: React.ReactNode;
  footer: React.ReactNode;
}

export default function DataTable({
  header,
  filters,
  table,
  footer,
}: DataTableProps) {
  return (
    <div className="space-y-6">
      {header}

      <div className="rounded-lg border bg-card p-4">
        {filters}
      </div>

      <div className="rounded-lg border bg-card overflow-hidden">
        {table}
      </div>

      <div className="flex items-center justify-between">
        {footer}
      </div>
    </div>
  );
}
