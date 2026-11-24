// Grey placeholder cards shown while products are loading from the API
export default function ProductCardSkeleton({ count = 4 }) {
  return Array.from({ length: count }).map((_, i) => (
    <div
      key={i}
      className="animate-pulse overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200/60"
    >
      <div className="aspect-[4/3] bg-slate-200" />
      <div className="space-y-2 p-3">
        <div className="h-3 w-3/4 rounded bg-slate-200" />
        <div className="h-4 w-1/3 rounded bg-slate-200" />
        <div className="h-8 w-full rounded-lg bg-slate-100" />
      </div>
    </div>
  ));
}
