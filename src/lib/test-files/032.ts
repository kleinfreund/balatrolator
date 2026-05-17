import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: '7', suit: 'Spades', enhancement: 'Wild' },
				{ played: true, rank: '7', suit: 'Spades', enhancement: 'Wild' },
				{ played: true, rank: '7', suit: 'Spades', enhancement: 'Wild' },
				{ played: true, rank: '7', suit: 'Spades', enhancement: 'Wild' },
			],
			jokers: [
				{ name: 'Flower Pot' },
			],
		},
		expected: {
			hand: 'Four of a Kind',
			scoringCards: [
				{ rank: '7', suit: 'Spades', enhancement: 'Wild' },
				{ rank: '7', suit: 'Spades', enhancement: 'Wild' },
				{ rank: '7', suit: 'Spades', enhancement: 'Wild' },
				{ rank: '7', suit: 'Spades', enhancement: 'Wild' },
			],
			results: [
				{ chips: '88', multiplier: '21', score: '1848', formattedScore: '1,848', luck: 'none' },
				{ chips: '88', multiplier: '21', score: '1848', formattedScore: '1,848', luck: 'average' },
				{ chips: '88', multiplier: '21', score: '1848', formattedScore: '1,848', luck: 'all' },
			],
		},
	}
}
