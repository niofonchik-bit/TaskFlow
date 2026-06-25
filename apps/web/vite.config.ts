import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

/** настраивает React и проксирование API-запроса */
export default defineConfig({
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    proxy: {
      "/JS": {
        target: "http://127.0.0.1:3001",
        changeOrigin: true,
      },
    },
  },
  preview: {
    host: "127.0.0.1",
  },
});
