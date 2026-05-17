import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: '10', suit: 'Clubs' },
			],
			observatory: {
				'High Card': 4,
			},
		},
		expected: {
			hand: 'High Card',
			scoringCards: [
				{ rank: '10', suit: 'Clubs' },
			],
			results: [
				{ chips: '15', multiplier: '5.0625', score: '75.9375', formattedScore: '75.9', luck: 'none' },
				{ chips: '15', multiplier: '5.0625', score: '75.9375', formattedScore: '75.9', luck: 'average' },
				{ chips: '15', multiplier: '5.0625', score: '75.9375', formattedScore: '75.9', luck: 'all' },
			],
		},
	}
}
