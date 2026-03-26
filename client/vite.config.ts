import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        '.js': 'jsx',
      },
    },
  },
  esbuild: {
    loader: 'jsx',
    // Only apply JSX parsing to plain `.js` files (not `.jsx` and not `.tsx`).
    include: /src[\\\/].*\.js$/,
    exclude: [],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@types': path.resolve(__dirname, './src/types'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@context': path.resolve(__dirname, './src/context'),
    }
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild'
  }
})
