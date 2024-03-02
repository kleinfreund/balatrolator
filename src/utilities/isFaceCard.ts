import type { Card } from '#lib/types.js'
import { isRank } from './isRank.js'

export function isFaceCard (card: Card, hasPareidolia: boolean) {
	if (hasPareidolia) {
		return true
	}

	return isRank(card, ['King', 'Queen', 'Jack'])
}
