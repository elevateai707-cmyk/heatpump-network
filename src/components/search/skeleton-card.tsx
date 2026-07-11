/**
 * Skeleton Card — Loading placeholder for search results
 */

export function SkeletonCard() {
  return (
    <div className="card-base p-5">
      <div className="flex gap-4">
        <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl skeleton shrink-0" />
        <div className="flex-1 space-y-3">
          <div className="h-5 w-48 skeleton rounded" />
          <div className="h-3 w-64 skeleton rounded" />
          <div className="flex gap-4">
            <div className="h-3 w-24 skeleton rounded" />
            <div className="h-3 w-24 skeleton rounded" />
          </div>
          <div className="flex gap-2">
            <div className="h-5 w-16 skeleton rounded-full" />
            <div className="h-5 w-20 skeleton rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
