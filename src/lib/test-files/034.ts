import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				// Putting a non-played card first as a regression test for an issue where Hanging Chad didn't always apply correctly to the first _scoring_ card.
				{ rank: '2', suit: 'Diamonds' },
				{ played: true, rank: 'King', suit: 'Hearts', edition: 'polychrome', enhancement: 'glass', seal: 'red' },
				{ played: true, rank: 'King', suit: 'Hearts', edition: 'polychrome', enhancement: 'glass', seal: 'red' },
				{ played: true, rank: 'King', suit: 'Hearts', edition: 'polychrome', enhancement: 'glass', seal: 'red' },
				{ played: true, rank: 'King', suit: 'Hearts', edition: 'polychrome', enhancement: 'glass', seal: 'red' },
				{ played: true, rank: 'King', suit: 'Hearts', edition: 'polychrome', enhancement: 'glass', seal: 'red' },
			],
			jokers: [
				{ name: 'Sock and Buskin' },
				{ name: 'Mail-in Rebate', edition: 'negative' },
				{ name: 'The Idol', edition: 'negative', rank: 'King', suit: 'Hearts' },
				{ name: 'Blueprint', edition: 'foil' },
				{ name: 'The Idol', edition: 'polychrome', rank: 'King', suit: 'Hearts' },
				{ name: 'Brainstorm', edition: 'foil' },
				{ name: 'Brainstorm' },
				{ name: 'Brainstorm', edition: 'foil' },
				{ name: 'Hanging Chad', edition: 'negative' },
			],
			handLevels: {
				'Flush Five': {
					level: 62,
					plays: 0,
				},
			},
		},
		expected: {
			hand: 'Flush Five',
			scoringCards: [
				{ rank: 'King', suit: 'Hearts', edition: 'polychrome', enhancement: 'glass', seal: 'red' },
				{ rank: 'King', suit: 'Hearts', edition: 'polychrome', enhancement: 'glass', seal: 'red' },
				{ rank: 'King', suit: 'Hearts', edition: 'polychrome', enhancement: 'glass', seal: 'red' },
				{ rank: 'King', suit: 'Hearts', edition: 'polychrome', enhancement: 'glass', seal: 'red' },
				{ rank: 'King', suit: 'Hearts', edition: 'polychrome', enhancement: 'glass', seal: 'red' },
			],
			scores: [
				{ score: 1.6126936982633296e+50, formattedScore: '1.613e50', luck: 'none' },
				{ score: 1.6126936982633296e+50, formattedScore: '1.613e50', luck: 'average' },
				{ score: 1.6126936982633296e+50, formattedScore: '1.613e50', luck: 'all' },
			],
		},
	}
}
