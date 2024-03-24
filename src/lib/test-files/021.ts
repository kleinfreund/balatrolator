import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			blind: { name: 'The Head' },
			playedCards: [
				{ rank: '7', suit: 'Spades' },
				{ rank: '7', suit: 'Clubs' },
				{ rank: '7', suit: 'Hearts' },
				{ rank: '7', suit: 'Diamonds' },
				{ rank: '2', suit: 'Spades' },
			],
		},
		expected: {
			hand: 'Four of a Kind',
			scoringCards: [
				{ rank: '7', suit: 'Spades' },
				{ rank: '7', suit: 'Clubs' },
				{ rank: '7', suit: 'Hearts', isDebuffed: true },
				{ rank: '7', suit: 'Diamonds' },
			],
			scores: [
				{ score: 567, formattedScore: '567', luck: 'none' },
				{ score: 567, formattedScore: '567', luck: 'average' },
				{ score: 567, formattedScore: '567', luck: 'all' },
			],
		},
	}
}
