const shouldLog = import.meta.env.VITE_DEBUG === 'true'

export function logGroup (...parameters: Parameters<typeof console.log>) {
	log(...parameters)
	if (shouldLog) console.group()
}

export function logGroupEnd (...parameters: Parameters<typeof console.log>) {
	if (shouldLog) console.groupEnd()
	log(...parameters)
}

export function log (...parameters: Parameters<typeof console.log>) {
	if (shouldLog) {
		const transformedParameters = parameters.map((parameter) => {
			if (
				parameter &&
				typeof parameter === 'object' &&
				'chips' in parameter &&
				'multiplier' in parameter &&
				Object.keys(parameter).length === 2
			) {
				return `${parameter.chips} × ${parameter.multiplier}`
			}

			return parameter
		})

		console.log(...transformedParameters)
	}
}
