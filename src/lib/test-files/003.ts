import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: '7', suit: 'Hearts', enhancement: 'Bonus' },
				{ rank: '3', suit: 'Spades', enhancement: 'Steel' },
			],
			jokers: [
				{ name: 'Supernova' },
			],
			handLevels: {
				'High Card': {
					level: 1,
					plays: 1,
				},
			},
		},
		expected: {
			hand: 'High Card',
			scoringCards: [
				{ rank: '7', suit: 'Hearts', enhancement: 'Bonus' },
			],
			results: [
				{ chips: '42', multiplier: '3.5', score: '147', formattedScore: '147', luck: 'none' },
				{ chips: '42', multiplier: '3.5', score: '147', formattedScore: '147', luck: 'average' },
				{ chips: '42', multiplier: '3.5', score: '147', formattedScore: '147', luck: 'all' },
			],
		},
	}
}
