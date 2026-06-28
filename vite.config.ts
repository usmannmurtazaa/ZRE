import { defineConfig, loadEnv, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  const isStaging = mode === 'staging';

  // Environment variables exposed via import.meta.env (only VITE_ prefixed)
  const envDefine = {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(
      process.env.npm_package_version || '1.0.0'
    ),
  };

  // Conditionally add bundle visualizer for analysis
  const plugins: PluginOption[] = [react()];
  if (isProduction && process.env.ANALYZE === 'true') {
    plugins.push(
      visualizer({
        filename: 'dist/stats.html',
        gzipSize: true,
        brotliSize: true,
        open: true,
      })
    );
  }

  // Advanced manual chunks for optimal code splitting
  function manualChunks(id: string) {
    if (id.includes('node_modules')) {
      if (
        id.includes('/react/') ||
        id.includes('/react-dom/') ||
        id.includes('/react-router-dom/')
      ) {
        return 'react-core';
      }
      if (id.includes('/firebase/')) {
        return 'firebase';
      }
      if (id.includes('/@radix-ui/')) {
        return 'radix-ui';
      }
      if (id.includes('/lucide-react/')) {
        return 'icons';
      }
      if (id.includes('/framer-motion/')) {
        return 'animations';
      }
      if (
        id.includes('/@reduxjs/') ||
        id.includes('/react-redux/') ||
        id.includes('/@tanstack/')
      ) {
        return 'state';
      }
      if (
        id.includes('/react-hook-form/') ||
        id.includes('/zod/') ||
        id.includes('/@hookform/')
      ) {
        return 'form';
      }
      if (
        id.includes('/clsx/') ||
        id.includes('/class-variance-authority/') ||
        id.includes('/tailwind-merge/')
      ) {
        return 'utils';
      }
      return 'vendor';
    }
  }

  return {
    plugins,
    define: {
      ...envDefine,
      __APP_ENV__: JSON.stringify(mode),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      target: 'es2020',
      sourcemap: isProduction ? false : true,
      minify: isProduction ? 'esbuild' : false,
      cssMinify: isProduction,
      reportCompressedSize: false,
      rollupOptions: {
        output: {
          manualChunks,
          chunkFileNames: 'assets/js/[name]-[hash].js',
          entryFileNames: 'assets/js/[name]-[hash].js',
          assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        },
      },
      chunkSizeWarningLimit: 300,
      assetsInlineLimit: 4096,
    },
    server: {
      port: 3000,
      open: true,
      cors: true,
      headers: {
        // Allow cross-origin popups for Firebase Auth (Google Sign-In)
        'Cross-Origin-Opener-Policy': 'unsafe-none',
      },
    },
    preview: {
      port: 4173,
      open: true,
      headers: {
        'Cross-Origin-Opener-Policy': 'unsafe-none',
      },
    },
    envPrefix: 'VITE_',
  };
});