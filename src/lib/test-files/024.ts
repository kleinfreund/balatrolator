import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			blind: { name: 'Verdant Leaf', active: false },
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
				{ rank: '7', suit: 'Spades' },
				{ rank: '7', suit: 'Hearts' },
			],
			results: [
				{ chips: '124', multiplier: '2', score: '248', formattedScore: '248', luck: 'none' },
				{ chips: '124', multiplier: '2', score: '248', formattedScore: '248', luck: 'average' },
				{ chips: '124', multiplier: '2', score: '248', formattedScore: '248', luck: 'all' },
			],
		},
	}
}
