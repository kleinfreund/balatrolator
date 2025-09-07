import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			money: 5,
			cards: [
				{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'Wild' },
				{ played: true, rank: 'Jack', suit: 'Clubs' },
				{ played: true, rank: '10', suit: 'Diamonds' },
				{ played: true, rank: '9', suit: 'Spades' },
				{ played: true, rank: '8', suit: 'Spades' },
				{ rank: '5', suit: 'Diamonds', enhancement: 'Steel' },
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
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'Wild' },
				{ rank: 'Jack', suit: 'Clubs' },
				{ rank: '10', suit: 'Diamonds' },
				{ rank: '9', suit: 'Spades' },
				{ rank: '8', suit: 'Spades' },
			],
			scores: [
				{ score: '2772', formattedScore: '2,772', luck: 'none' },
				{ score: '2772', formattedScore: '2,772', luck: 'average' },
				{ score: '2772', formattedScore: '2,772', luck: 'all' },
			],
		},
	}
}
