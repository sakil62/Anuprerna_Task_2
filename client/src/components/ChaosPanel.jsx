import { useChaosStore } from "../store/chaosStore";

const MODES = [
  { key: "badUrl",       label: "Bad URL",      desc: "502 network failure",   color: "amber" },
  { key: "force404",     label: "Force 404",    desc: "HTTP 404 Not Found",    color: "rose"  },
  { key: "force500",     label: "Force 500",    desc: "HTTP 500 Server Error", color: "rose"  },
  { key: "forceTimeout", label: "Timeout",      desc: "Abort after 5s",        color: "cyan"  },
];

const colorMap = {
  amber: { border: "border-amber-400/30", activeBg: "bg-amber-400/10", text: "text-amber-400", hover: "hover:border-amber-400/60 hover:text-amber-300" },
  rose:  { border: "border-rose-400/30",  activeBg: "bg-rose-400/10",  text: "text-rose-400",  hover: "hover:border-rose-400/60 hover:text-rose-300"  },
  cyan:  { border: "border-cyan-400/30",  activeBg: "bg-cyan-400/10",  text: "text-cyan-400",  hover: "hover:border-cyan-400/60 hover:text-cyan-300"  },
};

export default function ChaosPanel() {
  const store = useChaosStore();
  const anyActive = MODES.some(m => store[m.key]);

  return (
    <div className="bg-rose-neon/5 border border-rose-neon/20 rounded-xl p-4 mt-4">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-rose-neon text-xs font-mono font-700 tracking-widest uppercase">⚡ Chaos Mode</span>
        {anyActive && (
          <button onClick={store.clearChaos} className="ml-auto text-xs font-mono text-slate-500 hover:text-white transition-colors">
            clear
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        {MODES.map(({ key, label, desc, color }) => {
          const c = colorMap[color];
          const active = store[key];
          return (
            <button
              key={key}
              onClick={() => store.setMode(key)}
              className={`flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all text-xs font-mono
                ${active ? `${c.activeBg} ${c.border} ${c.text}` : `border-ink-600 text-slate-500 ${c.hover}`}`}
            >
              <span className="font-600">{label}</span>
              <span className="opacity-60">{active ? "✓ ON" : desc}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}