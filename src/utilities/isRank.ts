import type { Card, Rank } from '#lib/types.js'

export function isRank ({ card }: { card: Card }, rank: Rank | Rank[]): boolean {
	if (card.enhancement === 'stone') {
		return false
	}

	const ranks = Array.isArray(rank) ? rank : [rank]
	return ranks.includes(card.rank)
}
