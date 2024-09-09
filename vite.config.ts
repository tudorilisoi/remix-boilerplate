import { vitePlugin as remix } from '@remix-run/dev'
import { installGlobals } from '@remix-run/node'
import { defineConfig } from 'vite'
import tsconfigPaths from 'vite-tsconfig-paths'

installGlobals()

export default defineConfig({
  plugins: [remix(), tsconfigPaths()],
  server: {
    host: true,
    port: 3000,
  },
  preview: {
    port: 3000,
  },

  // NOTE optimizeDeps may be overkill, but sometimes throws 504 and needs manual reload
  // @see https://github.com/remix-run/remix/issues/8803
  optimizeDeps: {
    entries: ['./app/**/*.{tsx}'],
    include: [
      '@remix-run/react',
      '@prisma/client',
      '@zenstackhq/runtime',
      '@conform-to/zod',
      '@conform-to/react',
      'zod',
    ],
    exclude:[
      '@tailwindui/react'
    ],
  },
})
