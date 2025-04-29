import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { resolve } from 'path'
import packageJson from './package.json'

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        '@shared': resolve('src/shared'),
        '@worker': resolve('src/worker'),
        '@main': resolve('src/main')
      }
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'src/main/main.ts'),
          worker: resolve(__dirname, 'src/worker/worker.ts')
        }
      }
    },
    define: {
      FOOTAGE_ORGANISER_VERSION: JSON.stringify(packageJson.version)
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          preload: resolve(__dirname, 'src/preload/index.ts') // Path to your preload file
        },
        output: {
          format: 'cjs'
        }
      }
    }
  },
  renderer: {
    assetsInclude: ['src/renderer/assets/**'],
    resolve: {
      alias: {
        '@renderer': resolve('src/renderer/src'),
        '@shared': resolve('src/shared'),
        '@assets': resolve('src/renderer/src/assets'),
        '@components': resolve('src/renderer/src/components')
      }
    },
    define: {
      FOOTAGE_ORGANISER_VERSION: JSON.stringify(packageJson.version)
    },
    plugins: [react(), tailwindcss()]
  }
})
