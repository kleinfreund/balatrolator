import type { Blind, Card, JokerName, Rank, Suit } from './types.ts'

export function isDebuffed (card: Card, blind: Blind, jokerSet: Set<JokerName>) {
	if (blind.active) {
		if (
			(blind.name === 'Verdant Leaf') ||
			(blind.name === 'The Club' && isSuit(card, 'Clubs', jokerSet)) ||
			(blind.name === 'The Goad' && isSuit(card, 'Spades', jokerSet)) ||
			(blind.name === 'The Head' && isSuit(card, 'Hearts', jokerSet)) ||
			(blind.name === 'The Window' && isSuit(card, 'Diamonds', jokerSet)) ||
			(blind.name === 'The Plant' && isFaceCard(card, jokerSet))
		) {
			return true
		}
	}

	return false
}

export function isFaceCard (card: Card, jokerSet: Set<JokerName>) {
	if (jokerSet.has('Pareidolia')) {
		return true
	}

	return isRank(card, ['King', 'Queen', 'Jack'])
}

export function isRank (card: Card, rank: Rank | Rank[]): boolean {
	if (card.debuffed) {
		return false
	}

	if (card.enhancement === 'Stone') {
		return false
	}

	const ranks = Array.isArray(rank) ? rank : [rank]
	return ranks.includes(card.rank)
}

export function isSuit (card: Card, suit: Suit | Suit[], jokerSet: Set<JokerName>): boolean {
	// Apparently, debuffed cards don't count as any suit **unless** they're wild. Then, they count as their original suit.
	if (card.debuffed && card.enhancement !== 'Wild') {
		return false
	}

	if (card.enhancement === 'Stone') {
		return false
	}

	// Apparently, wild cards only count as any suit **if** they're not debuffed. Then, they count as their original suit.
	if (card.enhancement === 'Wild' && !card.debuffed) {
		return true
	}

	const suits = new Set(Array.isArray(suit) ? suit : [suit])

	if (jokerSet.has('Smeared Joker')) {
		if (suits.has('Clubs')) {
			suits.add('Spades')
		}

		if (suits.has('Spades')) {
			suits.add('Clubs')
		}

		if (suits.has('Hearts')) {
			suits.add('Diamonds')
		}

		if (suits.has('Diamonds')) {
			suits.add('Hearts')
		}
	}

	return suits.has(card.suit)
}
