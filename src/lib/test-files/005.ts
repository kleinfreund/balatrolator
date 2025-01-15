import type { TestCase } from '#lib/calculateScore.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			blind: { name: 'The Window' },
			cards: [
				{ played: true, rank: 'Queen', suit: 'Diamonds' },
				{ played: true, rank: '10', suit: 'Hearts' },
				{ played: true, rank: '8', suit: 'Spades' },
				{ rank: '7', suit: 'Hearts', enhancement: 'bonus' },
				{ rank: '4', suit: 'Spades', edition: 'holographic' },
				{ rank: '4', suit: 'Clubs' },
				{ rank: '2', suit: 'Spades', enhancement: 'steel' },
				{ rank: '2', suit: 'Hearts', enhancement: 'steel' },
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
			scores: [
				{ score: 16.25, formattedScore: '16', luck: 'none' },
				{ score: 16.25, formattedScore: '16', luck: 'average' },
				{ score: 16.25, formattedScore: '16', luck: 'all' },
			],
		},
	}
}
