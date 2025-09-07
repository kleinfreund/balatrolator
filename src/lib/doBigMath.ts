import { add, BigNumber, bignumber, divide, floor, multiply, pow } from 'mathjs'

import { formatScoreValue } from '#utilities/formatScoreValue.ts'
import type { DeckName, ScoreValue } from './types.ts'

export function doBigMath (scoreValues: ScoreValue[], deck: DeckName) {
	let chips = bignumber(0)
	let multiplier = bignumber(0)
	const log: string[] = []
	for (const scoreValue of scoreValues) {
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

		const formattedScoreValue = formatScoreValue(scoreValue, {
			chips: chips.toString(),
			multiplier: multiplier.toString(),
		})
		log.push(formattedScoreValue)

		if (import.meta.env?.VITE_DEBUG === 'true') {
			console.log(formattedScoreValue)
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
	return { score: score.toString(), log }
}
