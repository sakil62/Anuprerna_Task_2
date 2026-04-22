import { useChaosStore } from "../store/chaosStore";

const MODES = [
  { key: "badUrl", label: "Bad URL", desc: "502 Failure" },
  { key: "force404", label: "Force 404", desc: "Not Found" },
  { key: "force500", label: "Force 500", desc: "Server Error" },
  { key: "forceTimeout", label: "Timeout", desc: "5s Limit" },
];

export default function ChaosPanel() {
  const store = useChaosStore();
  const anyActive = MODES.some(m => store[m.key]);

  return (
    <div className="bg-[#F5F5F4] border border-[#8B6A3D]/20 p-8">
      <div className="flex items-center justify-between mb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8B6A3D] font-bold">
          Chaos_Engine
        </span>

        {anyActive && (
          <button 
            onClick={store.clearChaos} 
            className="text-[10px] uppercase tracking-widest text-[#8B6A3D]/70 hover:text-[#8B6A3D] transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {MODES.map(({ key, label, desc }) => {
          const active = store[key];
          return (
            <button
              key={key}
              onClick={() => store.setMode(key)}
              className={`flex items-center justify-between py-3 border-b transition-all duration-300 ${
                active 
                  ? "border-[#8B6A3D] text-[#8B6A3D]" 
                  : "border-[#8B6A3D]/30 text-[#8B6A3D]/70 hover:border-[#8B6A3D]/60"
              }`}
            >
              <span className="text-[11px] font-medium uppercase tracking-wider">
                {label}
              </span>

              <span className="text-[9px] uppercase tracking-widest opacity-60">
                {active ? "Active" : desc}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}