import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    })
  ],
  
  // Build optimizations
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate sourcemaps for production debugging
    sourcemap: process.env.NODE_ENV === 'development',
    
    // Minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
      },
    },
    
    // Chunk splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'bootstrap-vendor': ['bootstrap', '@popperjs/core'],
        },
        // Asset naming for cache busting
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: 'entry/[name]-[hash].js',
      },
    },
    
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    
    // Asset inline limit (base64)
    assetsInlineLimit: 4096,
    
    // CSS code splitting
    cssCodeSplit: true,
    
    // Report compressed size
    reportCompressedSize: true,
  },
  
  // Server configuration
  server: {
    port: 5173,
    strictPort: false,
    host: true,
    open: false,
    cors: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
  // Preview configuration (production preview)
  preview: {
    port: 4173,
    strictPort: false,
    host: true,
    open: false,
  },
  
  // Dependency optimization
  optimizeDeps: {
    include: ['react', 'react-dom', 'bootstrap'],
    exclude: [],
  },
  
  // Environment variables prefix
  envPrefix: 'VITE_',
})
