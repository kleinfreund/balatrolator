import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			blind: { name: 'Verdant Leaf', isActive: false },
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
				{ rank: '7', suit: 'Spades' },
				{ rank: '7', suit: 'Hearts' },
			],
			scores: [
				{ score: 248, formattedScore: '248', luck: 'none' },
				{ score: 248, formattedScore: '248', luck: 'average' },
				{ score: 248, formattedScore: '248', luck: 'all' },
			],
		},
	}
}
