import type { Card, State } from '#lib/types.js'
import { isFaceCard } from './isFaceCard.js'
import { isSuit } from './isSuit.js'

export function isDebuffed ({ state, card }: { state: State, card: Card }) {
	if (state.blind.isActive) {
		if (
			(state.blind.name === 'Verdant Leaf') ||
			(state.blind.name === 'The Club' && isSuit({ card }, 'Clubs')) ||
			(state.blind.name === 'The Goad' && isSuit({ card }, 'Spades')) ||
			(state.blind.name === 'The Head' && isSuit({ card }, 'Hearts')) ||
			(state.blind.name === 'The Window' && isSuit({ card }, 'Diamonds')) ||
			(state.blind.name === 'The Plant' && isFaceCard({ state, card}))
		) {
			return true
		}
	}

	return card.isDebuffed
}
