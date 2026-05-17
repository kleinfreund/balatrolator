import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			cards: [
				// Putting a non-played card first as a regression test for an issue where Hanging Chad didn't always apply correctly to the first _scoring_ card.
				{ rank: '2', suit: 'Diamonds' },
				{ played: true, rank: 'King', suit: 'Hearts', edition: 'Polychrome', enhancement: 'Glass', seal: 'Red' },
				{ played: true, rank: 'King', suit: 'Hearts', edition: 'Polychrome', enhancement: 'Glass', seal: 'Red' },
				{ played: true, rank: 'King', suit: 'Hearts', edition: 'Polychrome', enhancement: 'Glass', seal: 'Red' },
				{ played: true, rank: 'King', suit: 'Hearts', edition: 'Polychrome', enhancement: 'Glass', seal: 'Red' },
				{ played: true, rank: 'King', suit: 'Hearts', edition: 'Polychrome', enhancement: 'Glass', seal: 'Red' },
			],
			jokers: [
				{ name: 'Sock and Buskin' },
				{ name: 'Mail-in Rebate', edition: 'Negative' },
				{ name: 'The Idol', edition: 'Negative', rank: 'King', suit: 'Hearts' },
				{ name: 'Blueprint', edition: 'Foil' },
				{ name: 'The Idol', edition: 'Polychrome', rank: 'King', suit: 'Hearts' },
				{ name: 'Brainstorm', edition: 'Foil' },
				{ name: 'Brainstorm' },
				{ name: 'Brainstorm', edition: 'Foil' },
				{ name: 'Hanging Chad', edition: 'Negative' },
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
				{ rank: 'King', suit: 'Hearts', edition: 'Polychrome', enhancement: 'Glass', seal: 'Red' },
				{ rank: 'King', suit: 'Hearts', edition: 'Polychrome', enhancement: 'Glass', seal: 'Red' },
				{ rank: 'King', suit: 'Hearts', edition: 'Polychrome', enhancement: 'Glass', seal: 'Red' },
				{ rank: 'King', suit: 'Hearts', edition: 'Polychrome', enhancement: 'Glass', seal: 'Red' },
				{ rank: 'King', suit: 'Hearts', edition: 'Polychrome', enhancement: 'Glass', seal: 'Red' },
			],
			results: [
				{ chips: '3680', multiplier: '4.3823198322373086135008921222312987426801319936e+46', score: '1.6126936982633295697683283009811179373062885736448e+50', formattedScore: '1.613e50', luck: 'none' },
				{ chips: '3680', multiplier: '4.3823198322373086135008921222312987426801319936e+46', score: '1.6126936982633295697683283009811179373062885736448e+50', formattedScore: '1.613e50', luck: 'average' },
				{ chips: '3680', multiplier: '4.3823198322373086135008921222312987426801319936e+46', score: '1.6126936982633295697683283009811179373062885736448e+50', formattedScore: '1.613e50', luck: 'all' },
			],
		},
	}
}
