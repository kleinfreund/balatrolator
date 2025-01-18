import { add, BigNumber, bignumber, divide, floor, multiply, pow } from 'mathjs'

import type { DeckName, ScoreValue } from './types.ts'

export function doBigMath (initialScore: ScoreValue[], deck: DeckName) {
	let chips = bignumber(0)
	let multiplier = bignumber(0)
	for (const scoreValue of initialScore) {
		if (scoreValue.chips) {
			const [operator, value] = scoreValue.chips
			const operation = operator === '+' ? add : multiply
			chips = operation(chips, bignumber(value))
		}
		if (scoreValue.multiplier) {
			const [operator, value] = scoreValue.multiplier
			const operation = operator === '+' ? add : multiply
			multiplier = operation(multiplier, bignumber(value))
		}
	}

	let actualScore: BigNumber
	if (deck === 'Plasma Deck') {
		actualScore = pow(divide(add(chips, multiplier), bignumber(2)), bignumber(2)) as BigNumber // mathjs type bug
	} else {
		actualScore = multiply(chips, multiplier) as BigNumber // mathjs type bug
	}

	// Balatro seems to round values starting at a certain threshold and it seems to round down. 🤔
	const score = actualScore.greaterThan(10000) ? floor(actualScore) : actualScore
	return score.toString()
}
