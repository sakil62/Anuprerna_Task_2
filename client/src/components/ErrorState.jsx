const TYPE_META = {
  timeout:  { icon: "⏱",  label: "Timeout",       color: "text-cyan-400  border-cyan-400/30  bg-cyan-400/5"  },
  network:  { icon: "📡",  label: "Network Error", color: "text-amber-400 border-amber-400/30 bg-amber-400/5" },
  http:     { icon: "🔥",  label: "HTTP Error",    color: "text-rose-400  border-rose-400/30  bg-rose-400/5"  },
  malformed:{ icon: "💀",  label: "Bad Payload",   color: "text-violet-400 border-violet-400/30 bg-violet-400/5" },
  validation:{ icon: "⚠️", label: "Validation",    color: "text-amber-400 border-amber-400/30 bg-amber-400/5" },
  default:  { icon: "❓",  label: "Unknown Error", color: "text-rose-400  border-rose-400/30  bg-rose-400/5"  },
};

export default function ErrorState({ error, onRetry }) {
  const meta = TYPE_META[error?.type] || TYPE_META.default;
  const [color1, color2, color3] = meta.color.split(" ");

  return (
    <div className={`rounded-xl border ${color2} ${color3} p-10 text-center animate-fadeUp`}>
      <div className="text-5xl mb-3">{meta.icon}</div>
      <span className={`inline-block px-3 py-1 rounded-full text-xs font-mono font-semibold border ${color2} ${color1} mb-3`}>
        {meta.label}{error?.status ? ` · ${error.status}` : ""}
      </span>
      <p className={`font-mono text-sm mb-6 text-ink-600 max-w-md mx-auto leading-relaxed ${color1}`}>
        {error?.message || "Something went wrong."}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-5 py-2 rounded-lg bg-volt text-ink-950 font-display font-700 text-sm hover:bg-volt-dark transition-colors"
        >
          ↺ Retry
        </button>
      )}
    </div>
  );
}