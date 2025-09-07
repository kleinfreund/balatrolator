import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: '5', suit: 'Spades', enhancement: 'Mult', seal: 'Red', count: 3 },
				{ played: true, rank: '5', suit: 'Hearts', enhancement: 'Mult' },
				{ played: true, rank: '5', suit: 'Clubs', seal: 'Gold' },
			],
			jokers: [
				{ name: 'Sixth Sense' },
				{ name: 'Odd Todd' },
				{ name: 'Smiley Face' },
				{ name: 'Pareidolia', edition: 'Polychrome' },
				{ name: 'Swashbuckler', edition: 'Foil', plusMultiplier: 12 },
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
				{ rank: '5', suit: 'Spades', enhancement: 'Mult', seal: 'Red' },
				{ rank: '5', suit: 'Spades', enhancement: 'Mult', seal: 'Red' },
				{ rank: '5', suit: 'Spades', enhancement: 'Mult', seal: 'Red' },
				{ rank: '5', suit: 'Hearts', enhancement: 'Mult' },
				{ rank: '5', suit: 'Clubs', seal: 'Gold' },
			],
			results: [
				{ score: '67294', formattedScore: '67,294', luck: 'none' },
				{ score: '67294', formattedScore: '67,294', luck: 'average' },
				{ score: '67294', formattedScore: '67,294', luck: 'all' },
			],
		},
	}
}
