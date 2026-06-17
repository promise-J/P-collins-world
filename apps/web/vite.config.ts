import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
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
  build: {
    // 1. Keeps the higher warning threshold
    chunkSizeWarningLimit: 1600, 
    
    // 2. Configure Next-Gen Rolldown Splitting Rules
    rolldownOptions: {
      output: {
        codeSplitting: {
          // Splitting criteria: breaks apart large vendor libraries automatically
          minSize: 20000, // 20KB base chunk minimum
          groups: [
            {
              name: 'vendor-firebase',
              test: /node_modules[\\/]github.*|node_modules[\\/]@firebase|node_modules[\\/]firebase/,
              priority: 20,
            },
            {
              name: 'vendor-framework',
              test: /node_modules[\\/](react|react-dom|react-router)/,
              priority: 15,
            },
            {
              name: 'vendor-libs',
              test: /node_modules/,
              priority: 10,
            },
          ],
        },
      },
    },
  },
});
