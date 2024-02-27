import type { Card, State } from '#lib/types.js'
import { isRank } from './isRank.js'

export function isFaceCard ({ state, card }: { state: State, card: Card }) {
	if (state.jokerSet.has('Pareidolia')) {
		return true
	}

	return isRank({ card }, ['King', 'Queen', 'Jack'])
}
