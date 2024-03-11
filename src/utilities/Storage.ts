import {
	compressToEncodedURIComponent,
	compressToUTF16,
	decompressFromEncodedURIComponent,
	decompressFromUTF16,
} from 'lz-string'

import { deminify, minify } from './minifier.js'
import type { State } from '#lib/types.js'

export function fetchState (key: string): State | null {
	const minified = QueryParameter.get('state') ?? WebStorage.get(key)

	return minified ? deminify(minified) : null
}

export function saveState (key: string, state: State) {
	const minified = minify(state)

	WebStorage.set(key, minified)
	QueryParameter.set('state', minified)
}

const WebStorage = {
	get (key: string): string | null {
		try {
			const value = window.localStorage.getItem(key)

			return value ? decompressFromUTF16(value) : null
		} catch (error) {
			console.error(error)
			return null
		}
	},

	set (key: string, value: string) {
		try {
			window.localStorage.setItem(key, compressToUTF16(value))
		} catch (error) {
			console.error(error)
		}
	},
}

const QueryParameter = {
	get (key: string): string | null {
		const urlParams = new URLSearchParams(window.location.search)
		const compressed = urlParams.get(key)

		return compressed ? decompressFromEncodedURIComponent(compressed) : null
	},

	set (key: string, value: string) {
		const urlParams = new URLSearchParams(window.location.search)
		urlParams.set(key, compressToEncodedURIComponent(value))

		window.history.pushState({}, '', `?${urlParams.toString()}`)
	},
}
