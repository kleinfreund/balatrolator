import type { Card, Suit } from '#lib/types.js'

export function isSuit ({ card }: { card: Card }, suit: Suit | Suit[]): boolean {
	if (card.enhancement === 'stone') {
		return false
	}

	if (card.enhancement === 'wild') {
		return true
	}

	const suits = Array.isArray(suit) ? suit : [suit]
	return suits.includes(card.suit)
}
