import type { TestCase } from '#lib/calculateScore.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: '7', suit: 'Hearts', enhancement: 'bonus' },
				{ rank: '3', suit: 'Spades', enhancement: 'steel' },
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
				{ rank: '7', suit: 'Hearts', enhancement: 'bonus' },
			],
			scores: [
				{ score: '147', formattedScore: '147', luck: 'none' },
				{ score: '147', formattedScore: '147', luck: 'average' },
				{ score: '147', formattedScore: '147', luck: 'all' },
			],
		},
	}
}
