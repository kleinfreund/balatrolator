import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			money: 16,
			playedCards: [
				{ rank: '10', suit: 'Spades' },
				{ rank: '10', suit: 'Clubs' },
				{ rank: '8', suit: 'Spades', enhancement: 'stone' },
				{ rank: '6', suit: 'Spades' },
				{ rank: '6', suit: 'Spades' },
			],
			heldCards: [],
			jokers: [
				{ name: 'Even Steven', plusChips: 1 },
				{ name: 'Bootstraps' },
				{ name: 'Joker' },
				{ name: 'Crazy Joker' },
				{ name: 'Splash' },
			],
		},
		expected: {
			hand: 'Two Pair',
			scoringCards: [
				{ rank: '10', suit: 'Spades' },
				{ rank: '10', suit: 'Clubs' },
				{ rank: '8', suit: 'Spades', enhancement: 'stone' },
				{ rank: '6', suit: 'Spades' },
				{ rank: '6', suit: 'Spades' },
			],
			scores: [
				{ score: 2856, formattedScore: '2,856', luck: 'none' },
				{ score: 2856, formattedScore: '2,856', luck: 'average' },
				{ score: 2856, formattedScore: '2,856', luck: 'all' },
			],
		},
	}
}
