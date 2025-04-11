import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: 'Queen', suit: 'Diamonds' },
				{ rank: 'Queen', suit: 'Hearts', enhancement: 'steel' },
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
			scores: [
				{ score: '52.5', formattedScore: '52.5', luck: 'none' },
				{ score: '52.5', formattedScore: '52.5', luck: 'average' },
				{ score: '52.5', formattedScore: '52.5', luck: 'all' },
			],
		},
	}
}
