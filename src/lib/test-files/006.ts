import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		parameters: [{
			playedCards: [
				{ rank: '8', suit: 'Spades' },
				{ rank: '7', suit: 'Spades' },
				{ rank: '7', suit: 'Hearts', isDebuffed: true },
				{ rank: '5', suit: 'Spades' },
				{ rank: '2', suit: 'Spades' },
			],
			jokers: [
				{ name: 'Sly Joker' },
			],
		}],
		expected: {
			hand: 'Pair',
			scoringCards: [
				{ rank: '7', suit: 'Spades' },
				{ rank: '7', suit: 'Hearts', isDebuffed: true },
			],
			score: 134,
			formattedScore: '134',
		},
	}
}
