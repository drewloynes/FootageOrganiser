import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@lib': resolve('src/main/lib'),
        '@shared': resolve('src/shared'),
        '@worker': resolve('src/worker')
      }
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/main/main.ts'),
          worker: resolve(__dirname, 'src/worker/worker.ts')
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          preload: resolve(__dirname, 'src/preload/index.ts') // Path to your preload file
        }
      }
    }
  },
  renderer: {
    assetsInclude: 'src/renderer/assets/**',
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@shared': resolve('src/shared'),
        '@/components': resolve('src/renderer/src/components')
      }
    },
    plugins: [react()]
  }
})
