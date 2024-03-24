import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			money: 17,
			playedCards: [
				{ rank: 'King', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts', enhancement: 'glass' },
				{ rank: '6', suit: 'Hearts' },
				{ rank: '4', suit: 'Hearts' },
				{ rank: '2', suit: 'Hearts' },
			],
			heldCards: [
				{ rank: '5', suit: 'Diamonds', enhancement: 'steel' },
			],
			jokers: [
				{ name: 'Even Steven' },
				{ name: 'Bootstraps' },
				{ name: 'Joker' },
				{ name: 'Crazy Joker' },
				{ name: 'Splash' },
			],
		},
		expected: {
			hand: 'Flush',
			scoringCards: [
				{ rank: 'King', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts', enhancement: 'glass' },
				{ rank: '6', suit: 'Hearts' },
				{ rank: '4', suit: 'Hearts' },
				{ rank: '2', suit: 'Hearts' },
			],
			scores: [
				{ score: 3082, formattedScore: '3,082', luck: 'none' },
				{ score: 3082, formattedScore: '3,082', luck: 'average' },
				{ score: 3082, formattedScore: '3,082', luck: 'all' },
			],
		},
	}
}
