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
        className="text-[#8B6A3D]/70 hover:text-[#8B6A3D] disabled:opacity-20 transition-colors"
      >
        Prev
      </button>

      <div className="flex items-center gap-4">
        {visible.map((p, i, arr) => {
          const gap = i > 0 && p - arr[i - 1] > 1;
          return (
            <span key={p} className="flex items-center gap-4">
              {gap && <span className="text-[#8B6A3D]/30">...</span>}
              <button
                onClick={() => onChange(p)}
                className={`transition-all duration-300 ${
                  p === page 
                    ? "text-[#8B6A3D] font-bold border-b border-[#8B6A3D]" 
                    : "text-[#8B6A3D]/70 hover:text-[#8B6A3D]"
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
        className="text-[#8B6A3D]/70 hover:text-[#8B6A3D] disabled:opacity-20 transition-colors"
      >
        Next
      </button>
    </div>
  );
}