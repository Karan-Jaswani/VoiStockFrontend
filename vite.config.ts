import { defineConfig } from 'vite'

// Some plugins are ESM-only. Load them dynamically so Node/ESBuild won't try to require() them.
export default defineConfig(async () => {
  const react = (await import('@vitejs/plugin-react')).default
  return {
    plugins: [react()],
    resolve: {
      alias: {
        // add aliases here if required
      }
    }
  }
})
