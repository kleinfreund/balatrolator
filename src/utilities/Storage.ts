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

	const stringified = queryParameter ? atob(queryParameter) : Storage.get(key)
	return stringified ? JSON.parse(stringified) as InitialState : null
}

export function saveState (key: string, initialState: InitialState) {
	const stringified = JSON.stringify(initialState)

	const urlParams = new URLSearchParams()
	urlParams.set(QUERY_PARAMETER, btoa(stringified))
	window.location.search = urlParams.toString()

	Storage.set(key, stringified)
}
