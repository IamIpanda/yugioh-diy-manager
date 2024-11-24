import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'

import wasm from "vite-plugin-wasm";
import { plugin as markdown, Mode } from "vite-plugin-markdown"
import topLevelAwait from "vite-plugin-top-level-await";
import tsconfigPaths from "vite-tsconfig-paths"

import { execSync } from "child_process"
import dayjs from "dayjs"

const COMMIT_HASH = execSync('git rev-parse --short HEAD').toString().trim()
const BUILD_DATE = dayjs().format("YYYY-MM-DD HH:mm:ss")
const BUILD_DATE_NESTED = dayjs().format("YYYYMMDDHHmmss")
const VERSION = process.env.npm_package_version + "." + COMMIT_HASH + "." + BUILD_DATE_NESTED

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [preact(), wasm(), markdown({ mode: [Mode.HTML] }), topLevelAwait(), tsconfigPaths()],
  base: "./",
  resolve: {
    dedupe: ['preact','preact/hooks','preact/compat']
  },
  define: {
    BUILD_DATE: JSON.stringify(BUILD_DATE),
    PACKAGE_VERSION: JSON.stringify(VERSION)
  },
  optimizeDeps: {
    exclude: ["cdb-transformer-wasm", "@sqlite.org/sqlite-wasm"]
  },
})
