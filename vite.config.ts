
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "buffer": "buffer", // Ensure buffer is properly resolved
    },
  },
  // Define global values
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  // Optimize dependencies that might cause issues
  optimizeDeps: {
    include: ['buffer', 'exif-js', 'heic-convert'],
    esbuildOptions: {
      // Define global values during the build
      define: {
        global: 'globalThis',
      },
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      // Make sure these packages are properly externalized
      output: {
        manualChunks: {
          'heic-convert': ['heic-convert'],
        }
      }
    }
  },
}));
