import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			playedCards: [
				{ rank: '5', suit: 'Clubs' },
				{ rank: '5', suit: 'Diamonds' },
				{ rank: '5', suit: 'Diamonds' },
				{ rank: '5', suit: 'Diamonds' },
				{ rank: '5', suit: 'Spades', seal: 'red' },
			],
			heldCards: [],
			jokers: [
				{ name: 'Sixth Sense' },
				{ name: 'Odd Todd' },
				{ name: 'Fortune Teller', plusMultiplier: 9 },
				{ name: 'Swashbuckler', edition: 'foil', plusMultiplier: 8 },
				{ name: 'Ceremonial Dagger', plusMultiplier: 6 },
			],
		},
		expected: {
			hand: 'Five of a Kind',
			scoringCards: [
				{ rank: '5', suit: 'Clubs' },
				{ rank: '5', suit: 'Diamonds' },
				{ rank: '5', suit: 'Diamonds' },
				{ rank: '5', suit: 'Diamonds' },
				{ rank: '5', suit: 'Spades', seal: 'red' },
			],
			scores: [
				{ score: 13300, formattedScore: '13,300', luck: 'none' },
				{ score: 13300, formattedScore: '13,300', luck: 'average' },
				{ score: 13300, formattedScore: '13,300', luck: 'all' },
			],
		},
	}
}
