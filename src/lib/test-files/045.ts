import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			observatory: {
				Flush: 30,
			},
			handLevels: {
				Flush: {
					level: 25,
					plays: 36,
				},
			},
			cards: [
				{ played: true, rank: 'Queen', suit: 'Spades', enhancement: 'Mult', seal: 'Red' },
				{ played: true, rank: 'Queen', suit: 'Spades', enhancement: 'Mult' },
				{ played: true, rank: 'King', suit: 'Spades', edition: 'Foil', enhancement: 'Mult' },
				{ played: true, rank: 'King', suit: 'Spades', enhancement: 'Wild' },
				{ played: true, rank: '10', suit: 'Spades', enhancement: 'Mult' },
			],
			jokers: [
				{ name: 'Wrathful Joker' },
				{ name: 'Hanging Chad', edition: 'Foil' },
				{ name: 'Blueprint' },
				{ name: 'Yorick', timesMultiplier: 23 },
				{ name: 'Triboulet' },
				{ name: 'Perkeo', edition: 'Polychrome' },
			],
		},
		expected: {
			hand: 'Flush',
			scoringCards: [
				{ rank: 'Queen', suit: 'Spades', enhancement: 'Mult', seal: 'Red' },
				{ rank: 'Queen', suit: 'Spades', enhancement: 'Mult' },
				{ rank: 'King', suit: 'Spades', edition: 'Foil', enhancement: 'Mult' },
				{ rank: 'King', suit: 'Spades', enhancement: 'Wild' },
				{ rank: '10', suit: 'Spades', enhancement: 'Mult' },
			],
			results: [
				{ chips: '575', multiplier: '1283118607572.40836674055', score: '737793199354134', formattedScore: '7.378e14', luck: 'none' },
				{ chips: '575', multiplier: '1283118607572.40836674055', score: '737793199354134', formattedScore: '7.378e14', luck: 'average' },
				{ chips: '575', multiplier: '1283118607572.40836674055', score: '737793199354134', formattedScore: '7.378e14', luck: 'all' },
			],
		},
	}
}
