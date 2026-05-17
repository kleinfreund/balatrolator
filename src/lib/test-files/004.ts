import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: 'Ace', suit: 'Diamonds' },
				{ played: true, rank: '10', suit: 'Diamonds' },
				{ played: true, rank: '8', suit: 'Diamonds' },
				{ played: true, rank: '7', suit: 'Diamonds' },
				{ played: true, rank: '6', suit: 'Diamonds' },
				{ rank: '3', suit: 'Spades', enhancement: 'Steel' },
			],
			jokers: [
				{ name: 'Supernova' },
			],
		},
		expected: {
			hand: 'Flush',
			scoringCards: [
				{ rank: 'Ace', suit: 'Diamonds' },
				{ rank: '10', suit: 'Diamonds' },
				{ rank: '8', suit: 'Diamonds' },
				{ rank: '7', suit: 'Diamonds' },
				{ rank: '6', suit: 'Diamonds' },
			],
			results: [
				{ chips: '77', multiplier: '7', score: '539', formattedScore: '539', luck: 'none' },
				{ chips: '77', multiplier: '7', score: '539', formattedScore: '539', luck: 'average' },
				{ chips: '77', multiplier: '7', score: '539', formattedScore: '539', luck: 'all' },
			],
		},
	}
}
