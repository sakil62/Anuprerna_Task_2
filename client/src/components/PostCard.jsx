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
    toast.success(`Update confirmed`);
  }

  return (
    <div
      onClick={() => onView(post.id)}
      className="group flex flex-col justify-between bg-white border border-ink-600/10 p-10 cursor-pointer transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:border-ink-600/30"
    >
      <div>
        <div className="font-mono text-[11px] tracking-[0.2em] text-ink-700 mb-6 uppercase">Entry • {post.id}</div>
        {/* Increased to text-xl for authoritative reading */}
        <h3 className="font-display font-500 text-xl leading-tight text-ink-950 mb-5 group-hover:text-volt transition-colors duration-300">
          {post.title}
        </h3>
        {/* Increased to text-[15px] for premium legibility */}
        <p className="text-[15px] text-ink-700 leading-relaxed line-clamp-3 font-light">
          {post.body}
        </p>
      </div>

      <div className="flex gap-8 mt-12 pt-8 border-t border-ink-600/5" onClick={e => e.stopPropagation()}>
        <button onClick={() => onView(post.id)} className="text-[10px] uppercase tracking-widest text-ink-950 hover:text-volt transition-all font-semibold hover:border-b hover:border-volt">View</button>
        <button onClick={handlePatch} disabled={patching} className="text-[10px] uppercase tracking-widest text-ink-700 hover:text-cyan-neon transition-all font-semibold hover:border-b hover:border-cyan-neon">
          {patching ? "Updating..." : "Patch"}
        </button>
        <button onClick={handleDelete} disabled={deleting} className="text-[10px] uppercase tracking-widest text-ink-700 hover:text-rose-neon transition-all font-semibold hover:border-b hover:border-rose-neon">
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </div>
  );
}