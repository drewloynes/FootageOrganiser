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
        '@shared-all': resolve(__dirname, 'src/shared-all'),
        '@shared-node': resolve(__dirname, 'src/shared-node'),
        '@worker': resolve(__dirname, 'src/worker'),
        '@main': resolve(__dirname, 'src/main'),
        '@resources': resolve(__dirname, 'resources')
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
    assetsInclude: 'src/renderer/assets/**',
    resolve: {
      alias: {
        '@renderer': resolve(__dirname, 'src/renderer/src'),
        '@shared-all': resolve(__dirname, 'src/shared-all'),
        '@assets': resolve(__dirname, 'src/renderer/src/assets'),
        '@components': resolve(__dirname, 'src/renderer/src/components'),
        '@resources': resolve(__dirname, 'resources')
      }
    },
    define: {
      FOOTAGE_ORGANISER_VERSION: JSON.stringify(packageJson.version)
    },
    plugins: [react(), tailwindcss()]
  }
})
