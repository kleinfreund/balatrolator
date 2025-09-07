import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: 'Ace', suit: 'Hearts' },
				{ played: false, rank: 'Ace', suit: 'Hearts' },
				{ played: true, rank: '10', suit: 'Hearts' },
				{ played: true, rank: '9', suit: 'Hearts' },
				{ played: true, rank: '8', suit: 'Hearts' },
				{ played: true, rank: '5', suit: 'Hearts' },
				{ played: false, rank: 'King', suit: 'Clubs', enhancement: 'Steel' },
				{ played: false, rank: 'King', suit: 'Clubs', enhancement: 'Steel' },
				{ played: false, rank: '10', suit: 'Clubs' },
			],
			jokers: [
				{ name: 'Mime' },
				{ name: 'Raised Fist' },
				{ name: 'Gros Michel' },
				{ name: 'Juggler' },
				{ name: 'Rocket' },
			],
			handLevels: {
				'Flush': {
					level: 5,
					plays: 0,
				},
			},
		},
		expected: {
			hand: 'Flush',
			scoringCards: [
				{ rank: 'Ace', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Hearts' },
				{ rank: '8', suit: 'Hearts' },
				{ rank: '5', suit: 'Hearts' },
			],
			scores: [
				{ score: '15973', formattedScore: '15,973', luck: 'none' },
				{ score: '15973', formattedScore: '15,973', luck: 'average' },
				{ score: '15973', formattedScore: '15,973', luck: 'all' },
			],
		},
	}
}
