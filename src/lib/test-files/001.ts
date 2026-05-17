import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: 'King', suit: 'Hearts', enhancement: 'Steel' },
				{ played: true, rank: 'King', suit: 'Clubs' },
				{ played: true, rank: '7', suit: 'Clubs' },
				{ played: true, rank: '7', suit: 'Diamonds' },
				{ played: true, rank: '5', suit: 'Spades' },
				{ rank: '2', suit: 'Spades', enhancement: 'Glass' },
			],
		},
		expected: {
			hand: 'Two Pair',
			scoringCards: [
				{ rank: 'King', suit: 'Hearts', enhancement: 'Steel' },
				{ rank: 'King', suit: 'Clubs' },
				{ rank: '7', suit: 'Clubs' },
				{ rank: '7', suit: 'Diamonds' },
			],
			results: [
				{ chips: '54', multiplier: '2', score: '108', formattedScore: '108', luck: 'none' },
				{ chips: '54', multiplier: '2', score: '108', formattedScore: '108', luck: 'average' },
				{ chips: '54', multiplier: '2', score: '108', formattedScore: '108', luck: 'all' },
			],
		},
	}
}
