import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// The dev server proxies /api requests to the FastAPI backend on port 8000,
// so the frontend can call "/api/..." without worrying about CORS in dev.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
});
