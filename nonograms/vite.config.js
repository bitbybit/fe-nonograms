import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  base: 'https://rolling-scopes-school.github.io/bitbybit-JSFE2024Q4/simon-says/',

  resolve: {
    alias: {
      style: resolve(import.meta.dirname, './style'),
      service: resolve(import.meta.dirname, './service')
    }
  },

  build: {
    assetsInlineLimit: 0,
    cssCodeSplit: false,
    cssMinify: false,
    sourcemap: true,
    minify: false,

    rollupOptions: {
      input: {
        index: 'index.html'
      }
    }
  },

  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern'
      }
    }
  }
})
