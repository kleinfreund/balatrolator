import type { TestCase } from '#lib/calculateScore.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			money: 1,
			cards: [
				{ played: true, rank: '6', suit: 'Hearts' },
				{ played: true, rank: '6', suit: 'Diamonds' },
				{ played: true, rank: '4', suit: 'Spades' },
				{ played: true, rank: '4', suit: 'Hearts' },
				{ played: true, rank: '4', suit: 'Clubs' },
			],
			jokers: [
				{ name: 'Sly Joker' },
				{ name: 'Even Steven' },
				{ name: 'Bootstraps' },
				{ name: 'Joker' },
				{ name: 'Superposition' },
			],
		},
		expected: {
			hand: 'Full House',
			scoringCards: [
				{ rank: '6', suit: 'Hearts' },
				{ rank: '6', suit: 'Diamonds' },
				{ rank: '4', suit: 'Spades' },
				{ rank: '4', suit: 'Hearts' },
				{ rank: '4', suit: 'Clubs' },
			],
			scores: [
				{ score: '3192', formattedScore: '3,192', luck: 'none' },
				{ score: '3192', formattedScore: '3,192', luck: 'average' },
				{ score: '3192', formattedScore: '3,192', luck: 'all' },
			],
		},
	}
}
