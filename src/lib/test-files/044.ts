import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: 'Queen', suit: 'Clubs' },
				{ rank: 'Queen', suit: 'Clubs', enhancement: 'Steel' },
			],
			jokers: [
				{ name: 'Mime' },
				{ name: 'Shoot the Moon' },
			],
		},
		expected: {
			hand: 'High Card',
			scoringCards: [
				{ rank: 'Queen', suit: 'Clubs' },
			],
			results: [
				{ chips: '15', multiplier: '34.75', score: '521.25', formattedScore: '521.3', luck: 'none' },
				{ chips: '15', multiplier: '34.75', score: '521.25', formattedScore: '521.3', luck: 'average' },
				{ chips: '15', multiplier: '34.75', score: '521.25', formattedScore: '521.3', luck: 'all' },
			],
		},
	}
}
