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
      setError({ type: "validation", message: "Title and body are required." });
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
    <div className="bg-ink-800 border border-ink-600 rounded-xl p-6 animate-fadeUp">
      <h3 className="font-display font-700 text-lg mb-5">
        {editing ? "✏️ Edit Post" : "✨ New Post"}
      </h3>

      {result && (
        <div className="mb-4 p-3 rounded-lg bg-emerald-neon/10 border border-emerald-neon/30 text-emerald-neon font-mono text-xs">
          ✓ {editing ? "Updated" : "Created"} — ID: {result.id}
          <pre className="mt-2 overflow-auto text-xs opacity-70">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      {error && <div className="mb-4"><ErrorState error={error} onRetry={() => setError(null)} /></div>}

      <form onSubmit={submit} className="flex flex-col gap-4">
        <div>
          <label className="block font-mono text-xs text-slate-400 mb-1.5">TITLE</label>
          <input
            value={title} onChange={e => setTitle(e.target.value)}
            placeholder="Post title…"
            className="w-full bg-ink-700 border border-ink-600 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-volt transition-colors"
          />
        </div>
        <div>
          <label className="block font-mono text-xs text-slate-400 mb-1.5">BODY</label>
          <textarea
            value={body} onChange={e => setBody(e.target.value)}
            rows={4} placeholder="Post body…"
            className="w-full bg-ink-700 border border-ink-600 rounded-lg px-4 py-2.5 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-volt transition-colors resize-none"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit" disabled={loading}
            className="flex-1 py-2.5 bg-volt text-ink-950 font-display font-700 text-sm rounded-lg hover:bg-volt-dark disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "⏳ Saving…" : editing ? "Save Changes" : "Create Post"}
          </button>
          {onCancel && (
            <button type="button" onClick={onCancel}
              className="px-4 py-2.5 border border-ink-600 rounded-lg text-slate-400 text-sm hover:border-slate-400 transition-colors"
            >Cancel</button>
          )}
        </div>
      </form>
    </div>
  );
}