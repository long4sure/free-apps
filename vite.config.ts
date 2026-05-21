import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// Relative base works on GitHub Pages subpaths without hard-coding the repo name
const base = process.env.VITE_BASE_PATH || './'

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
