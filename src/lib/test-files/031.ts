import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: '7', suit: 'Spades', enhancement: 'Wild' },
			],
			jokers: [
				{ name: 'Flower Pot' },
			],
		},
		expected: {
			hand: 'High Card',
			scoringCards: [
				{ rank: '7', suit: 'Spades', enhancement: 'Wild' },
			],
			results: [
				{ score: '12', formattedScore: '12', luck: 'none' },
				{ score: '12', formattedScore: '12', luck: 'average' },
				{ score: '12', formattedScore: '12', luck: 'all' },
			],
		},
	}
}
