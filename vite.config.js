import { defineConfig } from "vite"

export default defineConfig(({ command, mode }) => ({
  root: 'src',
  base: (mode === 'production')
  ? '/a-frame-mediapipe-template/' : './',
  build: {
    outDir: '../docs',
    emptyOutDir: true,
  },
}))