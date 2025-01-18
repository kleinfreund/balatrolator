import type { Blind, Card, Rank, Suit } from './types.ts'

export function isDebuffed (card: Card, blind: Blind, hasPareidolia: boolean) {
	if (blind.active) {
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

export function isFaceCard (card: Card, hasPareidolia: boolean) {
	if (hasPareidolia) {
		return true
	}

	return isRank(card, ['King', 'Queen', 'Jack'])
}

export function isRank (card: Card, rank: Rank | Rank[]): boolean {
	if (card.enhancement === 'stone') {
		return false
	}

	const ranks = Array.isArray(rank) ? rank : [rank]
	return ranks.includes(card.rank)
}

export function isSuit (card: Card, suit: Suit | Suit[]): boolean {
	if (card.enhancement === 'stone') {
		return false
	}

	if (card.enhancement === 'wild') {
		return true
	}

	const suits = Array.isArray(suit) ? suit : [suit]
	return suits.includes(card.suit)
}
