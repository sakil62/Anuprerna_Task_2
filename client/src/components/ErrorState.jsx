const TYPE_META = {
  timeout:    { icon: "⏱", label: "Request Timeout" },
  network:    { icon: "📡", label: "Connection Error" },
  http:       { icon: "🔥", label: "Server Error" },
  malformed:  { icon: "⚠", label: "Data Error" },
  validation: { icon: "⚠", label: "Validation Error" },
  default:    { icon: "⚠", label: "System Error" },
};

export default function ErrorState({ error, onRetry }) {
  const meta = TYPE_META[error?.type] || TYPE_META.default;

  return (
    <div className="bg-white border border-ink-600/10 p-16 text-center animate-in fade-in duration-700">
      <div className="text-2xl mb-6 text-ink-950">{meta.icon}</div>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-rose-neon mb-4">
        {meta.label}{error?.status ? ` · ${error.status}` : ""}
      </div>
      <p className="font-display text-xl text-ink-950 mb-10 max-w-sm mx-auto leading-relaxed">
        {error?.message || "An unexpected error occurred."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-8 py-3 border border-ink-950 text-ink-950 hover:bg-ink-950 hover:text-white transition-all duration-300 text-[10px] uppercase tracking-widest"
        >
          Retry Connection ↻
        </button>
      )}
    </div>
  );
}