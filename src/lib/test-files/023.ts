import type { TestCase } from '#lib/calculateScore.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			blind: { name: 'The Head' },
			cards: [
				{ played: true, rank: '7', suit: 'Spades' },
				{ played: true, rank: '7', suit: 'Spades', enhancement: 'wild' },
				{ played: true, rank: '7', suit: 'Hearts' },
				{ played: true, rank: '7', suit: 'Diamonds' },
				{ played: true, rank: '2', suit: 'Spades' },
			],
			jokers: [
				{ name: 'Flower Pot' },
			],
		},
		expected: {
			hand: 'Four of a Kind',
			scoringCards: [
				{ rank: '7', suit: 'Spades' },
				// This _should_ count as a Four of a Kind
				{ rank: '7', suit: 'Spades', enhancement: 'wild' },
				{ rank: '7', suit: 'Hearts', debuffed: true },
				{ rank: '7', suit: 'Diamonds' },
			],
			scores: [
				{ score: 1554, formattedScore: '1,554', luck: 'none' },
				{ score: 1554, formattedScore: '1,554', luck: 'average' },
				{ score: 1554, formattedScore: '1,554', luck: 'all' },
			],
		},
	}
}
