"use client";

export default function Pagination({
  page, pageSize, total, onPageChange,  
}: {
  page: number, pageSize: number, total: number,
  onPageChange: (page: number) => void,
}) {
  const totalPages = Math.ceil(total / pageSize);
  
  return (
    <div className="flex items-center gap-4">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Prev
      </button>

      <span>
        Page {page} of {totalPages || 1}
      </span>

      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </button>
    </div>
  )
}