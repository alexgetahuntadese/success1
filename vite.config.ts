import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// Polyfill injection plugin
const cryptoPolyfillPlugin = () => ({
  name: 'crypto-polyfill',
  enforce: 'pre' as const,
  transformIndexHtml(html: string) {
    const polyfill = `<script>(function(){var r=function(){return'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,function(c){var r=Math.random()*16|0,v=c=='x'?r:(r&0x3|0x8);return v.toString(16);});};try{if(!globalThis.crypto)globalThis.crypto={};if(!globalThis.crypto.randomUUID)globalThis.crypto.randomUUID=r;}catch(e){}})();</script>`;
    return html.replace('<head>', `<head>${polyfill}`);
  },
});

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
    cryptoPolyfillPlugin(),
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
