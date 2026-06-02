'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: number[] = [];
  const start = Math.max(1, page - 2);
  const end = Math.min(totalPages, page + 2);
  for (let i = start; i <= end; i++) pages.push(i);

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page <= 1}
        className="flex items-center gap-1 px-3 py-2.5 text-sm font-medium text-pcd-text bg-white border border-pcd-border rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Prev
      </button>
      {start > 1 && (
        <>
          <button onClick={() => onPageChange(1)} className="w-10 h-10 text-sm font-medium text-pcd-text bg-white border border-pcd-border rounded-xl hover:bg-blue-50 hover:text-primary transition-colors">1</button>
          {start > 2 && <span className="text-pcd-muted px-1">...</span>}
        </>
      )}
      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-10 h-10 text-sm font-medium rounded-xl transition-colors ${
            p === page
              ? 'bg-primary text-white'
              : 'text-pcd-text bg-white border border-pcd-border hover:bg-blue-50 hover:text-primary'
          }`}
        >
          {p}
        </button>
      ))}
      {end < totalPages && (
        <>
          {end < totalPages - 1 && <span className="text-pcd-muted px-1">...</span>}
          <button onClick={() => onPageChange(totalPages)} className="w-10 h-10 text-sm font-medium text-pcd-text bg-white border border-pcd-border rounded-xl hover:bg-blue-50 hover:text-primary transition-colors">{totalPages}</button>
        </>
      )}
      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page >= totalPages}
        className="flex items-center gap-1 px-3 py-2.5 text-sm font-medium text-pcd-text bg-white border border-pcd-border rounded-xl hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Next <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
