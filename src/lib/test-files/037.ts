import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: 'Queen', suit: 'Diamonds' },
			],
			jokers: [
				{ name: 'Loyalty Card', active: false },
			],
		},
		expected: {
			hand: 'High Card',
			scoringCards: [
				{ rank: 'Queen', suit: 'Diamonds' },
			],
			results: [
				{ chips: '15', multiplier: '1', score: '15', formattedScore: '15', luck: 'none' },
				{ chips: '15', multiplier: '1', score: '15', formattedScore: '15', luck: 'average' },
				{ chips: '15', multiplier: '1', score: '15', formattedScore: '15', luck: 'all' },
			],
		},
	}
}
