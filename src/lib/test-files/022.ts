import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		parameters: [{
			playedCards: [
				{ rank: '7', suit: 'Spades' },
				{ rank: '7', suit: 'Clubs' },
				{ rank: '7', suit: 'Hearts', isDebuffed: true },
				{ rank: '7', suit: 'Diamonds' },
				{ rank: '2', suit: 'Spades' },
			],
			jokers: [
				{ name: 'Flowerpot' },
			],
		}],
		expected: {
			hand: 'Four of a Kind',
			scoringCards: [
				{ rank: '7', suit: 'Spades' },
				{ rank: '7', suit: 'Clubs' },
				{ rank: '7', suit: 'Hearts', isDebuffed: true },
				{ rank: '7', suit: 'Diamonds' },
			],
			score: 1701,
			formattedScore: '1,701',
		},
	}
}
