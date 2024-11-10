import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import wasm from "vite-plugin-wasm";
import topLevelAwait from "vite-plugin-top-level-await";
import tsconfigPaths from "vite-tsconfig-paths"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), wasm(), topLevelAwait(), tsconfigPaths()],
  base: "./",
  resolve: {
    dedupe: ['preact','preact/hooks','preact/compat']
  },
  optimizeDeps: {
    exclude: ["cdb-transformer-wasm", "@sqlite.org/sqlite-wasm"]
  },
})
