export default {
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
    cssCodeSplit: false,
    rollupOptions: {
      input: './index.html'
    }
  }
};
