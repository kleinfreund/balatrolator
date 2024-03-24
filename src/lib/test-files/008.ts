import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			money: 5,
			playedCards: [
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'wild' },
				{ rank: 'Jack', suit: 'Clubs' },
				{ rank: '10', suit: 'Diamonds' },
				{ rank: '9', suit: 'Spades' },
				{ rank: '8', suit: 'Spades' },
			],
			heldCards: [
				{ rank: '5', suit: 'Diamonds', enhancement: 'steel' },
			],
			jokers: [
				{ name: 'Sly Joker' },
				{ name: 'Even Steven' },
				{ name: 'Bootstraps' },
				{ name: 'Joker' },
				{ name: 'Crazy Joker' },
			],
		},
		expected: {
			hand: 'Straight',
			scoringCards: [
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'wild' },
				{ rank: 'Jack', suit: 'Clubs' },
				{ rank: '10', suit: 'Diamonds' },
				{ rank: '9', suit: 'Spades' },
				{ rank: '8', suit: 'Spades' },
			],
			scores: [
				{ score: 2772, formattedScore: '2,772', luck: 'none' },
				{ score: 2772, formattedScore: '2,772', luck: 'average' },
				{ score: 2772, formattedScore: '2,772', luck: 'all' },
			],
		},
	}
}
