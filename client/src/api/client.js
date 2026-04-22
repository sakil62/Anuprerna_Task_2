import axios from "axios";
import { useChaosStore } from "../store/chaosStore";

const BASE_URL = "http://localhost:4000/api";
const TIMEOUT_MS = 5000;

function getChaosParams() {
  const { forceTimeout, force404, force500, badUrl } = useChaosStore.getState();
  const p = {};
  if (forceTimeout) p.forceTimeout = "1";
  if (force404) p.force404 = "1";
  if (force500) p.force500 = "1";
  if (badUrl) p.badUrl = "1";
  return p;
}

async function request(method, path, { params = {}, data } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await axios({
      method,
      url: `${BASE_URL}${path}`,
      params: { ...getChaosParams(), ...params },
      data,
      signal: controller.signal,
    });
    return { data: response.data, error: null };
  } catch (err) {
    if (err.code === "ERR_CANCELED" || err.name === "CanceledError") {
      return { data: null, error: { type: "timeout", message: "Request timed out after 5 seconds." } };
    }
    // Network failure (server unreachable)
    if (!err.response) {
      return { data: null, error: { type: "network", message: "Cannot reach server. Check your connection or start the backend." } };
    }
    const body = err.response.data;
    if (body?.errorType) {
      return { data: null, error: { type: body.errorType, message: body.message, status: body.status } };
    }
    return { data: null, error: { type: "http", message: `HTTP ${err.response.status}`, status: err.response.status } };
  } finally {
    clearTimeout(timer);
  }
}

export const api = {
  getPosts: (params) => request("get", "/posts", { params }),
  getPost: (id) => request("get", `/posts/${id}`),
  createPost: (data) => request("post", "/posts", { data }),
  updatePost: (id, data) => request("put", `/posts/${id}`, { data }),
  patchPost: (id, data) => request("patch", `/posts/${id}`, { data }),
  deletePost: (id) => request("delete", `/posts/${id}`),
};