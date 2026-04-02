import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      // fast-equals@5.4.0 ships without the expected ESM entry in this install,
      // so we pin Vite to the working CJS build.
      "fast-equals": path.resolve(
        __dirname,
        "./node_modules/react-smooth/node_modules/fast-equals/dist/cjs/index.cjs",
      ),
    },
  },
}));
