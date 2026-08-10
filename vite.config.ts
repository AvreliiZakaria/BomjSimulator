import { defineConfig } from 'vite';

/**
 * Конфигурация сборки.
 *
 * Важно: у ESM-сборки Phaser 4 нет default-экспорта, поэтому `import Phaser from 'phaser'`
 * ломает production build. Алиас переводит импорты на UMD-бандл, который корректно
 * интеропится и с Vite dev-сервером, и с Rollup.
 */
export default defineConfig({
  base: './',
  resolve: {
    alias: {
      phaser: 'phaser/dist/phaser.js',
    },
  },
  server: {
    host: true,
    port: 5173,
  },
  preview: {
    host: true,
    port: 4173,
  },
  build: {
    target: 'es2020',
    sourcemap: false,
    chunkSizeWarningLimit: 1600,
  },
});
