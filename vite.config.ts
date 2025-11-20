import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // GitHub Pages user/org site is always served from the root domain,
  // so keep the base path fixed to '/' to avoid duplicated paths.
  const base = "/";

  return {
    base: base,
    server: {
      host: "::",
      port: 8080,
      strictPort: false,
      // Ensure proper MIME types
      fs: {
        strict: false,
      },
    },
    plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // Ensure proper module resolution and chunking
      rollupOptions: {
        output: {
          // Use consistent chunk naming
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
    },
    // Ensure proper handling of module scripts
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom'],
    },
  };
});
