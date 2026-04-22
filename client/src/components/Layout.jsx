import ChaosPanel from "./ChaosPanel";
import { useChaosStore } from "../store/chaosStore";

export default function Layout({ children }) {
  const chaos = useChaosStore();
  const anyActive = ["forceTimeout","force404","force500","badUrl"].some(k => chaos[k]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[#FAFAF9]/80 backdrop-blur-md border-b border-ink-600/10 px-8 py-6 flex items-center justify-between">
        <span className="font-display font-700 text-2xl tracking-tight text-ink-950">
          Anuprerna
        </span>
        
        <div className="flex items-center gap-8">
          {anyActive && (
            <span className="px-4 py-1 rounded-full border border-rose-neon/20 text-rose-neon font-mono text-[9px] uppercase tracking-widest">
              System Disturbance
            </span>
          )}
          <a href="https://jsonplaceholder.typicode.com" target="_blank" rel="noreferrer"
            className="font-mono text-[11px] text-ink-700 hover:text-volt transition-colors duration-300">
            API_REFERENCE ↗
          </a>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-72 shrink-0 border-r border-ink-600/10 p-8 hidden lg:block">
          <div className="font-display text-[10px] text-ink-700 uppercase tracking-[0.2em] mb-8">Navigation</div>
          
          <div className="space-y-8">
            {[
              ["/posts", "List all entries"],
              ["/posts/:id", "Retrieve detail"],
              ["/create", "Compose new"],
            ].map(([path, desc]) => (
              <div key={path} className="group cursor-pointer">
                <div className="font-mono text-sm text-ink-950 group-hover:text-volt transition-colors">{path}</div>
                <div className="font-display text-[13px] text-ink-700 italic">{desc}</div>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-ink-600/10">
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