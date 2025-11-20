import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Determine base path for GitHub Pages
  // For user.github.io repos, use '/', otherwise use '/repo-name/'
  const base = process.env.GITHUB_PAGES_BASE || '/';
  
  // Ensure base path ends with / if not root
  const normalizedBase = base === '/' ? '/' : base.endsWith('/') ? base : `${base}/`;
  
  return {
    base: normalizedBase,
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
