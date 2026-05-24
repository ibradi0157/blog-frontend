import { cn } from '@/lib/cn';

function Bone({ className }: { className?: string }) {
  return (
    <div className={cn('animate-pulse rounded bg-[var(--bg-hover)]', className)} />
  );
}

export function ArticleCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn('card flex flex-col overflow-hidden', className)}>
      {/* Cover skeleton */}
      <Bone className="h-48 w-full rounded-none" />

      <div className="flex flex-1 flex-col gap-3 p-5">
        <Bone className="h-3 w-20" />
        <Bone className="h-5 w-full" />
        <Bone className="h-5 w-3/4" />
        <Bone className="h-4 w-full" />
        <Bone className="h-4 w-5/6" />

        <div className="mt-auto flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Bone className="h-6 w-6 rounded-full" />
            <div className="space-y-1">
              <Bone className="h-3 w-20" />
              <Bone className="h-2.5 w-14" />
            </div>
          </div>
          <div className="flex gap-3">
            <Bone className="h-3 w-10" />
            <Bone className="h-3 w-10" />
          </div>
        </div>
      </div>
    </div>
  );
}