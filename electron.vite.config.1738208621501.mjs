// electron.vite.config.ts
import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin } from "electron-vite";
import react from "@vitejs/plugin-react";
var __electron_vite_injected_dirname = "C:\\Users\\drewl\\CodingProjects\\DrewsTools\\footage-organiser-old";
var electron_vite_config_default = defineConfig({
  main: {
    plugins: [externalizeDepsPlugin()],
    resolve: {
      alias: {
        "@lib": resolve("src/main/lib"),
        "@shared": resolve("src/shared"),
        "@worker": resolve("src/worker")
      }
    },
    build: {
      rollupOptions: {
        input: {
          main: resolve(__electron_vite_injected_dirname, "src/main/main.ts"),
          worker: resolve(__electron_vite_injected_dirname, "src/worker/worker.ts")
        }
      }
    }
  },
  preload: {
    plugins: [externalizeDepsPlugin()],
    build: {
      rollupOptions: {
        input: {
          preload: resolve(__electron_vite_injected_dirname, "src/preload/index.ts")
          // Path to your preload file
        },
        output: {
          format: "cjs"
        }
      }
    }
  },
  renderer: {
    assetsInclude: "src/renderer/assets/**",
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@shared": resolve("src/shared"),
        "@/components": resolve("src/renderer/src/components")
      }
    },
    plugins: [react()]
  }
});
export {
  electron_vite_config_default as default
};
