import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    open: true,
  },
  root: 'src',
  envDir: '../',
  build: {
    outDir: 'dist',
  },
});
