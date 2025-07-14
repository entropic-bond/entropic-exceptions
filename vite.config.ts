import { resolve } from 'path'
import { defineConfig } from 'vitest/config'
import dts from 'vite-plugin-dts'

export default defineConfig({
  test: {
		globals: true,
		exclude: ['**/node_modules', '**/dist', '.idea', '.git', '.cache','**/lib', '**/out'],
	},
	build: {
		lib: {
			entry: resolve( __dirname, 'src/index.ts' ),
			name: 'entropic-bond-exceptions',
			fileName: 'entropic-bond-exceptions',
			formats: ['es', 'umd', 'cjs'],
		},
		sourcemap: true,
		outDir: 'lib',
	},
	plugins: [
		dts()
	]
})
