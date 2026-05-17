import type { TestCase } from '#lib/calculateScore.test.ts'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			deck: 'Plasma Deck',
			cards: [
				{ played: true, rank: 'King', suit: 'Hearts', enhancement: 'Glass', seal: 'Red' },
				{ rank: 'King', suit: 'Hearts', enhancement: 'Steel', seal: 'Red', count: 717 },
			],
			jokers: [
				{ name: 'Baron', edition: 'Polychrome' },
				{ name: 'Bloodstone' },
				{ name: 'Blueprint' },
				{ name: 'Brainstorm' },
				{ name: 'Brainstorm' },
				{ name: 'Brainstorm' },
				{ name: 'Blueprint' },
				{ name: 'Blueprint' },
				{ name: 'Blueprint' },
				{ name: 'Mime' },
			],
			handLevels: {
				'High Card': {
					level: 171,
					plays: 0,
				},
			},
		},
		expected: {
			hand: 'High Card',
			scoringCards: [
				{ played: true, rank: 'King', suit: 'Hearts', enhancement: 'Glass', seal: 'Red' },
			],
			results: [
				{ chips: '1725', multiplier: '1.89987971590499432998798267993930043189196873250771714260575666e+4548', score: '9.023857337268104913218459280216065826628171546625882008934341205e+9095', formattedScore: '9.024e9095', luck: 'none' },
				{ chips: '1725', multiplier: '4.274729360786237242472961029863425971756929648142363570862952485e+4548', score: '4.568327776991978112316845010609383324730511845479352767023010237e+9096', formattedScore: '4.568e9096', luck: 'average' },
				{ chips: '1725', multiplier: '7.599518863619977319951930719757201727567874930030868570423026499e+4548', score: '1.44381717396289678611495348483457053226050744746014112142949454e+9097', formattedScore: '1.444e9097', luck: 'all' },
			],
		},
	}
}
