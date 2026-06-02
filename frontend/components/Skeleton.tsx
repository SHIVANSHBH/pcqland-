export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse bg-white border border-pcd-border rounded-2xl overflow-hidden">
      <div className="h-48 bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-100 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-full" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="flex items-center gap-2">
          <div className="h-5 bg-gray-100 rounded w-20" />
          <div className="h-4 bg-gray-100 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="animate-pulse bg-white border border-pcd-border rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-gray-100 rounded w-40" />
          <div className="h-3 bg-gray-100 rounded w-24" />
        </div>
        <div className="space-y-2 text-right">
          <div className="h-4 bg-gray-100 rounded w-20 ml-auto" />
          <div className="h-4 bg-gray-100 rounded w-14 ml-auto" />
        </div>
      </div>
    </div>
  );
}

export function TableRowSkeleton({ cols = 5 }: { cols?: number }) {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-3 py-3">
          <div className="h-4 bg-gray-100 rounded w-3/4" />
        </td>
      ))}
    </tr>
  );
}
