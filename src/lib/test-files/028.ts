import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			hands: 1,
			playedCards: [
				{ rank: 'King', suit: 'Hearts', enhancement: 'lucky' },
				{ rank: 'King', suit: 'Hearts', enhancement: 'lucky' },
				{ rank: 'Jack', suit: 'Hearts', enhancement: 'lucky' },
				{ rank: 'Ace', suit: 'Hearts', enhancement: 'lucky' },
				{ rank: '6', suit: 'Hearts', enhancement: 'lucky' },
			],
			jokers: [
				{ name: 'Sock and Buskin' },
				{ name: 'Dusk' },
				{ name: 'Lusty Joker' },
				{ name: 'Blueprint' },
				{ name: 'Bloodstone' },
			],
		},
		expected: {
			hand: 'Flush',
			scoringCards: [
				{ rank: 'King', suit: 'Hearts', enhancement: 'lucky' },
				{ rank: 'King', suit: 'Hearts', enhancement: 'lucky' },
				{ rank: 'Jack', suit: 'Hearts', enhancement: 'lucky' },
				{ rank: 'Ace', suit: 'Hearts', enhancement: 'lucky' },
				{ rank: '6', suit: 'Hearts', enhancement: 'lucky' },
			],
			scores: [
				{ score: 6_837, formattedScore: '6,837', luck: 'none' },
				{ score: 99_969_896, formattedScore: '99,969,896', luck: 'average' },
				{ score: 369_904_053_492, formattedScore: '369,904,053,492', luck: 'all' },
			],
		},
	}
}
