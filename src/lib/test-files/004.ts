import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			playedCards: [
				{ rank: 'Ace', suit: 'Diamonds' },
				{ rank: '10', suit: 'Diamonds' },
				{ rank: '8', suit: 'Diamonds' },
				{ rank: '7', suit: 'Diamonds' },
				{ rank: '6', suit: 'Diamonds' },
			],
			heldCards: [
				{ rank: '3', suit: 'Spades', enhancement: 'steel' },
			],
			jokers: [
				{ name: 'Supernova' },
			],
		},
		expected: {
			hand: 'Flush',
			scoringCards: [
				{ rank: 'Ace', suit: 'Diamonds' },
				{ rank: '10', suit: 'Diamonds' },
				{ rank: '8', suit: 'Diamonds' },
				{ rank: '7', suit: 'Diamonds' },
				{ rank: '6', suit: 'Diamonds' },
			],
			scores: [
				{ score: 539, formattedScore: '539', luck: 'none' },
				{ score: 539, formattedScore: '539', luck: 'average' },
				{ score: 539, formattedScore: '539', luck: 'all' },
			],
		},
	}
}
