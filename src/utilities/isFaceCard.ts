import type { Card, State } from '#lib/types.js'

export function isFaceCard ({ state, card }: { state: State, card: Card }) {
	if (card.enhancement === 'stone') {
		return false
	}

	if (state.jokerSet.has('Pareidolia')) {
		return true
	}

	return ['King', 'Queen', 'Jack'].includes(card.rank)
}
