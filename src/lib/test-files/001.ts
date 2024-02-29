import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		parameters: [{
			playedCards: [
				{ rank: 'King', suit: 'Hearts' },
				{ rank: 'King', suit: 'Clubs' },
				{ rank: '7', suit: 'Clubs' },
				{ rank: '7', suit: 'Diamonds' },
				{ rank: '5', suit: 'Spades' },
			],
		}],
		expected: {
			hand: 'Two Pair',
			scoringCards: [
				{ rank: 'King', suit: 'Hearts' },
				{ rank: 'King', suit: 'Clubs' },
				{ rank: '7', suit: 'Clubs' },
				{ rank: '7', suit: 'Diamonds' },
			],
			score: 108,
			formattedScore: '108',
		},
	}
}
