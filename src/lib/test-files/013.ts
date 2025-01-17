import type { TestCase } from '#lib/calculateScore.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
				{ played: true, rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
				{ played: true, rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
				{ played: true, rank: '5', suit: 'Hearts', enhancement: 'mult' },
				{ played: true, rank: '5', suit: 'Clubs', seal: 'gold' },
			],
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
				{ score: '67294', formattedScore: '67,294', luck: 'none' },
				{ score: '67294', formattedScore: '67,294', luck: 'average' },
				{ score: '67294', formattedScore: '67,294', luck: 'all' },
			],
		},
	}
}
