import { defineConfig } from 'vite';

/**
 * У Phaser 4 в package.json объявлен только корневой exports-путь,
 * поэтому никаких алиасов на dist/ быть не должно: пакет импортируется как есть,
 * а в коде используется namespace-импорт (`import * as Phaser from 'phaser'`).
 */
export default defineConfig({
  base: './',
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
