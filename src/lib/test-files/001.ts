import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			playedCards: [
				{ rank: 'King', suit: 'Hearts', enhancement: 'steel' },
				{ rank: 'King', suit: 'Clubs' },
				{ rank: '7', suit: 'Clubs' },
				{ rank: '7', suit: 'Diamonds' },
				{ rank: '5', suit: 'Spades' },
			],
			heldCards: [
				{ rank: '2', suit: 'Spades', enhancement: 'glass' },
			],
		},
		expected: {
			hand: 'Two Pair',
			scoringCards: [
				{ rank: 'King', suit: 'Hearts', enhancement: 'steel' },
				{ rank: 'King', suit: 'Clubs' },
				{ rank: '7', suit: 'Clubs' },
				{ rank: '7', suit: 'Diamonds' },
			],
			score: 108,
			formattedScore: '108',
		},
	}
}
