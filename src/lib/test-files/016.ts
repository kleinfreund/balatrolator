import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			blind: { name: 'The Flint' },
			cards: [
				{ played: true, rank: 'King', suit: 'Diamonds', enhancement: 'Gold' },
				{ played: true, rank: 'King', suit: 'Diamonds', enhancement: 'Gold' },
				{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'Gold' },
				{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'Glass' },
				{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'Glass', seal: 'Red' },
				{ rank: 'King', suit: 'Diamonds', enhancement: 'Gold' },
			],
			jokers: [
				{ name: 'Mime', edition: 'Polychrome' },
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
				{ rank: 'King', suit: 'Diamonds', enhancement: 'Gold' },
				{ rank: 'King', suit: 'Diamonds', enhancement: 'Gold' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'Gold' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'Glass' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'Glass', seal: 'Red' },
			],
			scores: [
				{ score: '284173', formattedScore: '284,173', luck: 'none' },
				{ score: '284173', formattedScore: '284,173', luck: 'average' },
				{ score: '284173', formattedScore: '284,173', luck: 'all' },
			],
		},
	}
}
