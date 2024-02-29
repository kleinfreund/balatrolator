import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		parameters: [{
			blind: 'The Flint',
			playedCards: [
				{ rank: 'King', suit: 'Diamonds', enhancement: 'gold' },
				{ rank: 'King', suit: 'Diamonds', enhancement: 'gold' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'glass' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
			],
			heldCards: [
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
		}],
		expected: {
			hand: 'Flush House',
			scoringCards: [
				{ rank: 'King', suit: 'Diamonds', enhancement: 'gold' },
				{ rank: 'King', suit: 'Diamonds', enhancement: 'gold' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'glass' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
			],
			score: 284173,
			formattedScore: '284,173',
		},
	}
}
