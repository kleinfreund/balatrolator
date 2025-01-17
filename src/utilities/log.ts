import type { ScoreValue } from '#lib/types.js'

export const log = import.meta.env.VITE_DEBUG === 'true' ? logFn : () => undefined

function logFn ({ chips, multiplier, phase, card, joker, type, trigger }: ScoreValue): void {
	let valueStr = ''
	if (chips) {
		const [operator, value] = chips
		if (!(operator === '*' && value === 1 || operator === '+' && value === 0)) {
			valueStr += ` chips ${operator}${value}`
		}
	}

	if (multiplier) {
		const [operator, value] = multiplier
		if (!(operator === '*' && value === 1 || operator === '+' && value === 0)) {
			valueStr += ` mult  ${operator}${value}`
		}
	}

	if (valueStr === '') {
		return
	}

	let str = `${phase}:${valueStr}`
	if (joker) {
		str += ` from ${joker}`

		if (card) {
			str += ` for ${card}`
		}
	} else if (card) {
		str += ` from ${card}`
	}

	if (type) {
		str += `'s ${type}`
	}
	if (trigger && trigger !== 'Regular') {
		str += ` (trigger: ${trigger})`
	}

	console.log(str)
}
