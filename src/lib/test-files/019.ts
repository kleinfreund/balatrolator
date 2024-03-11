import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			blind: { name: 'The Head' },
			playedCards: [
				{ rank: '8', suit: 'Spades' },
				{ rank: '7', suit: 'Spades' },
				{ rank: '7', suit: 'Hearts' },
				{ rank: '5', suit: 'Spades' },
				{ rank: '2', suit: 'Spades' },
			],
			jokers: [
				{ name: 'Blueprint' },
				{ name: 'Blueprint' },
				{ name: 'Sly Joker' },
			],
		},
		expected: {
			hand: 'Pair',
			scoringCards: [
				{ rank: '7', suit: 'Spades' },
				{ rank: '7', suit: 'Hearts', isDebuffed: true },
			],
			score: 334,
			formattedScore: '334',
		},
	}
}
