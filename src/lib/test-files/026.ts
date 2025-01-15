import type { TestCase } from '#lib/calculateScore.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			blind: { name: 'The Pillar' },
			cards: [
				{ played: true, rank: '8', suit: 'Spades' },
				{ played: true, rank: '7', suit: 'Spades' },
				{ played: true, rank: '7', suit: 'Hearts', debuffed: true },
				{ played: true, rank: '5', suit: 'Spades' },
				{ played: true, rank: '2', suit: 'Spades' },
			],
			jokers: [
				{ name: 'Blueprint' },
				{ name: 'Sly Joker' },
			],
		},
		expected: {
			hand: 'Pair',
			scoringCards: [
				{ rank: '7', suit: 'Spades' },
				{ rank: '7', suit: 'Hearts', debuffed: true },
			],
			scores: [
				{ score: 234, formattedScore: '234', luck: 'none' },
				{ score: 234, formattedScore: '234', luck: 'average' },
				{ score: 234, formattedScore: '234', luck: 'all' },
			],
		},
	}
}
