import type { TestCase } from '#lib/calculateScore.test.ts'

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
		},
		expected: {
			hand: 'Four of a Kind',
			scoringCards: [
				{ rank: '7', suit: 'Spades' },
				{ rank: '7', suit: 'Clubs' },
				{ rank: '7', suit: 'Hearts', debuffed: true },
				{ rank: '7', suit: 'Diamonds' },
			],
			results: [
				{ score: '567', formattedScore: '567', luck: 'none' },
				{ score: '567', formattedScore: '567', luck: 'average' },
				{ score: '567', formattedScore: '567', luck: 'all' },
			],
		},
	}
}
