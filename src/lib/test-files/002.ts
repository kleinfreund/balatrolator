import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			playedCards: [
				{ rank: 'Ace', suit: 'Clubs' },
				{ rank: 'Ace', suit: 'Diamonds' },
				{ rank: '4', suit: 'Spades' },
				{ rank: '4', suit: 'Hearts', edition: 'holographic' },
			],
		},
		expected: {
			hand: 'Two Pair',
			scoringCards: [
				{ rank: 'Ace', suit: 'Clubs' },
				{ rank: 'Ace', suit: 'Diamonds' },
				{ rank: '4', suit: 'Spades' },
				{ rank: '4', suit: 'Hearts', edition: 'holographic' },
			],
			score: 600,
			formattedScore: '600',
		},
	}
}
