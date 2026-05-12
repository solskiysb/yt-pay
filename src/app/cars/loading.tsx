import { CatalogSkeleton } from "@/components/skeletons";

export default function CarsLoading() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Filter bar skeleton */}
      <div className="mb-8 animate-pulse space-y-4">
        <div className="h-8 w-56 rounded bg-stone-200" />
        <div className="flex gap-3">
          <div className="h-10 w-40 rounded-lg bg-stone-100" />
          <div className="h-10 w-40 rounded-lg bg-stone-100" />
          <div className="h-10 w-40 rounded-lg bg-stone-100" />
        </div>
      </div>
      <CatalogSkeleton />
    </div>
  );
}
