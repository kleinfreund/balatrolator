import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			playedCards: [
				{ rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
				{ rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
				{ rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
				{ rank: '5', suit: 'Hearts', enhancement: 'mult' },
				{ rank: '5', suit: 'Clubs', seal: 'gold' },
			],
			heldCards: [],
			jokers: [
				{ name: 'Sixth Sense' },
				{ name: 'Odd Todd' },
				{ name: 'Smiley Face' },
				{ name: 'Pareidolia', edition: 'polychrome' },
				{ name: 'Swashbuckler', edition: 'foil', plusMultiplier: 12 },
			],
			handLevels: {
				'Five of a Kind': {
					level: 2,
					plays: 11,
				},
			},
		},
		expected: {
			hand: 'Five of a Kind',
			scoringCards: [
				{ rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
				{ rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
				{ rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
				{ rank: '5', suit: 'Hearts', enhancement: 'mult' },
				{ rank: '5', suit: 'Clubs', seal: 'gold' },
			],
			scores: [
				{ score: 60382, formattedScore: '60,382', luck: 'none' },
				{ score: 60382, formattedScore: '60,382', luck: 'average' },
				{ score: 60382, formattedScore: '60,382', luck: 'all' },
			],
		},
	}
}
