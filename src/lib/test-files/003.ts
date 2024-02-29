import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		parameters: [{
			playedCards: [
				{ rank: '7', suit: 'Hearts', enhancement: 'bonus' },
			],
			heldCards: [
				{ rank: '3', suit: 'Spades', enhancement: 'steel' },
			],
			jokers: [
				{ name: 'Supernova' },
			],
			handLevels: {
				'High Card': {
					level: 1,
					plays: 1,
				},
			},
		}],
		expected: {
			hand: 'High Card',
			scoringCards: [
				{ rank: '7', suit: 'Hearts', enhancement: 'bonus' },
			],
			score: 147,
			formattedScore: '147',
		},
	}
}
