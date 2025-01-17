import type { TestCase } from '#lib/calculateScore.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			blind: { name: 'Verdant Leaf', active: true },
			cards: [
				{ played: true, rank: '8', suit: 'Spades' },
				{ played: true, rank: '7', suit: 'Spades' },
				{ played: true, rank: '7', suit: 'Hearts' },
				{ played: true, rank: '5', suit: 'Spades' },
				{ played: true, rank: '2', suit: 'Spades' },
			],
			jokers: [
				{ name: 'Blueprint' },
				{ name: 'Sly Joker' },
			],
		},
		expected: {
			hand: 'Pair',
			scoringCards: [
				{ rank: '7', suit: 'Spades', debuffed: true },
				{ rank: '7', suit: 'Hearts', debuffed: true },
			],
			scores: [
				{ score: '220', formattedScore: '220', luck: 'none' },
				{ score: '220', formattedScore: '220', luck: 'average' },
				{ score: '220', formattedScore: '220', luck: 'all' },
			],
		},
	}
}
