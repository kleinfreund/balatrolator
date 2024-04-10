import type { TestCase } from '#lib/balatro.test.js'

export default (message: string): TestCase => {
	return {
		message,
		initialState: {
			playedCards: [
				{ rank: 'Jack', suit: 'Hearts', edition: 'holographic', enhancement: 'lucky', seal: 'red' },
				{ rank: 'Jack', suit: 'Hearts', edition: 'holographic', enhancement: 'lucky', seal: 'red' },
				{ rank: 'Jack', suit: 'Hearts', edition: 'holographic', enhancement: 'lucky', seal: 'red' },
				{ rank: 'Jack', suit: 'Hearts', edition: 'holographic', enhancement: 'lucky', seal: 'red' },
				{ rank: 'Jack', suit: 'Hearts', edition: 'holographic', enhancement: 'lucky', seal: 'red' },
			],
			jokers: [
				{ name: 'Sock and Buskin' },
				{ name: 'Sock and Buskin' },
				{ name: 'Bloodstone' },
				{ name: 'Bloodstone' },
				{ name: 'Oops! All 6s' },
			],
			handLevels: {
				'Flush Five': {
					level: 11,
					plays: 0,
				},
			},
		},
		expected: {
			hand: 'Flush Five',
			scoringCards: [
				{ rank: 'Jack', suit: 'Hearts', edition: 'holographic', enhancement: 'lucky', seal: 'red' },
				{ rank: 'Jack', suit: 'Hearts', edition: 'holographic', enhancement: 'lucky', seal: 'red' },
				{ rank: 'Jack', suit: 'Hearts', edition: 'holographic', enhancement: 'lucky', seal: 'red' },
				{ rank: 'Jack', suit: 'Hearts', edition: 'holographic', enhancement: 'lucky', seal: 'red' },
				{ rank: 'Jack', suit: 'Hearts', edition: 'holographic', enhancement: 'lucky', seal: 'red' },
			],
			scores: [
				{ score: 56104413326638560, formattedScore: '5.610e16', luck: 'none' },
				{ score: 66190599992094560, formattedScore: '6.619e16', luck: 'average' },
				{ score: 81319879990278560, formattedScore: '8.132e16', luck: 'all' },
			],
		},
	}
}
