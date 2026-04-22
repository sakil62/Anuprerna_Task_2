import { useState } from "react";
import { api } from "../api/client";
import ErrorState from "./ErrorState";

export default function PostForm({ post, onSuccess, onCancel }) {
  const editing = !!post;
  const [title, setTitle] = useState(post?.title || "");
  const [body, setBody] = useState(post?.body || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function submit(e) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError({ type: "validation", message: "Title and content required." });
      return;
    }
    setLoading(true); setError(null); setResult(null);
    const { data, error: err } = editing
      ? await api.updatePost(post.id, { title, body, userId: 1 })
      : await api.createPost({ title, body, userId: 1 });
    setLoading(false);
    if (err) { setError(err); return; }
    setResult(data);
    onSuccess?.(data);
  }

  return (
    <div className="bg-[#FAFAF9] border border-ink-600/10 p-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h3 className="font-display font-500 text-lg mb-10 text-ink-950 uppercase tracking-widest">
        {editing ? "Edit Entry" : "Create New"}
      </h3>

      {result && (
        <div className="mb-10 p-6 bg-ink-950 text-emerald-neon font-mono text-[10px] uppercase tracking-widest">
          {editing ? "Entry Updated" : "Entry Created"} · ID: {result.id}
        </div>
      )}

      {error && <div className="mb-8"><ErrorState error={error} onRetry={() => setError(null)} /></div>}

      <form onSubmit={submit} className="flex flex-col gap-8">
        <div className="group">
          <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-700 mb-2">Title</label>
          <input
            value={title} onChange={e => setTitle(e.target.value)}
            className="w-full bg-transparent border-b border-ink-600/30 py-3 text-sm text-ink-950 placeholder-ink-600/50 focus:outline-none focus:border-volt transition-all"
            placeholder="Name your post..."
          />
        </div>
        <div className="group">
          <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-700 mb-2">Content</label>
          <textarea
            value={body} onChange={e => setBody(e.target.value)}
            rows={4} 
            className="w-full bg-transparent border-b border-ink-600/30 py-3 text-sm text-ink-950 placeholder-ink-600/50 focus:outline-none focus:border-volt transition-all resize-none"
            placeholder="Write your story..."
          />
        </div>
        
        <div className="flex items-center gap-8 mt-4">
          <button
            type="submit" disabled={loading}
            className="text-[10px] uppercase tracking-widest text-ink-950 hover:text-volt transition-all font-bold"
          >
            {loading ? "Processing..." : "Confirm & Save"}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel}
              className="text-[10px] uppercase tracking-widest text-ink-700 hover:text-ink-950 transition-all"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}