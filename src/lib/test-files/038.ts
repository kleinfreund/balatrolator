import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: 'Jack', suit: 'Spades' },
			],
			jokers: [
				{ name: 'Abstract Joker' },
			],
		},
		expected: {
			hand: 'High Card',
			scoringCards: [
				{ rank: 'Jack', suit: 'Spades' },
			],
			results: [
				{ score: '60', formattedScore: '60', luck: 'none' },
				{ score: '60', formattedScore: '60', luck: 'average' },
				{ score: '60', formattedScore: '60', luck: 'all' },
			],
		},
	}
}
