const shouldLog = import.meta.env.VITE_DEBUG === 'true'

export function logGroup (...parameters: Parameters<typeof console.log>) {
	if (shouldLog) console.group()
	log(...parameters)
}

export function logGroupEnd (...parameters: Parameters<typeof console.log>) {
	log(...parameters)
	if (shouldLog) console.groupEnd()
}

export function log (...parameters: Parameters<typeof console.log>) {
	if (shouldLog) console.log(...parameters)
}
