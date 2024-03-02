import {
	compressToEncodedURIComponent,
	compressToUTF16,
	decompressFromEncodedURIComponent,
	decompressFromUTF16,
} from 'lz-string'

import type { InitialState } from '#lib/types.js'

type Params<T extends 'getItem' | 'setItem' | 'removeItem'> = Parameters<typeof window.localStorage[T]>

const QUERY_PARAMETER = 'state'

const Storage = {
	set (...args: Params<'setItem'>) {
		window.localStorage.setItem(...args)
	},

	get (...args: Params<'getItem'>) {
		return window.localStorage.getItem(...args)
	},

	remove (...args: Params<'removeItem'>) {
		window.localStorage.removeItem(...args)
	},
}

export function fetchState (key: string): InitialState | null {
	const urlParams = new URLSearchParams(window.location.search)
	const queryParameter = urlParams.get(QUERY_PARAMETER)

	let stringified = null
	if (queryParameter) {
		stringified = decompressFromEncodedURIComponent(queryParameter)
	} else {
		const compressed = Storage.get(key)
		if (compressed) {
			stringified = decompressFromUTF16(compressed)
		}
	}

	return stringified ? JSON.parse(stringified) as InitialState : null
}

export function saveState (key: string, initialState: InitialState) {
	const stringified = JSON.stringify(initialState)

	const urlParams = new URLSearchParams(window.location.search)
	urlParams.set(QUERY_PARAMETER, compressToEncodedURIComponent(stringified))
	window.history.pushState({}, '', `?${urlParams.toString()}`)

	Storage.set(key, compressToUTF16(stringified))
}
