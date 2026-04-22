const express = require("express");
const cors = require("cors");
const postsRouter = require("./routes/posts");

const app = express();
const PORT = 4000;

app.use(cors({
  origin: ['https://anuprerna-task-2.vercel.app', 'http://localhost:5173']
}));
app.use(express.json());

app.use("/api/posts", postsRouter);

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));