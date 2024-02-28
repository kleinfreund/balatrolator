type Params<T extends 'getItem' | 'setItem' | 'removeItem'> = Parameters<typeof window.localStorage[T]>

export const Storage = {
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
