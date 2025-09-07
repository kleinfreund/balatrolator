import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: '5', suit: 'Hearts' },
				{ played: true, rank: '5', suit: 'Clubs' },
				{ played: true, rank: '5', suit: 'Clubs' },
				{ played: true, rank: '5', suit: 'Clubs' },
				{ played: true, rank: '5', suit: 'Spades', enhancement: 'Glass', seal: 'Red' },
			],
			jokers: [
				{ name: 'Sixth Sense' },
				{ name: 'Odd Todd' },
				{ name: 'Swashbuckler', edition: 'Foil', plusMultiplier: 5 },
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
				{ rank: '5', suit: 'Spades', enhancement: 'Glass', seal: 'Red' },
			],
			results: [
				{ score: '20458', formattedScore: '20,458', luck: 'none' },
				{ score: '20458', formattedScore: '20,458', luck: 'average' },
				{ score: '20458', formattedScore: '20,458', luck: 'all' },
			],
		},
	}
}
