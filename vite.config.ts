import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  // Where the real backend lives. Overridable via VITE_API_PROXY_TARGET.
  const proxyTarget =
    env.VITE_API_PROXY_TARGET || "https://una-ai-tools-apis.una-oic.org";

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
      // The backend is mounted under /site-analysis (both /api/v1 and /media).
      // Proxying it keeps browser requests same-origin, so there is no CORS —
      // the remote host does not send access-control-allow-origin.
      proxy: {
        "/site-analysis": {
          target: proxyTarget,
          changeOrigin: true,
          secure: true,
        },
      },
    },
  };
});
