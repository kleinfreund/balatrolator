import type { TestCase } from '#lib/calculateScore.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			hands: 1,
			cards: [
				{ played: true, rank: 'King', suit: 'Hearts', enhancement: 'lucky' },
				{ played: true, rank: 'King', suit: 'Hearts', enhancement: 'lucky' },
				{ played: true, rank: 'Jack', suit: 'Hearts', enhancement: 'lucky' },
				{ played: true, rank: 'Ace', suit: 'Hearts', enhancement: 'lucky' },
				{ played: true, rank: '6', suit: 'Hearts', enhancement: 'lucky' },
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
				{ score: '6837', formattedScore: '6,837', luck: 'none' },
				{ score: '99969896', formattedScore: '99,969,896', luck: 'average' },
				{ score: '369904053492', formattedScore: '369,904,053,492', luck: 'all' },
			],
		},
	}
}
