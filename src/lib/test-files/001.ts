import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: 'King', suit: 'Hearts', enhancement: 'steel' },
				{ played: true, rank: 'King', suit: 'Clubs' },
				{ played: true, rank: '7', suit: 'Clubs' },
				{ played: true, rank: '7', suit: 'Diamonds' },
				{ played: true, rank: '5', suit: 'Spades' },
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
			scores: [
				{ score: 108, formattedScore: '108', luck: 'none' },
				{ score: 108, formattedScore: '108', luck: 'average' },
				{ score: 108, formattedScore: '108', luck: 'all' },
			],
		},
	}
}
