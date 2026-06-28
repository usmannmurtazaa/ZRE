import { defineConfig, loadEnv, type PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const isProduction = mode === 'production';
  const isStaging = mode === 'staging';

  const envDefine = {
    'import.meta.env.VITE_APP_VERSION': JSON.stringify(
      process.env.npm_package_version || '1.0.0'
    ),
  };

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

  // Keep the chunk splitting simpler – only separate heavy libraries
  function manualChunks(id: string) {
    if (id.includes('node_modules')) {
      // Firebase
      if (id.includes('/firebase/')) {
        return 'firebase';
      }
      // Radix UI primitives
      if (id.includes('/@radix-ui/')) {
        return 'radix-ui';
      }
      // Icons
      if (id.includes('/lucide-react/')) {
        return 'icons';
      }
      // Animation
      if (id.includes('/framer-motion/')) {
        return 'animations';
      }
      // State management
      if (
        id.includes('/@reduxjs/') ||
        id.includes('/react-redux/') ||
        id.includes('/@tanstack/')
      ) {
        return 'state';
      }
      // Forms & validation
      if (
        id.includes('/react-hook-form/') ||
        id.includes('/zod/') ||
        id.includes('/@hookform/')
      ) {
        return 'form';
      }
      // Utility / styling
      if (
        id.includes('/clsx/') ||
        id.includes('/class-variance-authority/') ||
        id.includes('/tailwind-merge/')
      ) {
        return 'utils';
      }
    }
    // Everything else (including React & React DOM) stays together
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