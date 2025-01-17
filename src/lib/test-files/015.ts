import type { TestCase } from '#lib/calculateScore.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
				{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
				{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
				{ played: true, rank: 'Queen', suit: 'Diamonds' },
				{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'glass' },
				{ rank: 'King', suit: 'Hearts', enhancement: 'gold' },
				{ rank: 'King', suit: 'Diamonds', enhancement: 'gold' },
			],
			jokers: [
				{ name: 'Mime', edition: 'polychrome' },
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
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
				{ rank: 'Queen', suit: 'Diamonds' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'glass' },
			],
			scores: [
				{ score: '354294', formattedScore: '354,294', luck: 'none' },
				{ score: '354294', formattedScore: '354,294', luck: 'average' },
				{ score: '354294', formattedScore: '354,294', luck: 'all' },
			],
		},
	}
}
