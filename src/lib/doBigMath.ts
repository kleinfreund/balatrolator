import { add, BigNumber, bignumber, divide, floor, multiply, pow } from 'mathjs'

import type { DeckName, Score } from './types.js'

export function doBigMath (initialScore: Score, deck: DeckName) {
	const chips = initialScore.chips.reduce((totalChips, chips) => {
		return add(totalChips, bignumber(chips))
	}, bignumber(0))
	const multiplier = initialScore.multiplier.reduce((totalMultiplier, [operation, multiplier]) => {
		const operator = operation === '+' ? add : multiply
		return operator(totalMultiplier, bignumber(multiplier))
	}, bignumber(0))

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
