export default function Pagination({ page, total, limit, onChange }) {
  const totalPages = Math.ceil(total / limit);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const visible = pages.filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1);

  return (
    <div className="flex items-center justify-center gap-6 mt-16 font-mono text-[11px] uppercase tracking-[0.2em]">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 1}
        className="text-ink-700 hover:text-volt disabled:opacity-20 transition-colors"
      >
        Prev
      </button>

      <div className="flex items-center gap-4">
        {visible.map((p, i, arr) => {
          const gap = i > 0 && p - arr[i - 1] > 1;
          return (
            <span key={p} className="flex items-center gap-4">
              {gap && <span className="text-ink-600/30">...</span>}
              <button
                onClick={() => onChange(p)}
                className={`transition-all duration-300 ${
                  p === page 
                    ? "text-ink-950 font-bold border-b border-volt" 
                    : "text-ink-700 hover:text-volt"
                }`}
              >
                {String(p).padStart(2, '0')}
              </button>
            </span>
          );
        })}
      </div>

      <button
        onClick={() => onChange(page + 1)}
        disabled={page === totalPages}
        className="text-ink-700 hover:text-volt disabled:opacity-20 transition-colors"
      >
        Next
      </button>
    </div>
  );
}