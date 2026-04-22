import { useState } from "react";
import { usePosts } from "../hooks/usePosts";
import PostCard from "./PostCard";
import PostDetail from "./PostDetail";
import PostForm from "./PostForm";
import Pagination from "./Pagination";
import SkeletonGrid from "./SkeletonGrid";
import ErrorState from "./ErrorState";

const LIMIT = 12;

export default function PostsPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [viewId, setViewId] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [localDeleted, setLocalDeleted] = useState(new Set());

  const { posts, total, loading, error, retry } = usePosts({ page, limit: LIMIT, search });

  function handleSearch(e) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  const visiblePosts = posts.filter(p => !localDeleted.has(p.id));

  return (
    <div className="animate-in fade-in duration-700">
      {/* Editorial Header */}
      <div className="mb-20">
        <h1 className="font-display font-800 text-5xl tracking-tighter text-[#8B6A3D]">
          Anuprerna
        </h1>
        <div className="flex items-center gap-4 mt-6">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#8B6A3D]">
            Collection
          </span>
          <div className="h-px w-8 bg-[#8B6A3D]/40" />
          <span className="font-mono text-[10px] text-[#8B6A3D] uppercase tracking-[0.2em]">
            {total} active records
          </span>
        </div>
      </div>

      {/* Luxury Toolbar */}
      <div className="flex items-center gap-10 mb-16">
        <form onSubmit={handleSearch} className="flex-1 group relative">
          <input
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
            placeholder="Search entries..."
            className="w-full bg-transparent border-b border-[#8B6A3D]/40 py-3 text-sm text-ink-950 placeholder-ink-600/60 focus:outline-none focus:border-[#8B6A3D] transition-all"
          />
          <button
            type="submit"
            className="absolute right-0 top-3 text-[10px] uppercase tracking-widest text-[#8B6A3D] hover:text-[#6f532f] font-bold transition-colors"
          >
            Search
          </button>
        </form>
        
        <button
          onClick={() => setShowCreate(true)}
          className="text-[10px] uppercase tracking-widest text-[#8B6A3D] font-bold hover:text-[#6f532f] transition-all whitespace-nowrap border-b border-transparent hover:border-[#8B6A3D] pb-1"
        >
          + Add New
        </button>
      </div>

      {/* FLOATING MODAL FORM */}
      {showCreate && (
        <div
          className="fixed inset-0 bg-ink-950/20 backdrop-blur-sm flex items-center justify-center z-50 p-6"
          onClick={() => setShowCreate(false)}
        >
          <div 
            className="bg-[#FAFAF9] border border-[#8B6A3D]/20 shadow-[0_30px_60px_rgba(0,0,0,0.15)] w-full max-w-2xl p-12 relative animate-in zoom-in-95 duration-300"
            onClick={e => e.stopPropagation()}
          >
            <button
              onClick={() => setShowCreate(false)}
              className="absolute top-8 right-8 text-[#8B6A3D] hover:text-[#6f532f] transition-colors uppercase text-[10px] tracking-widest"
            >
              Close ✕
            </button>

            <PostForm
              onSuccess={() => { setShowCreate(false); retry(); }}
              onCancel={() => setShowCreate(false)}
            />
          </div>
        </div>
      )}

      {/* Content Grid */}
      {loading ? (
        <SkeletonGrid count={LIMIT} />
      ) : error ? (
        <ErrorState error={error} onRetry={retry} />
      ) : (
        <>
          {visiblePosts.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-lg text-[#8B6A3D] uppercase tracking-widest">
                No entries found.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
              {visiblePosts.map(post => (
                <PostCard
                  key={post.id}
                  post={post}
                  onView={setViewId}
                  onDeleted={id => setLocalDeleted(s => new Set([...s, id]))}
                />
              ))}
            </div>
          )}
          <div className="mt-20">
            <Pagination page={page} total={total} limit={LIMIT} onChange={setPage} />
          </div>
        </>
      )}

      {viewId && <PostDetail id={viewId} onClose={() => setViewId(null)} />}
    </div>
  );
}