import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';

function stripFirebasePlugin() {
  return {
    name: 'strip-firebase',
    enforce: 'pre' as const,
    resolveId(source: string) {
      if (
        source.startsWith('firebase') ||
        source.endsWith('/firebase') ||
        source.endsWith('/firebase.ts') ||
        source.endsWith('services/firestoreStorage') ||
        source.endsWith('services/firestoreStorage.ts')
      ) {
        return path.resolve(__dirname, 'src/components/canvas-stub.tsx');
      }
      return null;
    },
  };
}

export default defineConfig({
  plugins: [
    stripFirebasePlugin(),
    react(),
    tailwindcss(),
    viteSingleFile({
      useRecommendedBuildConfig: true,
      removeViteModuleLoader: true,
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  define: {
    'import.meta.env.VITE_GEMINI_API_KEY': JSON.stringify(''),
    'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(''),
    'import.meta.env.VITE_FIREBASE_AUTH_DOMAIN': JSON.stringify(''),
    'import.meta.env.VITE_FIREBASE_PROJECT_ID': JSON.stringify(''),
  },
  build: {
    outDir: 'dist-canvas',
    emptyOutDir: true,
    target: 'esnext',
    assetsInlineLimit: 100000000,
    chunkSizeWarningLimit: 100000,
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
