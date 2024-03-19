import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import svgr from '@svgr/rollup';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
      babel: {
        plugins: ['babel-plugin-styled-components'],
      },
    }),
    svgr(),
  ],
  build: {
    outDir: 'build',
  },
  server: {
    port: 3010,
  },
  publicDir: 'public',
});
