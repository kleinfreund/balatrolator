import type { TestCase } from '#lib/calculateScore.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			blind: { name: 'The Flint' },
			cards: [
				{ played: true, rank: 'King', suit: 'Diamonds', enhancement: 'gold' },
				{ played: true, rank: 'King', suit: 'Diamonds', enhancement: 'gold' },
				{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
				{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'glass' },
				{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
				{ rank: 'King', suit: 'Diamonds', enhancement: 'gold' },
			],
			jokers: [
				{ name: 'Mime', edition: 'polychrome' },
				{ name: 'Castle', plusChips: 81 },
				{ name: 'Blueprint' },
				{ name: 'Baseball Card' },
				{ name: 'Baron' },
			],
			handLevels: {
				'Flush House': {
					level: 2,
					plays: 2,
				},
			},
		},
		expected: {
			hand: 'Flush House',
			scoringCards: [
				{ rank: 'King', suit: 'Diamonds', enhancement: 'gold' },
				{ rank: 'King', suit: 'Diamonds', enhancement: 'gold' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'glass' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
			],
			scores: [
				{ score: 284173, formattedScore: '284,173', luck: 'none' },
				{ score: 284173, formattedScore: '284,173', luck: 'average' },
				{ score: 284173, formattedScore: '284,173', luck: 'all' },
			],
		},
	}
}
