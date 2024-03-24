import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			blind: { name: 'Verdant Leaf', isActive: true },
			playedCards: [
				{ rank: '8', suit: 'Spades' },
				{ rank: '7', suit: 'Spades' },
				{ rank: '7', suit: 'Hearts' },
				{ rank: '5', suit: 'Spades' },
				{ rank: '2', suit: 'Spades' },
			],
			jokers: [
				{ name: 'Blueprint' },
				{ name: 'Sly Joker' },
			],
		},
		expected: {
			hand: 'Pair',
			scoringCards: [
				{ rank: '7', suit: 'Spades', isDebuffed: true },
				{ rank: '7', suit: 'Hearts', isDebuffed: true },
			],
			scores: [
				{ score: 220, formattedScore: '220', luck: 'none' },
				{ score: 220, formattedScore: '220', luck: 'average' },
				{ score: 220, formattedScore: '220', luck: 'all' },
			],
		},
	}
}
