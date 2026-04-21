import { Toaster } from "react-hot-toast";
import Layout from "./components/Layout";
import PostsPage from "./components/PostsPage";

export default function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: { background: "#16161f", border: "1px solid #2a2a3a", color: "#e8e8f0", fontFamily: "'DM Mono', monospace", fontSize: "12px" },
          success: { iconTheme: { primary: "#47ff8e", secondary: "#07070d" } },
          error: { iconTheme: { primary: "#ff4778", secondary: "#07070d" } },
        }}
      />
      <Layout>
        <PostsPage />
      </Layout>
    </>
  );
}