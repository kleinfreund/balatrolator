import { deminify, minify } from './minifier.js'
import type { State } from '#lib/types.js'

export const WebStorage = {
	get (key: string): string | null {
		try {
			return window.localStorage.getItem(key)
		} catch (error) {
			console.error(error)
			return null
		}
	},

	set (key: string, value: string) {
		try {
			window.localStorage.setItem(key, value)
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
	const minified = urlParams.get('state')

	return minified ? deminify(minified) : null
}

export function saveStateToUrl (state: State) {
	const urlParams = new URLSearchParams(window.location.search)
	const minified = minify(state)
	urlParams.set('state', minified)

	window.history.pushState({}, '', `?${urlParams.toString()}`)
}
