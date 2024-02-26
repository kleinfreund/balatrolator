import { RANK_TO_CHIP_MAP, RANK_TO_INDEX_MAP } from './data.js'
import { Card, HandName, Rank, Suit } from './types.js'

export interface GetHandOptions {
	hasFourFingers?: boolean
	hasShortcut?: boolean
	hasSmearedJoker?: boolean
}

const DEFAULT_OPTIONS: Required<GetHandOptions> = {
	hasFourFingers: false,
	hasShortcut: false,
	hasSmearedJoker: false,
}

export function getHand (cards: Card[], options: GetHandOptions = DEFAULT_OPTIONS): { playedHand: HandName, scoringCards: Card[] } {
	const {
		hasFourFingers = DEFAULT_OPTIONS.hasFourFingers,
		hasShortcut = DEFAULT_OPTIONS.hasShortcut,
		hasSmearedJoker = DEFAULT_OPTIONS.hasSmearedJoker,
	} = options

	const fiveOfAKindCards = nOfAKind(cards, 5)
	const flushCards = flush(cards, hasFourFingers, hasSmearedJoker)
	if (fiveOfAKindCards.length > 0 && flushCards.length > 0) {
		const scoringCards = combineCards(cards, fiveOfAKindCards, flushCards)

		return { playedHand: 'Flush Five', scoringCards }
	}

	const fullHouseCards = fullHouse(cards)
	if (fullHouseCards.length > 0 && flushCards.length > 0) {
		const scoringCards = combineCards(cards, fullHouseCards, flushCards)

		return { playedHand: 'Flush House', scoringCards }
	}

	if (fiveOfAKindCards.length > 0) {
		return { playedHand: 'Five of a Kind', scoringCards: fiveOfAKindCards }
	}

	const straightCards = straight(cards, hasFourFingers, hasShortcut)
	if (flushCards.length > 0 && straightCards.length > 0) {
		const scoringCards = combineCards(cards, flushCards, straightCards)

		return { playedHand: 'Straight Flush', scoringCards }
	}

	const fourOfAKindCards = nOfAKind(cards, 4)
	if (fourOfAKindCards.length > 0) {
		return { playedHand: 'Four of a Kind', scoringCards: fourOfAKindCards }
	}

	if (fullHouseCards.length > 0) {
		return { playedHand: 'Full House', scoringCards: fullHouseCards }
	}

	if (flushCards.length > 0) {
		return { playedHand: 'Flush', scoringCards: flushCards }
	}

	if (straightCards.length > 0) {
		return { playedHand: 'Straight', scoringCards: straightCards }
	}

	const threeOfAKindCards = nOfAKind(cards, 3)
	if (threeOfAKindCards.length > 0) {
		return { playedHand: 'Three of a Kind', scoringCards: threeOfAKindCards }
	}

	const twoPairCards = twoPair(cards)
	if (twoPairCards.length > 0) {
		return { playedHand: 'Two Pair', scoringCards: twoPairCards }
	}

	const twoOfAKindCards = nOfAKind(cards, 2)
	if (twoOfAKindCards.length > 0) {
		return { playedHand: 'Pair', scoringCards: twoOfAKindCards }
	}

	const highCardCards = highCard(cards)
	return { playedHand: 'High Card', scoringCards: highCardCards }
}

export function fullHouse (cards: Card[]): Card[] {
	const map = new Map<Rank, Card[]>()

	for (const card of cards) {
		if (card.enhancement === 'stone') continue

		if (!map.has(card.rank)) {
			map.set(card.rank, [])
		}

		const entry = map.get(card.rank)!
		entry.push(card)
	}

	const threeOfAKindCards: Card[] = []
	const pairCards: Card[] = []
	for (const cards of map.values()) {
		if (cards.length === 3) {
			threeOfAKindCards.push(...cards)
		} else if (cards.length === 2) {
			pairCards.push(...cards)
		}
	}

	return threeOfAKindCards.length > 0 && pairCards.length > 0 ? cards.filter((card) => threeOfAKindCards.includes(card) || pairCards.includes(card)) : []
}

