import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			blind: { name: 'The Pillar' },
			playedCards: [
				{ rank: '8', suit: 'Spades' },
				{ rank: '7', suit: 'Spades', enhancement: 'lucky' },
				{ rank: '7', suit: 'Hearts', enhancement: 'lucky' },
				{ rank: '5', suit: 'Spades' },
				{ rank: '2', suit: 'Spades' },
			],
			jokers: [
				{ name: 'Blueprint' },
				{ name: 'Sly Joker' },
			],
		},
		expected: {
			hand: 'Pair',
			scoringCards: [
				{ rank: '7', suit: 'Spades', enhancement: 'lucky' },
				{ rank: '7', suit: 'Hearts', enhancement: 'lucky' },
			],
			scores: [
				{ score: 248, formattedScore: '248', luck: 'none' },
				{ score: 1240, formattedScore: '1,240', luck: 'average' },
				{ score: 5208, formattedScore: '5,208', luck: 'all' },
			],
		},
	}
}
