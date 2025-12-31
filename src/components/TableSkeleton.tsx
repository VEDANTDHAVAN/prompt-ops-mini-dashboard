export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse divide-y">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 bg-muted" />
      ))}
    </div>
  );
}
