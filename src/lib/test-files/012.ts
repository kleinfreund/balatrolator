import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: '5', suit: 'Clubs' },
				{ played: true, rank: '5', suit: 'Diamonds' },
				{ played: true, rank: '5', suit: 'Diamonds' },
				{ played: true, rank: '5', suit: 'Diamonds' },
				{ played: true, rank: '5', suit: 'Spades', seal: 'Red' },
			],
			jokers: [
				{ name: 'Sixth Sense' },
				{ name: 'Odd Todd' },
				{ name: 'Fortune Teller', plusMultiplier: 9 },
				{ name: 'Swashbuckler', edition: 'Foil', plusMultiplier: 8 },
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
				{ rank: '5', suit: 'Spades', seal: 'Red' },
			],
			scores: [
				{ score: '13510', formattedScore: '13,510', luck: 'none' },
				{ score: '13510', formattedScore: '13,510', luck: 'average' },
				{ score: '13510', formattedScore: '13,510', luck: 'all' },
			],
		},
	}
}
