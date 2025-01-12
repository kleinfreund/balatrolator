import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: '7', suit: 'Spades', enhancement: 'wild' },
				{ played: true, rank: '7', suit: 'Spades', enhancement: 'wild' },
				{ played: true, rank: '7', suit: 'Spades', enhancement: 'wild' },
				{ played: true, rank: '7', suit: 'Spades', enhancement: 'wild' },
			],
			jokers: [
				{ name: 'Flower Pot' },
			],
		},
		expected: {
			hand: 'Four of a Kind',
			scoringCards: [
				{ rank: '7', suit: 'Spades', enhancement: 'wild' },
				{ rank: '7', suit: 'Spades', enhancement: 'wild' },
				{ rank: '7', suit: 'Spades', enhancement: 'wild' },
				{ rank: '7', suit: 'Spades', enhancement: 'wild' },
			],
			scores: [
				{ score: 1848, formattedScore: '1,848', luck: 'none' },
				{ score: 1848, formattedScore: '1,848', luck: 'average' },
				{ score: 1848, formattedScore: '1,848', luck: 'all' },
			],
		},
	}
}
