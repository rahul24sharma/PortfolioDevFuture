import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
  },
  build: {
    /** Hero chunk bundles Three + R3F; expected ~900kB minified. */
    chunkSizeWarningLimit: 1000,
  },
})
