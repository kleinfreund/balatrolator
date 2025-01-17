import { describe, expect, test } from 'vitest'

import { resolveJoker } from './resolveJokers.js'

describe('resolveJoker', () => {
	test.each([
		[
			[
				{ index: 0, name: 'Blueprint' },
				{ index: 1, name: 'Sock and Buskin' },
			],
			{ index: 0, name: 'Blueprint' },
			{ index: 1, name: 'Sock and Buskin' },
		],
		[
			[
				{ index: 0, name: 'Sock and Buskin' },
				{ index: 1, name: 'Blueprint' },
				{ index: 2, name: 'Brainstorm' },
				{ index: 3, name: 'Brainstorm' },
				{ index: 4, name: 'Brainstorm' },
			],
			{ index: 0, name: 'Sock and Buskin' },
			{ index: 0, name: 'Sock and Buskin' },
		],
		[
			[
				{ index: 0, name: 'Sock and Buskin' },
				{ index: 1, name: 'Blueprint' },
				{ index: 2, name: 'Brainstorm' },
				{ index: 3, name: 'Brainstorm' },
				{ index: 4, name: 'Brainstorm' },
			],
			{ index: 1, name: 'Blueprint' },
			{ index: 0, name: 'Sock and Buskin' },
		],
		[
			[
				{ index: 0, name: 'Sock and Buskin' },
				{ index: 1, name: 'Blueprint' },
				{ index: 2, name: 'Brainstorm' },
				{ index: 3, name: 'Brainstorm' },
				{ index: 4, name: 'Brainstorm' },
			],
			{ index: 3, name: 'Brainstorm' },
			{ index: 0, name: 'Sock and Buskin' },
		],
		[
			[
				{ index: 0, name: 'Blueprint' },
				{ index: 1, name: 'Brainstorm' },
			],
			{ index: 0, name: 'Blueprint' },
			undefined,
		],
		[
			[
				{ index: 0, name: 'Blueprint' },
				{ index: 1, name: 'Brainstorm' },
			],
			{ index: 1, name: 'Brainstorm' },
			undefined,
		],
		[
			[
				{ index: 0, name: 'Blueprint' },
				{ index: 1, name: 'Blueprint' },
				{ index: 2, name: 'Brainstorm' },
			],
			{ index: 0, name: 'Blueprint' },
			undefined,
		],
		[
			[
				{ index: 0, name: 'Baron' },
				{ index: 1, name: 'Blueprint' },
				{ index: 2, name: 'Blueprint' },
				{ index: 3, name: 'Blueprint' },
				{ index: 4, name: 'Mime' },
				{ index: 5, name: 'Blueprint' },
				{ index: 6, name: 'Brainstorm' },
				{ index: 7, name: 'Brainstorm' },
				{ index: 8, name: 'Brainstorm' },
			],
			{ index: 1, name: 'Blueprint' },
			{ index: 4, name: 'Mime' },
		],
		[
			[
				{ index: 0, name: 'Baron' },
				{ index: 1, name: 'Blueprint' },
				{ index: 2, name: 'Blueprint' },
				{ index: 3, name: 'Blueprint' },
				{ index: 4, name: 'Mime' },
				{ index: 5, name: 'Blueprint' },
				{ index: 6, name: 'Brainstorm' },
				{ index: 7, name: 'Brainstorm' },
				{ index: 8, name: 'Brainstorm' },
			],
			{ index: 5, name: 'Blueprint' },
			{ index: 0, name: 'Baron' },
		],
		[
			[
				{ index: 0, name: 'Baron' },
				{ index: 1, name: 'Blueprint' },
				{ index: 2, name: 'Blueprint' },
				{ index: 3, name: 'Blueprint' },
				{ index: 4, name: 'Mime' },
				{ index: 5, name: 'Blueprint' },
				{ index: 6, name: 'Brainstorm' },
				{ index: 7, name: 'Brainstorm' },
				{ index: 8, name: 'Brainstorm' },
			],
			{ index: 7, name: 'Brainstorm' },
			{ index: 0, name: 'Baron' },
		],
	])('works', (jokers, target, expectedJoker) => {
		expect(resolveJoker(jokers, target)).toEqual(expectedJoker)
	})
})
