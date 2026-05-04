import { Decimal } from 'decimal.js'

import { formatScoreValue } from './formatScoreValue.ts'
import type { DeckName, ScoreValue } from './types.ts'

Decimal.set({ precision: 64 })

export function doBigMath (scoreValues: ScoreValue[], deck: DeckName): {
	chips: string
	multiplier: string
	score: string
	log: string[]
} {
	let chips = Decimal(0)
	let multiplier = Decimal(0)
	const log: string[] = []
	for (const scoreValue of scoreValues) {
		if (scoreValue.chips) {
			const [operator, value] = scoreValue.chips
			chips = chips[operator === '+' ? 'add' : 'mul'](value)
		}
		if (scoreValue.multiplier) {
			const [operator, value] = scoreValue.multiplier
			multiplier = multiplier[operator === '+' ? 'add' : 'mul'](value)
		}

		const formattedScoreValue = formatScoreValue(scoreValue, {
			chips: chips.toString(),
			multiplier: multiplier.toString(),
		})
		if (formattedScoreValue !== '') {
			log.push(formattedScoreValue)
		}
	}

	let actualScore
	if (deck === 'Plasma Deck') {
		actualScore = chips.add(multiplier).div(2).pow(2)
	} else {
		actualScore = chips.mul(multiplier)
	}

	// Balatro seems to round values starting at a certain threshold and it seems to round down. 🤔
	const score = actualScore.greaterThan(10_000) ? actualScore.floor() : actualScore
	return {
		chips: chips.toString(),
		multiplier: multiplier.toString(),
		score: score.toString(),
		log,
	}
}
