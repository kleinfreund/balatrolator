import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			blind: { name: 'The Pillar' },
			cards: [
				{ played: true, rank: '8', suit: 'Spades' },
				{ played: true, rank: '7', suit: 'Spades', enhancement: 'Lucky' },
				{ played: true, rank: '7', suit: 'Hearts', enhancement: 'Lucky' },
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
				{ rank: '7', suit: 'Spades', enhancement: 'Lucky' },
				{ rank: '7', suit: 'Hearts', enhancement: 'Lucky' },
			],
			results: [
				{ score: '248', formattedScore: '248', luck: 'none' },
				{ score: '1240', formattedScore: '1,240', luck: 'average' },
				{ score: '5208', formattedScore: '5,208', luck: 'all' },
			],
		},
	}
}
