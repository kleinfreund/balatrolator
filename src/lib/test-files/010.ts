import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			money: 16,
			cards: [
				{ played: true, rank: '10', suit: 'Spades' },
				{ played: true, rank: '10', suit: 'Clubs' },
				{ played: true, rank: '8', suit: 'Spades', enhancement: 'Stone' },
				{ played: true, rank: '6', suit: 'Spades' },
				{ played: true, rank: '6', suit: 'Spades' },
			],
			jokers: [
				{ name: 'Even Steven', plusChips: 1 },
				{ name: 'Bootstraps' },
				{ name: 'Joker' },
				{ name: 'Crazy Joker' },
				{ name: 'Splash' },
			],
		},
		expected: {
			hand: 'Two Pair',
			scoringCards: [
				{ rank: '10', suit: 'Spades' },
				{ rank: '10', suit: 'Clubs' },
				{ rank: '8', suit: 'Spades', enhancement: 'Stone' },
				{ rank: '6', suit: 'Spades' },
				{ rank: '6', suit: 'Spades' },
			],
			results: [
				{ score: '2856', formattedScore: '2,856', luck: 'none' },
				{ score: '2856', formattedScore: '2,856', luck: 'average' },
				{ score: '2856', formattedScore: '2,856', luck: 'all' },
			],
		},
	}
}
