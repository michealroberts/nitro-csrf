/*****************************************************************************************************************/

// @author         Michael Roberts <michael@observerly.com>
// @package        @observerly/typescript-vite-template
// @license        Copyright © 2021-2023 observerly

/*****************************************************************************************************************/

/// <reference types="vitest" />

/*****************************************************************************************************************/

import { defineConfig } from 'vite'

import typescript from '@rollup/plugin-typescript'

import { resolve } from 'path'

/*****************************************************************************************************************/

export default defineConfig({
  test: {
    watch: false,
    passWithNoTests: true,
    threads: false
  },
  plugins: [
    typescript({
      tsconfig: './tsconfig.json'
    })
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, '/src')
    }
  },
  build: {
    outDir: './dist',
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: '@observerly/nitro-csrf',
      fileName: format => `nitro-csrf.${format}.js`
    },
    rollupOptions: {
      external: ['./playground/*.ts'],
      output: {
        sourcemap: true
      }
    }
  }
})

/*****************************************************************************************************************/
