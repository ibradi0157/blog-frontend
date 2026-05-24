export function CommentSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="flex gap-3">
        <div className="w-9 h-9 rounded-full bg-[var(--bg-hover)] flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex gap-2 items-center">
            <div className="h-3.5 w-24 rounded bg-[var(--bg-hover)]" />
            <div className="h-3 w-16 rounded bg-[var(--bg-hover)]" />
          </div>
          <div className="h-3.5 w-full rounded bg-[var(--bg-hover)]" />
          <div className="h-3.5 w-4/5 rounded bg-[var(--bg-hover)]" />
        </div>
      </div>
    </div>
  );
}

export function CommentListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-6">
      {Array.from({ length: count }).map((_, i) => (
        <CommentSkeleton key={i} />
      ))}
    </div>
  );
}