import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			playedCards: [
				{ rank: '5', suit: 'Hearts' },
				{ rank: '5', suit: 'Clubs' },
				{ rank: '5', suit: 'Clubs' },
				{ rank: '5', suit: 'Clubs' },
				{ rank: '5', suit: 'Spades', enhancement: 'glass', seal: 'red' },
			],
			heldCards: [],
			jokers: [
				{ name: 'Sixth Sense' },
				{ name: 'Odd Todd' },
				{ name: 'Swashbuckler', edition: 'foil', plusMultiplier: 5 },
				{ name: 'Ceremonial Dagger', plusMultiplier: 0 },
			],
		},
		expected: {
			hand: 'Five of a Kind',
			scoringCards: [
				{ rank: '5', suit: 'Hearts' },
				{ rank: '5', suit: 'Clubs' },
				{ rank: '5', suit: 'Clubs' },
				{ rank: '5', suit: 'Clubs' },
				{ rank: '5', suit: 'Spades', enhancement: 'glass', seal: 'red' },
			],
			score: 20140,
			formattedScore: '20,140',
		},
	}
}
