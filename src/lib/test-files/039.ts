import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: '9', suit: 'Clubs', count: 2 },
				{ played: true, rank: '7', suit: 'Clubs', count: 2 },
			],
			jokers: [
				{ name: 'Blueprint' },
				{ name: 'Spare Trousers', plusMultiplier: 52 },
				{ name: 'Castle', plusChips: 126 },
				{ name: 'Baseball Card' },
				{ name: 'Card Sharp' },
			],
			handLevels: {
				'Two Pair': { level: 8, plays: 0 },
			},
		},
		expected: {
			hand: 'Two Pair',
			scoringCards: [
				{ rank: '9', suit: 'Clubs' },
				{ rank: '9', suit: 'Clubs' },
				{ rank: '7', suit: 'Clubs' },
				{ rank: '7', suit: 'Clubs' },
			],
			scores: [
				{ score: '121277', formattedScore: '121,277', luck: 'none' },
				{ score: '121277', formattedScore: '121,277', luck: 'average' },
				{ score: '121277', formattedScore: '121,277', luck: 'all' },
			],
		},
	}
}
