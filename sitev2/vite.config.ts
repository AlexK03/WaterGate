import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/WaterGate/', // critical for GitHub Pages project sites
  server: {
    host: true,          // 0.0.0.0 — listen on all interfaces
    port: 5173,
    strictPort: true,
    // HMR websocket must point to your LAN IP so phones/tablets can connect
    hmr: {
      host: process.env.VITE_HOST || '172.22.152.68', // replace with your LAN IP if needed
      protocol: 'ws',
      port: 5173
    }
  }
})
