import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Where the real backend lives. Overridable via VITE_API_PROXY_TARGET.
  const proxyTarget = env.VITE_API_PROXY_TARGET || "http://localhost:8000";

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      port: 5173,
      host: true,
      // Proxy API (and media) calls to the backend so the browser makes
      // same-origin requests — no CORS, works from localhost / 127.0.0.1 / LAN IP.
      proxy: {
        "/api": {
          target: proxyTarget,
          changeOrigin: true,
        },
        "/media": {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  };
});
