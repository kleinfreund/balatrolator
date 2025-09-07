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
			scores: [
				{ score: '1848', formattedScore: '1,848', luck: 'none' },
				{ score: '1848', formattedScore: '1,848', luck: 'average' },
				{ score: '1848', formattedScore: '1,848', luck: 'all' },
			],
		},
	}
}
