import ChaosPanel from "./ChaosPanel";
import { useChaosStore } from "../store/chaosStore";

export default function Layout({ children }) {
  const chaos = useChaosStore();
  const anyActive = ["forceTimeout","force404","force500","badUrl"].some(k => chaos[k]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-ink-950/90 backdrop-blur border-b border-ink-600 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-volt animate-pulseDot" />
          <span className="font-display font-800 text-xl tracking-tight">Post<span className="text-volt">Vault</span></span>
        </div>
        <div className="flex items-center gap-3">
          {anyActive && (
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-neon/10 border border-rose-neon/30 text-rose-neon font-mono text-xs font-600">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-neon animate-pulseDot" />
              Chaos Active
            </span>
          )}
          <a href="https://jsonplaceholder.typicode.com" target="_blank" rel="noreferrer"
            className="font-mono text-xs text-slate-500 hover:text-slate-300 transition-colors">
            jsonplaceholder.typicode.com ↗
          </a>
        </div>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <aside className="w-64 shrink-0 bg-ink-900 border-r border-ink-600 p-4 hidden lg:block">
          <div className="font-mono text-xs text-slate-600 uppercase tracking-widest mb-3">Endpoints</div>
          {[
            ["GET /posts", "List all posts"],
            ["GET /posts/:id", "Single post"],
            ["POST /posts", "Create post"],
            ["PUT /posts/:id", "Replace post"],
            ["PATCH /posts/:id", "Update field"],
            ["DELETE /posts/:id", "Remove post"],
          ].map(([ep, desc]) => (
            <div key={ep} className="mb-2.5">
              <div className="font-mono text-xs text-volt">{ep}</div>
              <div className="font-mono text-xs text-slate-600">{desc}</div>
            </div>
          ))}
          <ChaosPanel />
        </aside>

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}