import type { Blind, Card } from '#lib/types.js'
import { isFaceCard } from './isFaceCard.js'
import { isSuit } from './isSuit.js'

export function isDebuffed (card: Card, blind: Blind, hasPareidolia: boolean) {
	if (blind.isActive) {
		if (
			(blind.name === 'Verdant Leaf') ||
			(blind.name === 'The Club' && isSuit(card, 'Clubs')) ||
			(blind.name === 'The Goad' && isSuit(card, 'Spades')) ||
			(blind.name === 'The Head' && isSuit(card, 'Hearts')) ||
			(blind.name === 'The Window' && isSuit(card, 'Diamonds')) ||
			(blind.name === 'The Plant' && isFaceCard(card, hasPareidolia))
		) {
			return true
		}
	}

	return false
}
