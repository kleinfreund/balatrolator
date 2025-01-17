import type { TestCase } from '#lib/calculateScore.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			blind: { name: 'The Head' },
			cards: [
				{ played: true, rank: '7', suit: 'Spades' },
				{ played: true, rank: '7', suit: 'Clubs' },
				{ played: true, rank: '7', suit: 'Hearts' },
				{ played: true, rank: '7', suit: 'Diamonds' },
				{ played: true, rank: '2', suit: 'Spades' },
			],
			jokers: [
				{ name: 'Flower Pot' },
			],
		},
		expected: {
			hand: 'Four of a Kind',
			scoringCards: [
				{ rank: '7', suit: 'Spades' },
				{ rank: '7', suit: 'Clubs' },
				{ rank: '7', suit: 'Hearts', debuffed: true },
				{ rank: '7', suit: 'Diamonds' },
			],
			scores: [
				{ score: '1701', formattedScore: '1,701', luck: 'none' },
				{ score: '1701', formattedScore: '1,701', luck: 'average' },
				{ score: '1701', formattedScore: '1,701', luck: 'all' },
			],
		},
	}
}
