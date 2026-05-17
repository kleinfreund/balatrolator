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
				{ chips: '159', multiplier: '43', score: '6837', formattedScore: '6,837', luck: 'none' },
				{ chips: '159', multiplier: '628741.49052165448665618896484375', score: '99969896', formattedScore: '99,969,896', luck: 'average' },
				{ chips: '159', multiplier: '2326440588', score: '369904053492', formattedScore: '369,904,053,492', luck: 'all' },
			],
		},
	}
}
