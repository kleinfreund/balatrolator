import type { TestCase } from '#lib/calculateScore.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			money: 17,
			cards: [
				{ played: true, rank: 'King', suit: 'Hearts' },
				{ played: true, rank: '10', suit: 'Hearts', enhancement: 'glass' },
				{ played: true, rank: '6', suit: 'Hearts' },
				{ played: true, rank: '4', suit: 'Hearts' },
				{ played: true, rank: '2', suit: 'Hearts' },
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
				{ score: '3082', formattedScore: '3,082', luck: 'none' },
				{ score: '3082', formattedScore: '3,082', luck: 'average' },
				{ score: '3082', formattedScore: '3,082', luck: 'all' },
			],
		},
	}
}
