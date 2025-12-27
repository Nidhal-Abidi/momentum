export function CalendarSkeleton() {
  return (
    <div className="w-full animate-pulse">
      {/* Header Skeleton */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex-1">
          <div className="mb-2 h-10 w-48 rounded-lg bg-stone-200 dark:bg-stone-800" />
          <div className="h-5 w-96 rounded bg-stone-200 dark:bg-stone-800" />
        </div>
        <div className="h-12 w-64 rounded-xl bg-stone-200 dark:bg-stone-800" />
      </div>

      {/* Navigation Skeleton */}
      <div className="mb-8 flex items-center justify-center gap-6">
        <div className="size-12 rounded-xl bg-stone-200 dark:bg-stone-800" />
        <div className="h-8 w-48 rounded bg-stone-200 dark:bg-stone-800" />
        <div className="size-12 rounded-xl bg-stone-200 dark:bg-stone-800" />
      </div>

      {/* Calendar Grid Skeleton */}
      <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm dark:border-stone-800 dark:bg-stone-950"
          >
            {/* Domain Header Skeleton */}
            <div className="border-b border-stone-100 bg-linear-to-br from-stone-50 to-white px-6 py-4 dark:border-stone-800 dark:from-stone-900 dark:to-stone-950">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-stone-200 dark:bg-stone-800" />
                <div className="flex-1">
                  <div className="mb-2 h-5 w-32 rounded bg-stone-200 dark:bg-stone-800" />
                  <div className="h-3 w-24 rounded bg-stone-200 dark:bg-stone-800" />
                </div>
              </div>
            </div>

            <div className="p-6">
              {/* Weekday Headers Skeleton */}
              <div className="mb-3 grid grid-cols-7 gap-2">
                {[1, 2, 3, 4, 5, 6, 7].map((j) => (
                  <div
                    key={j}
                    className="h-4 rounded bg-stone-200 dark:bg-stone-800"
                  />
                ))}
              </div>

              {/* Calendar Grid Skeleton */}
              <div className="mb-5 grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, k) => (
                  <div
                    key={k}
                    className="aspect-square rounded-xl bg-stone-200 dark:bg-stone-800"
                  />
                ))}
              </div>

              {/* Progress Bar Skeleton */}
              <div className="mb-4 space-y-2">
                <div className="flex justify-between">
                  <div className="h-3 w-24 rounded bg-stone-200 dark:bg-stone-800" />
                  <div className="h-3 w-12 rounded bg-stone-200 dark:bg-stone-800" />
                </div>
                <div className="h-2.5 rounded-full bg-stone-200 dark:bg-stone-800" />
              </div>

              {/* Streak Display Skeleton */}
              <div className="rounded-lg bg-stone-50 p-3 dark:bg-stone-900">
                <div className="flex items-center justify-between">
                  <div className="h-6 w-24 rounded bg-stone-200 dark:bg-stone-800" />
                  <div className="h-8 w-px bg-stone-200 dark:bg-stone-700" />
                  <div className="h-6 w-24 rounded bg-stone-200 dark:bg-stone-800" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
