export function CarCardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl bg-white ring-1 ring-stone-200">
      <div className="aspect-[4/3] rounded-t-xl bg-stone-200" />
      <div className="space-y-3 p-4">
        <div className="h-5 w-3/4 rounded bg-stone-200" />
        <div className="h-6 w-1/2 rounded bg-stone-200" />
        <div className="flex gap-4">
          <div className="h-4 w-24 rounded bg-stone-100" />
          <div className="h-4 w-20 rounded bg-stone-100" />
        </div>
      </div>
    </div>
  );
}

export function CatalogSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <CarCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse space-y-6">
      <div className="h-8 w-48 rounded bg-stone-200" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-28 rounded-xl bg-white ring-1 ring-stone-200">
            <div className="space-y-3 p-5">
              <div className="h-4 w-20 rounded bg-stone-100" />
              <div className="h-8 w-16 rounded bg-stone-200" />
            </div>
          </div>
        ))}
      </div>
      <div className="h-64 rounded-xl bg-white ring-1 ring-stone-200" />
    </div>
  );
}
