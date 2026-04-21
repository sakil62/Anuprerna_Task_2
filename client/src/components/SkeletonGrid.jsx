function SkeletonCard() {
  return (
    <div className="bg-ink-800 border border-ink-600 rounded-xl p-5">
      <div className="skel-line h-3 w-16 rounded mb-4" />
      <div className="skel-line h-4 w-full rounded mb-2" />
      <div className="skel-line h-4 w-3/4 rounded mb-5" />
      <div className="skel-line h-3 w-full rounded mb-2" />
      <div className="skel-line h-3 w-5/6 rounded mb-2" />
      <div className="skel-line h-3 w-2/3 rounded mb-5" />
      <div className="flex gap-2">
        <div className="skel-line h-7 flex-1 rounded" />
        <div className="skel-line h-7 flex-1 rounded" />
        <div className="skel-line h-7 flex-1 rounded" />
      </div>
    </div>
  );
}

export default function SkeletonGrid({ count = 12 }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
}