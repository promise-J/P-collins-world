import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite"; // 🟢 Added Tailwind v4 plugin
import path from "node:path";
import { fileURLToPath } from "node:url";   // 🟢 Added to fix modern ES modules

// 🟢 FIX: Create __dirname manually for ESM ("type": "module") environments
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 🟢 Added Tailwind plugin to processing pipeline
  ],
  server: {
    port: 5173, 
    host: true, 
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
