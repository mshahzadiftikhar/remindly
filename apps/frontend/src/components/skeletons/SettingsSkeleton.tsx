import { Skeleton } from '../ui/Skeleton';

export function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm space-y-4"
        >
          <Skeleton className="h-4 w-28" />
          <div className="space-y-3">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}
