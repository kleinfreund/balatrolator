import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			blind: { name: 'Big Blind' },
			playedCards: [
				{ rank: 'Ace', suit: 'Diamonds', seal: 'red' },
				{ rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
				{ rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
				{ rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
				{ rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
			],
			heldCards: [
				{ rank: 'Ace', suit: 'Diamonds', enhancement: 'mult' },
				{ rank: 'Ace', suit: 'Diamonds', enhancement: 'steel', seal: 'red' },
				{ rank: 'Ace', suit: 'Diamonds', enhancement: 'steel', seal: 'red' },
				{ rank: 'Ace', suit: 'Diamonds', seal: 'red' },
			],
			jokers: [
				{ name: 'DNA' },
				{ name: 'Blueprint' },
				{ name: 'The Idol', rank: 'Ace', suit: 'Diamonds' },
				{ name: 'Hologram', timesMultiplier: 12.25 },
				{ name: 'The Family' },
				{ name: 'Glass Joker', timesMultiplier: 5.5 },
			],
			handLevels: {
				'Flush Five': {
					level: 11,
					plays: 0,
				},
			},
		},
		expected: {
			hand: 'Flush Five',
			scoringCards: [
				{ rank: 'Ace', suit: 'Diamonds', seal: 'red' },
				{ rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
				{ rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
				{ rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
				{ rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
			],
			score: 11_287_462_454_231_040,
			formattedScore: '1.129e16',
		},
	}
}
