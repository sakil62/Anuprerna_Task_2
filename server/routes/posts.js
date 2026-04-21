const express = require("express");
const axios = require("axios");
const router = express.Router();

const BASE = "https://jsonplaceholder.typicode.com";
const TIMEOUT = 8000;

function apiError(res, err) {
  if (err.response) {
    return res.status(err.response.status).json({
      errorType: "http",
      status: err.response.status,
      message: `Upstream returned ${err.response.status}: ${err.response.statusText}`,
    });
  }
  if (err.code === "ECONNABORTED" || err.message?.includes("timeout")) {
    return res.status(504).json({ errorType: "timeout", message: "Request timed out." });
  }
  return res.status(502).json({ errorType: "network", message: err.message || "Network error" });
}

router.get("/", async (req, res) => {
  const { _page = 1, _limit = 12, q = "" } = req.query;

  const { forceTimeout, force404, force500, badUrl } = req.query;

  if (badUrl === "1") {
    return res.status(502).json({ errorType: "network", message: "Could not reach upstream (bad URL simulated)." });
  }
  if (force404 === "1") {
    return res.status(404).json({ errorType: "http", status: 404, message: "Resource not found (404 forced)." });
  }
  if (force500 === "1") {
    return res.status(500).json({ errorType: "http", status: 500, message: "Internal server error (500 forced)." });
  }
  if (forceTimeout === "1") {
    return; 
  }

  try {
    const { data, headers } = await axios.get(`${BASE}/posts`, {
      timeout: TIMEOUT,
      params: { _page, _limit },
    });

    let posts = Array.isArray(data) ? data : [];

    if (q) {
      const lower = q.toLowerCase();
      posts = posts.filter((p) => p.title?.toLowerCase().includes(lower));
    }

    const total = parseInt(headers["x-total-count"] || "100", 10);
    res.json({ posts, total, page: Number(_page), limit: Number(_limit) });
  } catch (err) {
    apiError(res, err);
  }
});

router.get("/:id", async (req, res) => {
  const { force404, forceTimeout, force500 } = req.query;
  if (force404 === "1") return res.status(404).json({ errorType: "http", status: 404, message: "Post not found (404 forced)." });
  if (force500 === "1") return res.status(500).json({ errorType: "http", status: 500, message: "Server error (500 forced)." });
  if (forceTimeout === "1") return; // hang

  try {
    const { data } = await axios.get(`${BASE}/posts/${req.params.id}`, { timeout: TIMEOUT });
    if (!data || typeof data !== "object") return res.status(502).json({ errorType: "malformed", message: "Malformed response from upstream." });
    res.json(data);
  } catch (err) {
    apiError(res, err);
  }
});

router.post("/", async (req, res) => {
  const { title, body, userId } = req.body;
  if (!title || !body) {
    return res.status(400).json({ errorType: "validation", message: "title and body are required." });
  }
  const { forceTimeout, force500 } = req.query;
  if (force500 === "1") return res.status(500).json({ errorType: "http", status: 500, message: "Server error (500 forced)." });
  if (forceTimeout === "1") return;

  try {
    const { data } = await axios.post(`${BASE}/posts`, { title, body, userId: userId || 1 }, { timeout: TIMEOUT });
    res.status(201).json(data);
  } catch (err) {
    apiError(res, err);
  }
});

router.put("/:id", async (req, res) => {
  const { title, body, userId } = req.body;
  if (!title || !body) return res.status(400).json({ errorType: "validation", message: "title and body are required." });
  const { forceTimeout, force500 } = req.query;
  if (force500 === "1") return res.status(500).json({ errorType: "http", status: 500, message: "Server error (500 forced)." });
  if (forceTimeout === "1") return;

  try {
    const { data } = await axios.put(`${BASE}/posts/${req.params.id}`, { title, body, userId: userId || 1 }, { timeout: TIMEOUT });
    res.json(data);
  } catch (err) {
    apiError(res, err);
  }
});

router.patch("/:id", async (req, res) => {
  const { forceTimeout, force500 } = req.query;
  if (force500 === "1") return res.status(500).json({ errorType: "http", status: 500, message: "Server error (500 forced)." });
  if (forceTimeout === "1") return;

  try {
    const { data } = await axios.patch(`${BASE}/posts/${req.params.id}`, req.body, { timeout: TIMEOUT });
    res.json(data);
  } catch (err) {
    apiError(res, err);
  }
});

router.delete("/:id", async (req, res) => {
  const { forceTimeout, force500 } = req.query;
  if (force500 === "1") return res.status(500).json({ errorType: "http", status: 500, message: "Server error (500 forced)." });
  if (forceTimeout === "1") return;

  try {
    await axios.delete(`${BASE}/posts/${req.params.id}`, { timeout: TIMEOUT });
    res.json({ success: true, id: Number(req.params.id) });
  } catch (err) {
    apiError(res, err);
  }
});

module.exports = router;