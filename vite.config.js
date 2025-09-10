import { defineConfig } from 'vite';

export default defineConfig({
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    host: true,
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    
    // Code splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          vendor: ['bootstrap'],
          
          // Core game modules
          game: [
            'src/js/game.js',
            'src/js/state.js',
            'src/js/ui.js'
          ],
          
          // Utility modules
          utils: [
            'src/js/colorUtils.js',
            'src/js/constants.js'
          ],
          
          // Advanced features
          features: [
            'src/js/analytics.js',
            'src/js/storage.js',
            'src/js/i18n.js',
            'src/js/performance.js',
            'src/js/pwaManager.js',
            'src/js/errorHandler.js',
            'src/js/stateManager.js'
          ]
        }
      }
    },
    
    // Asset optimization
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    cssCodeSplit: true,
    sourcemap: true,
    
    // Minification settings
    minify: 'esbuild',
    target: 'esnext',
    
    // Bundle size warnings
    chunkSizeWarningLimit: 1000
  },
  
  // Asset handling
  assetsInclude: ['**/*.mp3', '**/*.wav', '**/*.ogg'],
  
  // Base path configuration
  base: './',
  
  // Plugins configuration
  plugins: [
    // PWA plugin would go here if we add vite-plugin-pwa
    // {
    //   plugin: 'vite-plugin-pwa',
    //   options: {
    //     registerType: 'autoUpdate',
    //     workbox: {
    //       globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff,woff2}']
    //     }
    //   }
    // }
  ],
  
  // Optimization settings
  optimizeDeps: {
    include: ['bootstrap'],
    exclude: []
  },
  
  // CSS configuration
  css: {
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        // SCSS options if needed
      }
    }
  },
  
  // Define environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '2.0.0'),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  },
  
  // Preview server configuration (for production preview)
  preview: {
    port: 4173,
    host: true,
    strictPort: true
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/assets',
      '@css': '/src/css',
      '@js': '/src/js'
    }
  }
});
