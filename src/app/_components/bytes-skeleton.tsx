export function BytesSkeleton() {
  return (
    <div className="flex w-full gap-2 md:gap-4">
      {/* Profile image skeleton */}
      <div className="size-10 flex-shrink-0 rounded-full bg-gray-200 dark:bg-gray-700 md:size-16 animate-pulse"></div>
      
      <div className="flex-1">
        {/* User info and date skeleton */}
        <div className="mb-3 flex items-center gap-2">
          <div className="h-4 w-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
          <div className="h-3 w-12 bg-gray-200 dark:bg-gray-700 rounded animate-pulse"></div>
        </div>
        
        {/* Content card skeleton */}
        <div className="mb-4 rounded-xl border border-b-2 border-gray-200 p-6 dark:border-gray-700">
          <div className="space-y-2 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/6"></div>
          </div>
        </div>
        
        {/* Tags skeleton */}
        <div className="mb-4 flex flex-wrap gap-2">
          <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div className="h-6 w-16 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
          <div className="h-6 w-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}