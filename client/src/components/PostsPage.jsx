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
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="font-display font-800 text-3xl tracking-tight">
          Anuprerna
        </h1>
        <p className="font-mono text-xs text-slate-500 mt-1">GET /posts · {total} records</p>
      </div>

      {/* Toolbar */}
      <div className="flex flex-wrap gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex flex-1 min-w-[200px] gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-xs">⌕</span>
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search posts…"
              className="w-full bg-ink-800 border border-ink-600 rounded-lg pl-8 pr-4 py-2.5 text-sm font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-volt transition-colors"
            />
          </div>
          <button type="submit" className="px-4 py-2.5 bg-volt text-ink-950 rounded-lg text-sm font-bold hover:bg-volt-dark transition-colors">Search</button>
          {search && (
            <button type="button" onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
              className="px-3 py-2.5 border border-ink-600 rounded-lg text-slate-400 text-xs hover:border-slate-400 transition-colors"
            >✕</button>
          )}
        </form>
        <button
          onClick={() => setShowCreate(v => !v)}
          className="px-5 py-2.5 bg-volt text-ink-950 rounded-lg text-sm font-display font-700 hover:bg-volt-dark transition-colors"
        >
          {showCreate ? "Cancel" : "+ New Post"}
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="mb-6">
          <PostForm onSuccess={() => { setShowCreate(false); retry(); }} onCancel={() => setShowCreate(false)} />
        </div>
      )}

      {/* States */}
      {loading && <SkeletonGrid count={LIMIT} />}

      {!loading && error && <ErrorState error={error} onRetry={retry} />}

      {!loading && !error && visiblePosts.length === 0 && (
        <div className="bg-ink-800 border border-ink-600 rounded-xl p-16 text-center animate-fadeUp">
          <div className="text-5xl mb-3">📭</div>
          <p className="font-display font-600 text-lg text-slate-400">No posts found</p>
          <p className="font-mono text-xs text-slate-600 mt-1">{search ? `No results for "${search}"` : "Nothing here yet."}</p>
        </div>
      )}

      {!loading && !error && visiblePosts.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fadeUp">
            {visiblePosts.map(post => (
              <PostCard
                key={post.id}
                post={post}
                onView={setViewId}
                onDeleted={id => setLocalDeleted(s => new Set([...s, id]))}
              />
            ))}
          </div>
          <Pagination page={page} total={total} limit={LIMIT} onChange={setPage} />
        </>
      )}

      {/* Detail Modal */}
      {viewId && <PostDetail id={viewId} onClose={() => setViewId(null)} />}
    </div>
  );
}