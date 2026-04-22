# Task 2

> A full-stack REST API explorer built with **Express** (backend) and **React + Tailwind CSS** (frontend), powered by [JSONPlaceholder](https://jsonplaceholder.typicode.com). Supports full CRUD operations, pagination, search, comprehensive error handling, and a **Chaos Mode** panel for forcing failure states.

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Features](#features)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Chaos Mode](#chaos-mode)
- [Environment Variables](#environment-variables)

---

## Overview

PostVault proxies requests to the public JSONPlaceholder API through an Express server and exposes a polished React frontend. Every HTTP method is covered — `GET`, `POST`, `PUT`, `PATCH`, and `DELETE` — with every failure mode handled visually.

---

## Tech Stack

| Layer    | Technology                         |
|----------|------------------------------------|
| Backend  | Node.js, Express, Axios            |
| Frontend | React 18, Vite, Tailwind CSS v3    |
| State    | Zustand                            |
| Toasts   | react-hot-toast                    |
| Icons    | lucide-react                       |
| Fonts    | Syne (display), DM Mono (code)     |

---

## Project Structure

```
Anuprerna/
├── server/
│   ├── package.json
│   ├── index.js               # Express entry point (port 4000)
│   └── routes/
│       └── posts.js           # All /api/posts routes + chaos logic
└── client/
    ├── package.json
    ├── tailwind.config.js
    ├── postcss.config.js
    ├── index.html
    └── src/
        ├── main.jsx
        ├── index.css
        ├── App.jsx
        ├── api/
        │   └── client.js      # Axios wrapper with AbortController + error normalisation
        ├── hooks/
        │   └── usePosts.js    # Data-fetching hook with loading/error state
        ├── store/
        │   └── chaosStore.js  # Zustand store for chaos mode toggles
        └── components/
            ├── Layout.jsx
            ├── PostsPage.jsx  # Main list page
            ├── PostCard.jsx   # Individual post card (Patch / Delete inline)
            ├── PostDetail.jsx # Modal: GET by id, PUT, DELETE
            ├── PostForm.jsx   # Create (POST) / Edit (PUT) form
            ├── ChaosPanel.jsx # Sidebar failure-mode controls
            ├── Pagination.jsx
            ├── SkeletonGrid.jsx
            └── ErrorState.jsx
```

---

## Prerequisites

Make sure the following are installed on your machine before continuing.

| Tool | Minimum Version | Check |
|------|----------------|-------|
| Node.js | 18.x | `node -v` |
| npm | 9.x | `npm -v` |

---

## Installation

### 1. Clone or create the project folder

```bash
git clone https://github.com/sakil62/Anuprerna_Task_2.git
```

### 2. Install server dependencies

```bash
mkdir server && cd server
npm install
```

### 3. Running the server

```bash
npm start
```

### 4. Running the frontend

```bash
cd client
npm install
npm run dev
```

---

Expected output:
```
  VITE v5.x.x  ready in XXX ms
  ➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser.

---

## Features

| Feature | Description |
|---------|-------------|
| **List posts** | Paginated grid of all posts fetched from `GET /posts` |
| **Search** | Title search via toolbar — filters server-side |
| **Pagination** | Page controls with ellipsis for large page ranges |
| **View post** | Click any card to open a detail modal (`GET /posts/:id`) |
| **Create post** | "New Post" button opens an inline `POST /posts` form |
| **Edit post** | "Edit" inside the modal replaces the post via `PUT /posts/:id` |
| **Patch post** | "Patch" button on each card sends `PATCH /posts/:id` |
| **Delete post** | "Delete" on card or inside modal sends `DELETE /posts/:id` |
| **Optimistic removal** | Deleted cards vanish immediately from the local list |
| **Toast notifications** | Success and error feedback for all mutations |
| **Skeleton loading** | Shimmering placeholder cards while requests are in-flight |
| **Error states** | Typed error views (network / HTTP / timeout / malformed / empty) |
| **Retry** | One-click retry button on every error state |
| **Chaos Mode** | Sidebar panel to force any failure mode on demand |

---

## API Reference

All routes are prefixed with `/api`. The server proxies to `https://jsonplaceholder.typicode.com`.

### Posts

| Method | Endpoint | Description | Query params |
|--------|----------|-------------|--------------|
| `GET` | `/api/posts` | List posts (paginated + searchable) | `_page`, `_limit`, `q` |
| `GET` | `/api/posts/:id` | Get a single post by ID | — |
| `POST` | `/api/posts` | Create a new post | — |
| `PUT` | `/api/posts/:id` | Replace a post (full update) | — |
| `PATCH` | `/api/posts/:id` | Partial update | — |
| `DELETE` | `/api/posts/:id` | Delete a post | — |
| `GET` | `/api/health` | Server health check | — |

**POST / PUT request body:**
```json
{
  "title": "Post title",
  "body": "Post body content",
  "userId": 1
}
```

**Chaos query params** (appended automatically by the client when a mode is active):

| Param | Value | Effect |
|-------|-------|--------|
| `badUrl` | `1` | Returns 502 network error |
| `force404` | `1` | Returns 404 HTTP error |
| `force500` | `1` | Returns 500 HTTP error |
| `forceTimeout` | `1` | Request hangs — client AbortController fires after 5 s |

---

## Error Handling

Every request goes through a normalised error pipeline. The table below maps failure type → what the user sees.

| Failure | Trigger | UI treatment |
|---------|---------|--------------|
| **Loading** | Request in-flight | Skeleton grid of shimmering placeholder cards |
| **Network failure** | Server unreachable, DNS failure, CORS | `📡 Network Error` card with amber border + Retry button |
| **HTTP 4xx / 5xx** | Non-2xx response from upstream | `🔥 HTTP Error` card showing status code + message |
| **Timeout** | No response within 5 seconds (AbortController) | `⏱ Timeout` card with cyan border + Retry button |
| **Malformed payload** | Missing `id`, wrong shape, non-array posts | `💀 Bad Payload` card with violet border |
| **Validation** | Empty title or body on form submit | Inline validation message above form fields |
| **Empty results** | Search returns zero matches | `📭 No posts found` empty state view |

The client (`src/api/client.js`) normalises all errors into a consistent shape:

```js
{
  type: "network" | "timeout" | "http" | "malformed" | "validation",
  message: "Human-readable description",
  status: 404   // only present for HTTP errors
}
```

The `ErrorState` component reads `error.type` and renders the appropriate icon, colour, label, and retry control automatically.
---

## Chaos Mode

The **Chaos Panel** lives in the left sidebar under the endpoint list. It lets you force any failure state without touching network settings or writing code.

| Button | What it forces |
|--------|---------------|
| **Bad URL** | Server returns `502` — simulates upstream unreachable |
| **Force 404** | Server returns `404` — simulates missing resource |
| **Force 500** | Server returns `500` — simulates internal server error |
| **Timeout** | Server never responds — client AbortController fires at 5 s |

Only **one mode** can be active at a time. A red **"Chaos Active"** pill appears in the header while any mode is on. Click **clear** or the active button again to return to normal.

When active, chaos params are appended to **every request** (list, detail, create, update, delete) so every code path can be tested in isolation.

---