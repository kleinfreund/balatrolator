import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			blind: { name: 'Big Blind' },
			cards: [
				{ played: true, rank: 'Ace', suit: 'Diamonds', seal: 'Red' },
				{ played: true, rank: 'Ace', suit: 'Diamonds', enhancement: 'Glass', seal: 'Red' },
				{ played: true, rank: 'Ace', suit: 'Diamonds', enhancement: 'Glass', seal: 'Red' },
				{ played: true, rank: 'Ace', suit: 'Diamonds', enhancement: 'Glass', seal: 'Red' },
				{ played: true, rank: 'Ace', suit: 'Diamonds', enhancement: 'Glass', seal: 'Red' },
				{ rank: 'Ace', suit: 'Diamonds', enhancement: 'Mult' },
				{ rank: 'Ace', suit: 'Diamonds', enhancement: 'Steel', seal: 'Red' },
				{ rank: 'Ace', suit: 'Diamonds', enhancement: 'Steel', seal: 'Red' },
				{ rank: 'Ace', suit: 'Diamonds', seal: 'Red' },
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
				{ rank: 'Ace', suit: 'Diamonds', seal: 'Red' },
				{ rank: 'Ace', suit: 'Diamonds', enhancement: 'Glass', seal: 'Red' },
				{ rank: 'Ace', suit: 'Diamonds', enhancement: 'Glass', seal: 'Red' },
				{ rank: 'Ace', suit: 'Diamonds', enhancement: 'Glass', seal: 'Red' },
				{ rank: 'Ace', suit: 'Diamonds', enhancement: 'Glass', seal: 'Red' },
			],
			results: [
				{ score: '12972158342922240', formattedScore: '1.297e16', luck: 'none' },
				{ score: '12972158342922240', formattedScore: '1.297e16', luck: 'average' },
				{ score: '12972158342922240', formattedScore: '1.297e16', luck: 'all' },
			],
		},
	}
}
