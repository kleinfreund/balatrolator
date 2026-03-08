/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		environment: 'jsdom',
		coverage: {
			include: ['src'],
		},
		include: ['src/**/*.test.ts'],
	},
	build: {
		rollupOptions: {
			output: {
				manualChunks: {
					mathjs: ['mathjs'],
				},
			},
		},
	},
})
