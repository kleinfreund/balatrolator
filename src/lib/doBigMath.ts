import type { DeckName, Score } from './types.js'

export function doBigMath (initialScore: Score, deck: DeckName) {
	const chips = initialScore.chips.reduce((totalChips, chips) => {
		return totalChips + chips
	}, 0)
	const multiplier = initialScore.multiplier.reduce((totalMultiplier, [operation, multiplier]) => {
		return operation === '+'
			? totalMultiplier + multiplier
			: totalMultiplier * multiplier
	}, 0)

	let actualScore
	if (deck === 'Plasma Deck') {
		actualScore = Math.pow((chips + multiplier) / 2, 2)
	} else {
		actualScore = chips * multiplier
	}

	// Balatro seems to round values starting at a certain threshold and it seems to round down. 🤔
	return actualScore > 10000 ? Math.floor(actualScore) : actualScore
}
