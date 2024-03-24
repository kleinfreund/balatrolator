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
				{ score: 8904, formattedScore: '8,904', luck: 'none' },
				{ score: 6275230, formattedScore: '6,275,230', luck: 'average' },
				{ score: 384131132448, formattedScore: '384,131,132,448', luck: 'all' },
			],
		},
	}
}
