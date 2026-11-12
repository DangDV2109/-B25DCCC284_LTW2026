import react from '@vitejs/plugin-react';
import { defineConfig, transformWithOxc } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      name: 'treat-js-files-as-jsx',
      enforce: 'pre',
      async transform(code, id) {
        if (/\/src\/.*\.js$/.test(id.replace(/\\/g, '/'))) {
          return transformWithOxc(code, id, {
            lang: 'jsx',
            jsx: {
              runtime: 'automatic',
            },
          });
        }
        return null;
      },
    },
    react(),
  ],
});
