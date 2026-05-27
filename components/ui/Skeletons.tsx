export function FoodCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-gray-100 animate-pulse">
      {/* Image placeholder */}
      <div className="h-48 bg-gray-200 skeleton" />
      <div className="p-4 space-y-3">
        {/* Veg + name */}
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gray-200 skeleton" />
          <div className="h-4 bg-gray-200 skeleton rounded w-3/4" />
        </div>
        {/* Description lines */}
        <div className="space-y-1.5">
          <div className="h-3 bg-gray-200 skeleton rounded w-full" />
          <div className="h-3 bg-gray-200 skeleton rounded w-5/6" />
        </div>
        {/* Tags */}
        <div className="flex gap-2">
          <div className="h-5 w-14 bg-gray-200 skeleton rounded-full" />
          <div className="h-5 w-16 bg-gray-200 skeleton rounded-full" />
        </div>
        {/* Price + button */}
        <div className="flex items-center justify-between pt-1">
          <div className="h-7 w-16 bg-gray-200 skeleton rounded" />
          <div className="h-9 w-20 bg-gray-200 skeleton rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function MenuPageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner skeleton */}
      <div className="h-64 md:h-80 bg-gray-200 skeleton" />
      {/* Info bar */}
      <div className="h-14 bg-white border-b border-gray-100" />
      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 9 }).map((_, i) => (
            <FoodCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function OrderCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="h-5 w-32 bg-gray-200 skeleton rounded" />
        <div className="h-6 w-20 bg-gray-200 skeleton rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-3 w-48 bg-gray-200 skeleton rounded" />
        <div className="h-3 w-36 bg-gray-200 skeleton rounded" />
      </div>
      <div className="flex items-center justify-between mt-4">
        <div className="h-6 w-20 bg-gray-200 skeleton rounded" />
        <div className="h-8 w-28 bg-gray-200 skeleton rounded-xl" />
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-card animate-pulse">
      <div className="w-10 h-10 bg-gray-200 skeleton rounded-xl mb-3" />
      <div className="h-8 w-20 bg-gray-200 skeleton rounded mb-1" />
      <div className="h-4 w-24 bg-gray-200 skeleton rounded" />
    </div>
  );
}
