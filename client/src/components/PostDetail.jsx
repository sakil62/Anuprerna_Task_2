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
    if (!data?.id) { setError({ type: "malformed", message: "Data missing." }); return; }
    setPost(data);
  }

  useEffect(() => { load(); }, [id, chaos.forceTimeout, chaos.force404, chaos.force500, chaos.badUrl]);

  async function handleDelete() {
    if (!confirm("Remove this entry?")) return;
    setDeleting(true);
    const { error: err } = await api.deletePost(id);
    setDeleting(false);
    if (err) { setError(err); return; }
    setDeleted(true);
  }

  return (
    <div className="fixed inset-0 bg-ink-950/40 backdrop-blur-md flex items-center justify-center z-50 p-6" onClick={onClose}>
      <div 
        className="bg-[#FAFAF9] border border-ink-600/10 shadow-[0_30px_60px_rgba(0,0,0,0.15)] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-12 relative" 
        onClick={e => e.stopPropagation()}
      >
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-8 right-8 text-ink-700 hover:text-ink-950 transition-colors uppercase text-[10px] tracking-widest">
          Close ✕
        </button>

        {loading && (
          <div className="py-24 text-center font-mono text-[10px] uppercase tracking-widest text-ink-700 animate-pulse">Loading Archive...</div>
        )}

        {!loading && error && <ErrorState error={error} onRetry={load} />}

        {!loading && deleted && (
          <div className="text-center py-24">
            <p className="text-ink-950 font-display text-lg">Entry removed.</p>
            <button onClick={onClose} className="mt-8 text-[10px] uppercase tracking-widest underline underline-offset-4 decoration-ink-600">Back to Collection</button>
          </div>
        )}

        {!loading && !error && !deleted && post && !editing && (
          <div className="animate-in fade-in duration-500">
            <div className="font-mono text-[10px] tracking-[0.2em] text-ink-700 mb-8 uppercase">#{post.id} · User {post.userId}</div>
            <h2 className="font-display font-500 text-3xl leading-tight text-ink-950 mb-8 capitalize">{post.title}</h2>
            <p className="text-ink-800 text-base leading-loose font-light mb-12 border-l border-ink-600/20 pl-8">{post.body}</p>
            
            <div className="flex gap-8 border-t border-ink-600/10 pt-8">
              <button onClick={() => setEditing(true)} className="text-[10px] uppercase tracking-widest text-ink-950 hover:text-volt transition-all font-semibold">Edit Entry</button>
              <button onClick={handleDelete} disabled={deleting} className="text-[10px] uppercase tracking-widest text-ink-700 hover:text-rose-neon transition-all font-semibold">
                {deleting ? "Deleting..." : "Delete Entry"}
              </button>
            </div>
          </div>
        )}

        {!loading && !error && !deleted && post && editing && (
          <div className="animate-in slide-in-from-bottom-4 duration-500">
            <h3 className="font-display text-xl mb-8">Edit Details</h3>
            <PostForm post={post} onSuccess={updated => { setPost(updated); setEditing(false); }} onCancel={() => setEditing(false)} />
          </div>
        )}
      </div>
    </div>
  );
}