
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
    nodePolyfills({
      include: [
        'node_modules/**/*.js',
        new RegExp('node_modules/.vite/.*js')
      ]
    }),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "buffer": "buffer",
      "util": "util",
      "stream": "stream-browserify",
      "process": "process/browser",
      "zlib": "browserify-zlib",
      "events": "events",
      "assert": "assert",
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
      'stream-browserify',
      'events',
      'assert',
      'browserify-zlib',
      'react',
      'react-dom',
      'react/jsx-runtime'
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
      plugins: [
        nodePolyfills()
      ],
      // Properly externalize packages that might cause issues
      output: {
        manualChunks: {
          'heic-convert': ['heic-convert'],
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime'],
        }
      }
    }
  },
}));
