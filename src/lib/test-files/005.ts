import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		parameters: [{
			blind: { name: 'The Window' },
			playedCards: [
				{ rank: 'Queen', suit: 'Diamonds' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '8', suit: 'Spades' },
			],
			heldCards: [
				{ rank: '7', suit: 'Hearts', enhancement: 'bonus' },
				{ rank: '4', suit: 'Spades', edition: 'holographic' },
				{ rank: '4', suit: 'Clubs' },
				{ rank: '2', suit: 'Spades', enhancement: 'steel' },
				{ rank: '2', suit: 'Hearts', enhancement: 'steel' },
			],
			jokers: [
				{ name: 'Supernova' },
			],
		}],
		expected: {
			hand: 'High Card',
			scoringCards: [
				{ rank: 'Queen', suit: 'Diamonds', isDebuffed: true },
			],
			score: 16.25,
			formattedScore: '16',
		},
	}
}
