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
			scores: [
				{ score: '75.9375', formattedScore: '75.9', luck: 'none' },
				{ score: '75.9375', formattedScore: '75.9', luck: 'average' },
				{ score: '75.9375', formattedScore: '75.9', luck: 'all' },
			],
		},
	}
}
