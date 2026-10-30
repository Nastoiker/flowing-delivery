import react from "@vitejs/plugin-react-swc";
import { resolve } from "path";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, "./src") }],
  },
  server: {
    host: true,
    port: 5173,
    proxy: {
      "/api": "http://127.0.0.1:3444",
      "/uploads": "http://127.0.0.1:3444",
      "/socket.io": { target: "http://127.0.0.1:3444", ws: true },
    },
    watch: {
      usePolling: true,
    },
  },
});
