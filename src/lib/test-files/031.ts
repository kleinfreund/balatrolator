import type { TestCase } from '#lib/calculateScore.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: '7', suit: 'Spades', enhancement: 'wild' },
			],
			jokers: [
				{ name: 'Flower Pot' },
			],
		},
		expected: {
			hand: 'High Card',
			scoringCards: [
				{ rank: '7', suit: 'Spades', enhancement: 'wild' },
			],
			scores: [
				{ score: '12', formattedScore: '12', luck: 'none' },
				{ score: '12', formattedScore: '12', luck: 'average' },
				{ score: '12', formattedScore: '12', luck: 'all' },
			],
		},
	}
}
