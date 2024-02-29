import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		parameters: [{
			playedCards: [
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
				{ rank: 'Queen', suit: 'Diamonds' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'glass' },
			],
			heldCards: [
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
		}],
		expected: {
			hand: 'Flush Five',
			scoringCards: [
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
				{ rank: 'Queen', suit: 'Diamonds' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'glass' },
			],
			score: 354294,
			formattedScore: '354,294',
		},
	}
}
