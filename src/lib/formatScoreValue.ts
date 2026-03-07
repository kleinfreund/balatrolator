import type { ScoreValue } from '#lib/types.ts'

export function formatScoreValue (
	{ chips, multiplier, phase, card, joker, type, trigger }: ScoreValue,
	currentScoreValue: { chips: string, multiplier: string },
): string {
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
		return ''
	}

	const prefix = `${phase}:`
	let str = `${prefix.padEnd(13)}${valueStr}`
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

	return str + ` → ${currentScoreValue.chips}×${currentScoreValue.multiplier}`
}
