import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			hands: 1,
			cards: [
				{ played: true, rank: 'King', suit: 'Hearts', enhancement: 'Lucky' },
				{ played: true, rank: 'King', suit: 'Hearts', enhancement: 'Lucky' },
				{ played: true, rank: 'Jack', suit: 'Hearts', enhancement: 'Lucky' },
				{ played: true, rank: 'Ace', suit: 'Hearts', enhancement: 'Lucky' },
				{ played: true, rank: '6', suit: 'Hearts', enhancement: 'Lucky' },
			],
			jokers: [
				{ name: 'Sock and Buskin' },
				{ name: 'Dusk' },
				{ name: 'Lusty Joker' },
				{ name: 'Blueprint' },
				{ name: 'Bloodstone' },
				{ name: 'Oops! All 6s' },
				{ name: 'Oops! All 6s' },
				{ name: 'Oops! All 6s' },
				{ name: 'Oops! All 6s' },
			],
		},
		expected: {
			hand: 'Flush',
			scoringCards: [
				{ rank: 'King', suit: 'Hearts', enhancement: 'Lucky' },
				{ rank: 'King', suit: 'Hearts', enhancement: 'Lucky' },
				{ rank: 'Jack', suit: 'Hearts', enhancement: 'Lucky' },
				{ rank: 'Ace', suit: 'Hearts', enhancement: 'Lucky' },
				{ rank: '6', suit: 'Hearts', enhancement: 'Lucky' },
			],
			results: [
				{ score: '369904053492', formattedScore: '369,904,053,492', luck: 'none' },
				{ score: '369904053492', formattedScore: '369,904,053,492', luck: 'average' },
				{ score: '369904053492', formattedScore: '369,904,053,492', luck: 'all' },
			],
		},
	}
}
