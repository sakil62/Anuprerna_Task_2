import { useState } from "react";
import { api } from "../api/client";
import toast from "react-hot-toast";

export default function PostCard({ post, onView, onDeleted }) {
  const [deleting, setDeleting] = useState(false);
  const [patching, setPatching] = useState(false);

  async function handleDelete(e) {
    e.stopPropagation();
    if (!confirm(`Delete post #${post.id}?`)) return;
    setDeleting(true);
    const { error } = await api.deletePost(post.id);
    setDeleting(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`Post #${post.id} deleted`);
    onDeleted?.(post.id);
  }

  async function handlePatch(e) {
    e.stopPropagation();
    setPatching(true);
    const { data, error } = await api.patchPost(post.id, { title: post.title + " [patched]" });
    setPatching(false);
    if (error) { toast.error(error.message); return; }
    toast.success(`PATCH OK — title updated on server (ID: ${data.id})`);
  }

  return (
    <div
      onClick={() => onView(post.id)}
      className="group bg-ink-800 border border-ink-600 rounded-xl p-5 cursor-pointer transition-all duration-200 hover:-translate-y-1 hover:border-volt/40 relative overflow-hidden"
    >
      {/* Top accent bar */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-volt to-cyan-neon scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

      <div className="font-mono text-xs text-volt mb-2">#{post.id}</div>
      <h3 className="font-display font-600 text-sm leading-snug mb-2 text-slate-200 line-clamp-2 capitalize">{post.title}</h3>
      <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">{post.body}</p>

      <div className="flex gap-2 mt-4" onClick={e => e.stopPropagation()}>
        <button onClick={() => onView(post.id)} className="flex-1 py-1.5 text-xs rounded-lg border border-ink-600 text-slate-400 hover:border-volt hover:text-volt transition-colors font-600">View</button>
        <button onClick={handlePatch} disabled={patching} className="flex-1 py-1.5 text-xs rounded-lg border border-ink-600 text-slate-400 hover:border-cyan-400 hover:text-cyan-400 disabled:opacity-40 transition-colors font-600">
          {patching ? "…" : "Patch"}
        </button>
        <button onClick={handleDelete} disabled={deleting} className="flex-1 py-1.5 text-xs rounded-lg border border-ink-600 text-slate-400 hover:border-rose-neon hover:text-rose-neon disabled:opacity-40 transition-colors font-600">
          {deleting ? "…" : "Delete"}
        </button>
      </div>
    </div>
  );
}