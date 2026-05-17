import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				{ played: true, rank: 'Queen', suit: 'Spades', enhancement: 'Mult', seal: 'Red' },
				{ played: true, rank: 'Queen', suit: 'Spades', enhancement: 'Mult' },
				{ played: true, rank: 'King', suit: 'Spades', edition: 'Foil', enhancement: 'Mult' },
				{ played: true, rank: 'King', suit: 'Spades', enhancement: 'Wild' },
				{ played: true, rank: '10', suit: 'Spades', enhancement: 'Mult' },
			],
			jokers: [
				{ name: 'Wrathful Joker' },
				{ name: 'Hanging Chad', edition: 'Foil' },
				{ name: 'Blueprint' },
				{ name: 'Yorick', timesMultiplier: 23 },
				{ name: 'Triboulet' },
				{ name: 'Perkeo' },
			],
		},
		expected: {
			hand: 'Flush',
			scoringCards: [
				{ rank: 'Queen', suit: 'Spades', enhancement: 'Mult', seal: 'Red' },
				{ rank: 'Queen', suit: 'Spades', enhancement: 'Mult' },
				{ rank: 'King', suit: 'Spades', edition: 'Foil', enhancement: 'Mult' },
				{ rank: 'King', suit: 'Spades', enhancement: 'Wild' },
				{ rank: '10', suit: 'Spades', enhancement: 'Mult' },
			],
			results: [
				{ chips: '215', multiplier: '1210881', score: '260339415', formattedScore: '260,339,415', luck: 'none' },
				{ chips: '215', multiplier: '1210881', score: '260339415', formattedScore: '260,339,415', luck: 'average' },
				{ chips: '215', multiplier: '1210881', score: '260339415', formattedScore: '260,339,415', luck: 'all' },
			],
		},
	}
}
