import type { TestCase } from '#lib/calculateScore.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			blind: { name: 'Big Blind' },
			cards: [
				{ played: true, rank: 'Ace', suit: 'Diamonds', seal: 'red' },
				{ played: true, rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
				{ played: true, rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
				{ played: true, rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
				{ played: true, rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
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
			scores: [
				{ score: 12_972_158_342_922_240, formattedScore: '1.297e16', luck: 'none' },
				{ score: 12_972_158_342_922_240, formattedScore: '1.297e16', luck: 'average' },
				{ score: 12_972_158_342_922_240, formattedScore: '1.297e16', luck: 'all' },
			],
		},
	}
}
