import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../api/client";
import { useChaosStore } from "../store/chaosStore";

export function usePosts({ page, limit, search }) {
  const [posts, setPosts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const chaos = useChaosStore();
  const abortRef = useRef(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    const { data, error: err } = await api.getPosts({ _page: page, _limit: limit, q: search });
    setLoading(false);
    if (err) { setError(err); return; }
    if (!data || typeof data !== "object" || !Array.isArray(data.posts)) {
      setError({ type: "malformed", message: "Received unexpected data shape from server." });
      return;
    }
    setPosts(data.posts);
    setTotal(data.total);
  }, [page, limit, search, chaos.forceTimeout, chaos.force404, chaos.force500, chaos.badUrl]);

  useEffect(() => { fetch(); }, [fetch]);

  return { posts, total, loading, error, retry: fetch };
}