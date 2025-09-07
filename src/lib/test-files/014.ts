import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: '5', suit: 'Spades', enhancement: 'Mult' },
				{ played: true, rank: '5', suit: 'Spades', enhancement: 'Mult' },
				{ played: true, rank: '5', suit: 'Spades', enhancement: 'Mult' },
				{ played: true, rank: '5', suit: 'Spades', enhancement: 'Mult', seal: 'Red' },
				{ played: true, rank: '5', suit: 'Spades', enhancement: 'Mult', seal: 'Red' },
			],
			jokers: [
				{ name: 'Sixth Sense' },
				{ name: 'Smiley Face' },
				{ name: 'Pareidolia', edition: 'Polychrome' },
				{ name: 'The Family' },
				{ name: 'Swashbuckler', edition: 'Foil', plusMultiplier: 14 },
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
				{ rank: '5', suit: 'Spades', enhancement: 'Mult' },
				{ rank: '5', suit: 'Spades', enhancement: 'Mult' },
				{ rank: '5', suit: 'Spades', enhancement: 'Mult' },
				{ rank: '5', suit: 'Spades', enhancement: 'Mult', seal: 'Red' },
				{ rank: '5', suit: 'Spades', enhancement: 'Mult', seal: 'Red' },
			],
			results: [
				{ score: '119560', formattedScore: '119,560', luck: 'none' },
				{ score: '119560', formattedScore: '119,560', luck: 'average' },
				{ score: '119560', formattedScore: '119,560', luck: 'all' },
			],
		},
	}
}
