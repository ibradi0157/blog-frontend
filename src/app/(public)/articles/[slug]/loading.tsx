export default function ArticleLoading() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 animate-pulse">
      <div className="w-full aspect-[21/9] rounded-2xl bg-[var(--bg-hover)] mb-8" />
      <div className="h-10 bg-[var(--bg-hover)] rounded-lg w-3/4 mb-4" />
      <div className="h-6 bg-[var(--bg-hover)] rounded-lg w-1/2 mb-8" />
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-4 bg-[var(--bg-hover)] rounded mb-3 last:w-2/3" />
      ))}
    </div>
  );
}
