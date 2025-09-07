import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'Gold' },
				{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'Gold' },
				{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'Gold' },
				{ played: true, rank: 'Queen', suit: 'Diamonds' },
				{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'Glass' },
				{ rank: 'King', suit: 'Hearts', enhancement: 'Gold' },
				{ rank: 'King', suit: 'Diamonds', enhancement: 'Gold' },
			],
			jokers: [
				{ name: 'Mime', edition: 'Polychrome' },
				{ name: 'Castle', plusChips: 78 },
				{ name: 'Blueprint' },
				{ name: 'Baseball Card' },
				{ name: 'Baron' },
			],
			handLevels: {
				'Flush Five': {
					level: 1,
					plays: 0,
				},
			},
		},
		expected: {
			hand: 'Flush Five',
			scoringCards: [
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'Gold' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'Gold' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'Gold' },
				{ rank: 'Queen', suit: 'Diamonds' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'Glass' },
			],
			results: [
				{ score: '354294', formattedScore: '354,294', luck: 'none' },
				{ score: '354294', formattedScore: '354,294', luck: 'average' },
				{ score: '354294', formattedScore: '354,294', luck: 'all' },
			],
		},
	}
}
