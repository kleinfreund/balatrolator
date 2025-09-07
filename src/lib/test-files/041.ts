import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: '2', suit: 'Hearts', seal: 'Red', count: 3 },
				{ played: true, rank: '3', suit: 'Hearts' },
				{ played: true, rank: '4', suit: 'Hearts' },
			],
			jokers: [
				{ name: 'Ancient Joker', suit: 'Diamonds' },
				{ name: 'Smeared Joker' },
			],
			handLevels: {
				'Flush': {
					level: 2,
					plays: 0,
				},
			},
		},
		expected: {
			hand: 'Flush',
			scoringCards: [
				{ rank: '2', suit: 'Hearts', seal: 'Red' },
				{ rank: '2', suit: 'Hearts', seal: 'Red' },
				{ rank: '2', suit: 'Hearts', seal: 'Red' },
				{ rank: '3', suit: 'Hearts' },
				{ rank: '4', suit: 'Hearts' },
			],
			scores: [
				{ score: '10610', formattedScore: '10,610', luck: 'none' },
				{ score: '10610', formattedScore: '10,610', luck: 'average' },
				{ score: '10610', formattedScore: '10,610', luck: 'all' },
			],
		},
	}
}
