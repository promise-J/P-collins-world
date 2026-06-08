import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Set a fixed port (e.g., 5173 for web, 5174 for admin)
    host: true, // Allows access inside local networks or Docker wrappers
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