const SMEARED_JOKER_PAIRS: Record<Suit, Suit> = {
	'Spades': 'Clubs',
	'Hearts': 'Diamonds',
	'Clubs': 'Spades',
	'Diamonds': 'Hearts',
}

export function flush (cards: Card[], hasFourFingers: boolean, hasSmearedJoker: boolean): Card[] {
	const flushnessThreshold = hasFourFingers ? 4 : 5
	const map = new Map<Suit, Card[]>()

	for (const card of cards) {
		if (card.enhancement === 'stone') continue

		const suits: Suit[] = card.enhancement === 'wild'
			? ['Spades', 'Hearts', 'Clubs', 'Diamonds']
			: hasSmearedJoker
				? [card.suit, SMEARED_JOKER_PAIRS[card.suit]]
				: [card.suit]

		for (const suit of suits) {
			if (!map.has(suit)) {
				map.set(suit, [])
			}

			map.get(suit)!.push(card)
		}
	}

	for (const cards of map.values()) {
		if (cards.length === flushnessThreshold) {
			return cards
		}
	}

	return []
}

export function straight (cards: Card[], hasFourFingers: boolean, hasShortcut: boolean): Card[] {
	const straightnessThreshold = hasFourFingers ? 4 : 5
	const gap = hasShortcut ? 2 : 1
	const cardIndexes = cards
		.filter(({ enhancement }) => enhancement !== 'stone')
		.map(({ rank }) => RANK_TO_INDEX_MAP[rank])
	cardIndexes.sort((a, b) => a - b)

	const gaps = Array.from({ length: gap }, (_, index) => index + 1)

	let previousCardIndex = cardIndexes[0]!
	const scoringCardIndexes: number[] = [previousCardIndex]
	let isStraight = false
	for (let i = 1; i < cardIndexes.length; i++) {
		const cardIndex = cardIndexes[i]!

		if (gaps.some((gap) => previousCardIndex + gap === cardIndex)) {
			scoringCardIndexes.push(cardIndex)
		}

		previousCardIndex = cardIndex

		if (scoringCardIndexes.length === straightnessThreshold) {
			isStraight = true
		}
	}

	return isStraight ? cards.filter(({ rank }) => scoringCardIndexes.includes(RANK_TO_INDEX_MAP[rank]!)) : []
}

export function twoPair (cards: Card[]): Card[] {
	const map = new Map<Rank, Card[]>()

	for (const card of cards) {
		if (card.enhancement === 'stone') continue

		if (!map.has(card.rank)) {
			map.set(card.rank, [])
		}
		const entry = map.get(card.rank)!
		entry.push(card)
	}

	const firstPairCards: Card[] = []
	const secondPairCards: Card[] = []
	for (const cards of map.values()) {
		if (cards.length === 2) {
			if (firstPairCards.length > 0) {
				secondPairCards.push(...cards)
				break
			} else {
				firstPairCards.push(...cards)
			}
		}
	}

	return firstPairCards.length > 0 && secondPairCards.length > 0 ? firstPairCards.concat(...secondPairCards) : []
}

export function nOfAKind (cards: Card[], n: number): Card[] {
	const map = new Map<Rank, Card[]>()

	for (const card of cards) {
		if (card.enhancement === 'stone') continue

		if (!map.has(card.rank)) {
			map.set(card.rank, [])
		}
		const entry = map.get(card.rank)!
		entry.push(card)
	}

	const scoringCards: Card[] = []
	for (const cards of map.values()) {
		if (cards.length >= n) {
			scoringCards.push(...cards)
		}
	}

	return scoringCards
}

export function highCard (cards: Card[]): Card[] {
	let highestCard
	let highestChips = 0

	for (const card of cards) {
		const chips = RANK_TO_CHIP_MAP[card.rank]

		if (chips > highestChips) {
			highestChips = chips
			highestCard = card
		}
	}

	return [highestCard!]
}

function combineCards (scoringCards: Card[], cardsA: Card[], cardsB: Card[]): Card[] {
	return scoringCards.filter((card) => {
		if (cardsA.some(({ rank, suit }) => rank === card.rank && suit === card.suit)) {
			return true
		}

		if (cardsB.some(({ rank, suit }) => rank === card.rank && suit === card.suit)) {
			return true
		}

		return false
	})
}
