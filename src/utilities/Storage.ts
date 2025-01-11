import {
	compressToEncodedURIComponent,
	compressToUTF16,
	decompressFromEncodedURIComponent,
	decompressFromUTF16,
} from 'lz-string'

import { deminify, minify } from './minifier.js'
import type { State } from '#lib/types.js'

export const WebStorage = {
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

	remove (key: string) {
		try {
			window.localStorage.removeItem(key)
		} catch (error) {
			console.error(error)
		}
	},
}

export function readStateFromUrl (): State | null {
	const urlParams = new URLSearchParams(window.location.search)
	const compressed = urlParams.get('state')
	const minified = compressed ? decompressFromEncodedURIComponent(compressed) : null

	return minified ? deminify(minified) : null
}

export function saveStateToUrl (state: State) {
	const urlParams = new URLSearchParams(window.location.search)
	const minified = minify(state)
	const compressed = compressToEncodedURIComponent(minified)
	urlParams.set('state', compressed)

	window.history.pushState({}, '', `?${urlParams.toString()}`)
}
