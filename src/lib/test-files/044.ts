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
				{ score: '521.25', formattedScore: '521.3', luck: 'none' },
				{ score: '521.25', formattedScore: '521.3', luck: 'average' },
				{ score: '521.25', formattedScore: '521.3', luck: 'all' },
			],
		},
	}
}
