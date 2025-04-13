import { RANK_TO_CHIP_MAP, RANK_TO_INDEX_MAP } from './data.ts'
import type { Card, HandName, JokerName, Rank, Suit } from './types.ts'

export function getHand (playedCards: Card[], jokerSet: Set<JokerName>): { playedHand: HandName, scoringCards: Card[] } {
	const playedStoneCards = playedCards.filter(({ enhancement }) => enhancement === 'stone')

	const fiveOfAKindCards = nOfAKind(playedCards, 5)
	const flushCards = flush(playedCards, jokerSet)
	if (fiveOfAKindCards.length > 0 && flushCards.length > 0) {
		const scoringCards = combineCards(playedCards, playedStoneCards, fiveOfAKindCards, flushCards)

		return { playedHand: 'Flush Five', scoringCards }
	}

	const fullHouseCards = fullHouse(playedCards)
	if (fullHouseCards.length > 0 && flushCards.length > 0) {
		const scoringCards = combineCards(playedCards, playedStoneCards, fullHouseCards, flushCards)

		return { playedHand: 'Flush House', scoringCards }
	}

	if (fiveOfAKindCards.length > 0) {
		const scoringCards = combineCards(playedCards, fiveOfAKindCards, playedStoneCards)

		return { playedHand: 'Five of a Kind', scoringCards }
	}

	const straightCards = straight(playedCards, jokerSet)
	if (flushCards.length > 0 && straightCards.length > 0) {
		const scoringCards = combineCards(playedCards, playedStoneCards, flushCards, straightCards)

		return { playedHand: 'Straight Flush', scoringCards }
	}

	const fourOfAKindCards = nOfAKind(playedCards, 4)
	if (fourOfAKindCards.length > 0) {
		const scoringCards = combineCards(playedCards, fourOfAKindCards, playedStoneCards)

		return { playedHand: 'Four of a Kind', scoringCards }
	}

	if (fullHouseCards.length > 0) {
		const scoringCards = combineCards(playedCards, fullHouseCards, playedStoneCards)

		return { playedHand: 'Full House', scoringCards }
	}

	if (flushCards.length > 0) {
		const scoringCards = combineCards(playedCards, flushCards, playedStoneCards)

		return { playedHand: 'Flush', scoringCards }
	}

	if (straightCards.length > 0) {
		const scoringCards = combineCards(playedCards, straightCards, playedStoneCards)

		return { playedHand: 'Straight', scoringCards }
	}

	const threeOfAKindCards = nOfAKind(playedCards, 3)
	if (threeOfAKindCards.length > 0) {
		const scoringCards = combineCards(playedCards, threeOfAKindCards, playedStoneCards)

		return { playedHand: 'Three of a Kind', scoringCards }
	}

	const twoPairCards = twoPair(playedCards)
	if (twoPairCards.length > 0) {
		const scoringCards = combineCards(playedCards, twoPairCards, playedStoneCards)

		return { playedHand: 'Two Pair', scoringCards }
	}

	const twoOfAKindCards = nOfAKind(playedCards, 2)
	if (twoOfAKindCards.length > 0) {
		const scoringCards = combineCards(playedCards, twoOfAKindCards, playedStoneCards)

		return { playedHand: 'Pair', scoringCards }
	}

	const highCardCards = highCard(playedCards)
	const scoringCards = combineCards(playedCards, highCardCards, playedStoneCards)

	return { playedHand: 'High Card', scoringCards }
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

export function flush (cards: Card[], jokerSet: Set<JokerName>): Card[] {
	const flushnessThreshold = jokerSet.has('Four Fingers') ? 4 : 5
	const map = new Map<Suit, Card[]>()

	for (const card of cards) {
		if (card.enhancement === 'stone') continue

		const suits: Suit[] = card.enhancement === 'wild'
			? ['Spades', 'Hearts', 'Clubs', 'Diamonds']
			: jokerSet.has('Smeared Joker')
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

export function straight (cards: Card[], jokerSet: Set<JokerName>): Card[] {
	const straightnessThreshold = jokerSet.has('Four Fingers') ? 4 : 5
	const gap = jokerSet.has('Shortcut') ? 2 : 1
	const cardIndexes = cards
		.filter(({ enhancement }) => enhancement !== 'stone')
		.map(({ rank }) => {
			if (rank === 'Ace') {
				// Count an Ace both for its natural rank (i.e. succeeding a “King”) and for its special rank (i.e. preceeding a “2”).
				return [RANK_TO_INDEX_MAP[rank], 1]
			}

			return [RANK_TO_INDEX_MAP[rank]]
		})
		.flat()
	cardIndexes.sort((a, b) => a - b)

	const gaps = Array.from({ length: gap }, (_, index) => index + 1)

	let previousCardIndex = cardIndexes[0]!
	const scoringCardIndexes: number[] = [previousCardIndex]
	let isStraight = false
	for (let i = 1; i < cardIndexes.length; i++) {
		const cardIndex = cardIndexes[i]!
		const isWithinGap = gaps.some((gap) => previousCardIndex + gap === cardIndex)

		if (isWithinGap) {
			scoringCardIndexes.push(cardIndex)

			if (scoringCardIndexes.length === straightnessThreshold) {
				// Mark the hand as a straight but continue evaluating to determine _all scoring_ cards, not just the ones needed to form a straight.
				isStraight = true
			}
		} else if (!isStraight) {
			// If the hand isn't already a straight and the straightness is broken, start over by clearing the preliminary list of scoring card indexes and assuming the next card is the start of a straight.
			scoringCardIndexes.length = 0
			scoringCardIndexes.push(cardIndex)
		}

		previousCardIndex = cardIndex
	}

	if (!isStraight) {
		return []
	}

	return cards.filter(({ rank }) => {
		if (rank === 'Ace' && scoringCardIndexes.includes(1)) {
			return true
		}

		return scoringCardIndexes.includes(RANK_TO_INDEX_MAP[rank]!)
	})
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
		if (card.enhancement === 'stone' && highestCard === undefined) {
			highestCard = card
		}

		const chips = RANK_TO_CHIP_MAP[card.rank]

		if (chips > highestChips) {
			highestChips = chips
			highestCard = card
		}
	}

	return [highestCard as Card]
}

function combineCards (playedCards: Card[], ...cardLists: Card[][]): Card[] {
	return playedCards.filter((playedCard) => {
		for (const cards of cardLists) {
			if (cards.some(({ index }) => index === playedCard.index)) {
				return true
			}
		}

		return false
	})
}
