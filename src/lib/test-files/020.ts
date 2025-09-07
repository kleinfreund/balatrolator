import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			blind: { name: 'The Head' },
			cards: [
				{ played: true, rank: '8', suit: 'Spades' },
				{ played: true, rank: '7', suit: 'Spades' },
				{ played: true, rank: '7', suit: 'Hearts' },
				{ played: true, rank: '5', suit: 'Spades' },
				{ played: true, rank: '2', suit: 'Spades' },
			],
			jokers: [
				{ name: 'Blueprint' },
				{ name: 'Blueprint' },
				{ name: 'Sly Joker' },
				{ name: 'Brainstorm' },
			],
		},
		expected: {
			hand: 'Pair',
			scoringCards: [
				{ rank: '7', suit: 'Spades' },
				{ rank: '7', suit: 'Hearts', debuffed: true },
			],
			results: [
				{ score: '434', formattedScore: '434', luck: 'none' },
				{ score: '434', formattedScore: '434', luck: 'average' },
				{ score: '434', formattedScore: '434', luck: 'all' },
			],
		},
	}
}
