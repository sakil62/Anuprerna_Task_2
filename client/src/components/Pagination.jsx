export default function Pagination({ page, total, limit, onChange }) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  return (
    <div className="flex items-center justify-center gap-2 mt-10">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="w-9 h-9 rounded-lg border border-ink-600 text-ink-600 hover:border-volt hover:text-volt disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-mono text-sm flex items-center justify-center"
      >‹</button>

      {visible.map((p, i, arr) => {
        const gap = i > 0 && p - arr[i - 1] > 1;
        return (
          <span key={p} className="flex items-center gap-2">
            {gap && <span className="text-ink-600 font-mono text-sm">…</span>}
            <button
              onClick={() => onChange(p)}
              className={`w-9 h-9 rounded-lg font-mono text-sm transition-colors font-semibold
                ${p === page
                  ? "bg-volt text-ink-950 border border-volt"
                  : "border border-ink-600 text-slate-400 hover:border-volt hover:text-volt"}`}
            >{p}</button>
          </span>
        );
      })}

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="w-9 h-9 rounded-lg border border-ink-600 text-ink-600 hover:border-volt hover:text-volt disabled:opacity-30 disabled:cursor-not-allowed transition-colors font-mono text-sm flex items-center justify-center"
      >›</button>
    </div>
  );
}