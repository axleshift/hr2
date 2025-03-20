import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig(() => {
  return {
    plugins: [
      react({
        fastRefresh: false,
        jsxRuntime: 'automatic',
      }),
    ],
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: ['./__tests__/setup.js'],
      css: true,
      include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
      exclude: ['node_modules', 'dist'],
      transformMode: {
        web: [/.*/],
      },
    },
    resolve: {
      alias: [
        {
          find: 'src',
          replacement: `${path.resolve(__dirname, 'src')}/`,
        },
      ],
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.scss'],
    },
  }
})
