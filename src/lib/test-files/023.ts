import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			blind: { name: 'The Head' },
			playedCards: [
				{ rank: '7', suit: 'Spades' },
				{ rank: '7', suit: 'Spades', enhancement: 'wild' },
				{ rank: '7', suit: 'Hearts' },
				{ rank: '7', suit: 'Diamonds' },
				{ rank: '2', suit: 'Spades' },
			],
			jokers: [
				{ name: 'Flowerpot' },
			],
		},
		expected: {
			hand: 'Four of a Kind',
			scoringCards: [
				{ rank: '7', suit: 'Spades' },
				// This _should_ count as a Four of a Kind
				{ rank: '7', suit: 'Spades', enhancement: 'wild' },
				{ rank: '7', suit: 'Hearts', isDebuffed: true },
				{ rank: '7', suit: 'Diamonds' },
			],
			score: 1554,
			formattedScore: '1,554',
		},
	}
}
