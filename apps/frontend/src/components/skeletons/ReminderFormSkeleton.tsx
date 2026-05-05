import { Skeleton } from '../ui/Skeleton';

export function ReminderFormSkeleton() {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-6">
        <Skeleton className="h-10 w-full" />
        <div className="grid grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-10 w-full" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} className="h-9 w-16 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-20 w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-5 w-9 rounded-full" />
        </div>
      </div>
      <div className="flex justify-end gap-3">
        <Skeleton className="h-10 w-20" />
        <Skeleton className="h-10 w-36" />
      </div>
    </div>
  );
}
