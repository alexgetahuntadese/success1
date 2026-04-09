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
      // Parse SDK uses Node's `events` EventEmitter; Vite externalizes it with a broken stub,
      // which causes "Emitter is not a constructor" in LiveQuery. Use the real polyfill.
      events: path.resolve(__dirname, "node_modules/events/events.js"),
      // fast-equals@5.4.0 ships without the expected ESM entry in this install,
      // so we pin Vite to the working CJS build.
      "fast-equals": path.resolve(
        __dirname,
        "./node_modules/react-smooth/node_modules/fast-equals/dist/cjs/index.cjs",
      ),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-select', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          charts: ['recharts', 'framer-motion'],
          supabase: ['@supabase/supabase-js', '@supabase/ssr'],
          utils: ['date-fns', 'zod', 'cmdk'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    sourcemap: mode === 'development',
  },
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@tanstack/react-query",
      "events",
      "parse",
    ],
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(mode),
  },
}));
