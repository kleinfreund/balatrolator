import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: 'Queen', suit: 'Diamonds' },
				{ rank: 'Queen', suit: 'Hearts', enhancement: 'Steel' },
			],
			jokers: [
				{ name: 'Sock and Buskin' },
				{ name: 'Seltzer' },
			],
		},
		expected: {
			hand: 'High Card',
			scoringCards: [
				{ rank: 'Queen', suit: 'Diamonds' },
			],
			results: [
				{ chips: '35', multiplier: '1.5', score: '52.5', formattedScore: '52.5', luck: 'none' },
				{ chips: '35', multiplier: '1.5', score: '52.5', formattedScore: '52.5', luck: 'average' },
				{ chips: '35', multiplier: '1.5', score: '52.5', formattedScore: '52.5', luck: 'all' },
			],
		},
	}
}
