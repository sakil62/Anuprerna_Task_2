import ChaosPanel from "./ChaosPanel";
import { useChaosStore } from "../store/chaosStore";

export default function Layout({ children }) {
  const chaos = useChaosStore();
  const anyActive = ["forceTimeout","force404","force500","badUrl"].some(k => chaos[k]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FAFAF9]/80 backdrop-blur-md border-b border-[#8B6A3D]/20 px-8 py-6 flex items-center justify-between">
        <span className="font-display font-700 text-2xl tracking-tight text-[#8B6A3D]">
          Anuprerna
        </span>
        
        <div className="flex items-center gap-8">
          {anyActive && (
            <span className="px-4 py-1 rounded-full border border-rose-500/30 text-rose-500 font-mono text-[9px] uppercase tracking-widest">
              System Disturbance
            </span>
          )}

          <a
            href="https://jsonplaceholder.typicode.com"
            target="_blank"
            rel="noreferrer"
            className="font-mono text-[11px] text-[#8B6A3D] hover:text-[#6f532f] transition-colors duration-300"
          >
            API_REFERENCE ↗
          </a>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-72 shrink-0 border-r border-[#8B6A3D]/20 p-8 hidden lg:block">
          <div className="font-display text-[10px] text-[#8B6A3D] uppercase tracking-[0.2em] mb-8">
            Navigation
          </div>
          
          <div className="space-y-8">
            {[
              ["/posts", "List all entries"],
              ["/posts/:id", "Retrieve detail"],
              ["/create", "Compose new"],
            ].map(([path, desc]) => (
              <div key={path} className="group cursor-pointer">
                <div className="font-mono text-sm text-ink-950 group-hover:text-[#8B6A3D] transition-colors">
                  {path}
                </div>
                <div className="font-display text-[13px] text-[#8B6A3D]/70 italic">
                  {desc}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-[#8B6A3D]/20">
            <ChaosPanel />
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-8 lg:p-16">
          <div className="max-w-5xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}