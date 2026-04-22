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
    <div className="bg-white border border-[#8B6A3D]/20 p-16 text-center animate-in fade-in duration-700">
      <div className="text-2xl mb-6 text-[#8B6A3D]">
        {meta.icon}
      </div>

      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-rose-500 mb-4">
        {meta.label}{error?.status ? ` · ${error.status}` : ""}
      </div>

      <p className="font-display text-xl text-[#8B6A3D] mb-10 max-w-sm mx-auto leading-relaxed">
        {error?.message || "An unexpected error occurred."}
      </p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="px-8 py-3 border border-[#8B6A3D] text-[#8B6A3D] hover:bg-[#8B6A3D] hover:text-white transition-all duration-300 text-[10px] uppercase tracking-widest"
        >
          Retry Connection ↻
        </button>
      )}
    </div>
  );
}