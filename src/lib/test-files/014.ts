import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			playedCards: [
				{ rank: '5', suit: 'Spades', enhancement: 'mult' },
				{ rank: '5', suit: 'Spades', enhancement: 'mult' },
				{ rank: '5', suit: 'Spades', enhancement: 'mult' },
				{ rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
				{ rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
			],
			heldCards: [],
			jokers: [
				{ name: 'Sixth Sense' },
				{ name: 'Smiley Face' },
				{ name: 'Pareidolia', edition: 'polychrome' },
				{ name: 'The Family' },
				{ name: 'Swashbuckler', edition: 'foil', plusMultiplier: 14 },
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
				{ rank: '5', suit: 'Spades', enhancement: 'mult' },
				{ rank: '5', suit: 'Spades', enhancement: 'mult' },
				{ rank: '5', suit: 'Spades', enhancement: 'mult' },
				{ rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
				{ rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
			],
			scores: [
				{ score: 119560, formattedScore: '119,560', luck: 'none' },
				{ score: 119560, formattedScore: '119,560', luck: 'average' },
				{ score: 119560, formattedScore: '119,560', luck: 'all' },
			],
		},
	}
}
