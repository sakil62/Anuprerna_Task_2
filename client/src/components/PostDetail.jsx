import { useState, useEffect } from "react";
import { api } from "../api/client";
import ErrorState from "./ErrorState";
import PostForm from "./PostForm";
import { useChaosStore } from "../store/chaosStore";

export default function PostDetail({ id, onClose }) {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [deleted, setDeleted] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const chaos = useChaosStore();

  async function load() {
    setLoading(true); setError(null);
    const { data, error: err } = await api.getPost(id);
    setLoading(false);
    if (err) { setError(err); return; }
    if (!data?.id) { setError({ type: "malformed", message: "Post data is malformed or missing." }); return; }
    setPost(data);
  }

  useEffect(() => { load(); }, [id, chaos.forceTimeout, chaos.force404, chaos.force500, chaos.badUrl]);

  async function handleDelete() {
    if (!confirm("Delete this post?")) return;
    setDeleting(true);
    const { error: err } = await api.deletePost(id);
    setDeleting(false);
    if (err) { setError(err); return; }
    setDeleted(true);
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-ink-900 border border-ink-600 rounded-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 animate-fadeUp" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <span className="font-mono text-xs text-volt">GET /posts/{id}</span>
          <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors text-lg">✕</button>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16 gap-3 text-slate-400 font-mono text-sm">
            <svg className="animate-spin w-5 h-5 text-volt" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" strokeDasharray="31.4" strokeDashoffset="10" />
            </svg>
            Loading post…
          </div>
        )}

        {!loading && error && <ErrorState error={error} onRetry={load} />}

        {!loading && deleted && (
          <div className="text-center py-10">
            <div className="text-4xl mb-3">🗑</div>
            <p className="text-emerald-neon font-mono text-sm">Post #{id} deleted successfully.</p>
            <button onClick={onClose} className="mt-4 px-4 py-2 bg-volt text-ink-950 rounded-lg text-sm font-bold hover:bg-volt-dark transition-colors">Close</button>
          </div>
        )}

        {!loading && !error && !deleted && post && !editing && (
          <div className="animate-fadeUp">
            <div className="font-mono text-xs text-slate-500 mb-2">ID: {post.id} · User: {post.userId}</div>
            <h2 className="font-display font-700 text-xl leading-snug mb-4 capitalize">{post.title}</h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">{post.body}</p>
            <div className="flex gap-3">
              <button onClick={() => setEditing(true)} className="flex-1 py-2 border border-volt/40 text-volt rounded-lg text-sm font-bold hover:bg-volt/10 transition-colors">✏️ Edit (PUT)</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-2 border border-rose-neon/40 text-rose-neon rounded-lg text-sm font-bold hover:bg-rose-neon/10 disabled:opacity-40 transition-colors">
                {deleting ? "⏳ Deleting…" : "🗑 Delete"}
              </button>
            </div>
          </div>
        )}

        {!loading && !error && !deleted && post && editing && (
          <PostForm post={post} onSuccess={updated => { setPost(updated); setEditing(false); }} onCancel={() => setEditing(false)} />
        )}
      </div>
    </div>
  );
}