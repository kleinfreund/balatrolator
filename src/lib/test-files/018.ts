import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		parameters: [{
			blind: 'Big Blind',
			deck: 'Plasma Deck',
			playedCards: [
				{ rank: 'Queen', suit: 'Hearts', enhancement: 'lucky' },
				{ rank: 'King', suit: 'Hearts', enhancement: 'mult' },
				{ rank: 'King', suit: 'Hearts', enhancement: 'mult' },
				{ rank: 'King', suit: 'Clubs', enhancement: 'mult' },
				{ rank: 'Queen', suit: 'Hearts', enhancement: 'mult' },
			],
			heldCards: [
				{ rank: 'King', suit: 'Diamonds', enhancement: 'steel' },
				{ rank: 'Queen', suit: 'Hearts', enhancement: 'bonus' },
				{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
			],
			jokers: [
				{ name: 'Sock and Buskin' },
				{ name: 'Sock and Buskin' },
				{ name: 'Triboulet', edition: 'negative' },
				{ name: 'Triboulet' },
				{ name: 'Blueprint' },
				{ name: 'Brainstorm' },
			],
			handLevels: {
				'Full House': {
					level: 3,
					plays: 0,
				},
			},
		}],
		expected: {
			hand: 'Full House',
			scoringCards: [
				{ rank: 'Queen', suit: 'Hearts', enhancement: 'lucky' },
				{ rank: 'King', suit: 'Hearts', enhancement: 'mult' },
				{ rank: 'King', suit: 'Hearts', enhancement: 'mult' },
				{ rank: 'King', suit: 'Clubs', enhancement: 'mult' },
				{ rank: 'Queen', suit: 'Hearts', enhancement: 'mult' },
			],
			score: 610_300_000_000_000_000_000_000_000_000_000,
			formattedScore: '6.103e32',
		},
	}
}
