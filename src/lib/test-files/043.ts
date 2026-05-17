import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: 'King', suit: 'Clubs' },
				{ played: true, rank: 'King', suit: 'Clubs' },
				{ played: true, rank: '10', suit: 'Clubs' },
				{ played: true, rank: '10', suit: 'Hearts' },
			],
			jokers: [
				{ name: 'The Duo' },
				{ name: 'Spare Trousers', plusMultiplier: 36 },
				{ name: 'Four Fingers' },
				{ name: 'Square Joker', plusChips: 40 },
				{ name: 'Brainstorm' },
			],
			observatory: {
				'Two Pair': 2,
			},
			handLevels: {
				'Two Pair': {
					level: 7,
					plays: 0,
				},
			},
		},
		expected: {
			hand: 'Two Pair',
			scoringCards: [
				{ rank: 'King', suit: 'Clubs' },
				{ rank: 'King', suit: 'Clubs' },
				{ rank: '10', suit: 'Clubs' },
				{ rank: '10', suit: 'Hearts' },
			],
			results: [
				{ chips: '220', multiplier: '234', score: '51480', formattedScore: '51,480', luck: 'none' },
				{ chips: '220', multiplier: '234', score: '51480', formattedScore: '51,480', luck: 'average' },
				{ chips: '220', multiplier: '234', score: '51480', formattedScore: '51,480', luck: 'all' },
			],
		},
	}
}
