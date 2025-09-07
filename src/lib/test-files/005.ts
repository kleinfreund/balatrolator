import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			blind: { name: 'The Window' },
			cards: [
				{ played: true, rank: 'Queen', suit: 'Diamonds' },
				{ played: true, rank: '10', suit: 'Hearts' },
				{ played: true, rank: '8', suit: 'Spades' },
				{ rank: '7', suit: 'Hearts', enhancement: 'Bonus' },
				{ rank: '4', suit: 'Spades', edition: 'Holographic' },
				{ rank: '4', suit: 'Clubs' },
				{ rank: '2', suit: 'Spades', enhancement: 'Steel' },
				{ rank: '2', suit: 'Hearts', enhancement: 'Steel' },
			],
			jokers: [
				{ name: 'Supernova' },
			],
		},
		expected: {
			hand: 'High Card',
			scoringCards: [
				{ rank: 'Queen', suit: 'Diamonds', debuffed: true },
			],
			results: [
				{ score: '16.25', formattedScore: '16.3', luck: 'none' },
				{ score: '16.25', formattedScore: '16.3', luck: 'average' },
				{ score: '16.25', formattedScore: '16.3', luck: 'all' },
			],
		},
	}
}
