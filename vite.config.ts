
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import nodePolyfills from 'rollup-plugin-polyfill-node';

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
    nodePolyfills(), // Add Node.js polyfills
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "buffer": "buffer", // Ensure buffer is properly resolved
      "util": "util", // Add util polyfill
      "stream": "stream-browserify", // Add stream polyfill
    },
  },
  // Define global values
  define: {
    global: 'globalThis',
    'process.env': {},
  },
  // Optimize dependencies that might cause issues
  optimizeDeps: {
    include: [
      'buffer', 
      'exif-js', 
      'heic-convert', 
      'util', 
      'process', 
      'stream-browserify'
    ],
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
      plugins: [
        nodePolyfills()
      ],
      output: {
        manualChunks: {
          'heic-convert': ['heic-convert'],
        }
      }
    }
  },
}));
