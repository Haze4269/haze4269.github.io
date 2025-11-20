import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Determine base path for GitHub Pages
  // For user.github.io repos, use '/', otherwise use '/repo-name/'
  // Explicitly handle the base path to avoid double-pathing issues
  let base = process.env.GITHUB_PAGES_BASE || '/';
  
  // Remove any leading/trailing slashes and normalize
  base = base.trim();
  if (base && base !== '/') {
    // Ensure base starts with / and ends with /
    base = base.startsWith('/') ? base : `/${base}`;
    base = base.endsWith('/') ? base : `${base}/`;
  } else {
    base = '/';
  }
  
  // Log the base path for debugging (only in build mode to avoid cluttering dev console)
  if (mode === 'production') {
    console.log('Vite base path configured as:', JSON.stringify(base));
  }
  
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
