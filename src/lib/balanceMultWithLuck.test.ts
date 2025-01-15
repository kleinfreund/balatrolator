import { describe, test, expect } from 'vitest'

import { balanceMultWithLuck } from './balanceMultWithLuck.js'

describe('balance', () => {
	test.each<[...Parameters<typeof balanceMultWithLuck>, number]>([
		[2, 0, 3, 'none', 'times', 1],
		[2, 1, 3, 'none', 'times', 1],
		[2, 2, 3, 'none', 'times', 2],
		[2, 3, 3, 'none', 'times', 2],
		[2, 0, 3, 'average', 'times', 1.3333333333333333],
		[2, 1, 3, 'average', 'times', 1.6666666666666665],
		[2, 2, 3, 'average', 'times', 2],
		[2, 3, 3, 'average', 'times', 2],
		[2, 4, 3, 'average', 'times', 2],
		[2, 0, 3, 'all', 'times', 2],
		[2, 1, 3, 'all', 'times', 2],
		[2, 2, 3, 'all', 'times', 2],
		[2, 3, 3, 'all', 'times', 2],
		[2, 4, 3, 'all', 'times', 2],

		[3, 0, 3, 'none', 'times', 1],
		[3, 1, 3, 'none', 'times', 1],
		[3, 2, 3, 'none', 'times', 3],
		[3, 3, 3, 'none', 'times', 3],
		[3, 0, 3, 'average', 'times', 1.6666666666666665],
		[3, 1, 3, 'average', 'times', 2.333333333333333],
		[3, 2, 3, 'average', 'times', 3],
		[3, 3, 3, 'average', 'times', 3],
		[3, 0, 3, 'all', 'times', 3],
		[3, 1, 3, 'all', 'times', 3],
		[3, 2, 3, 'all', 'times', 3],
		[3, 3, 3, 'all', 'times', 3],
		[3, 4, 3, 'all', 'times', 3],

		[4, 0, 3, 'none', 'times', 1],
		[4, 0, 3, 'average', 'times', 2],
		[4, 1, 3, 'average', 'times', 3],
		[4, 2, 3, 'average', 'times', 4],
		[4, 1, 3, 'all', 'times', 4],

		[5, 0, 4, 'none', 'plus', 0],
		[5, 0, 4, 'average', 'plus', 1.25],
		[5, 1, 4, 'average', 'plus', 2.5],
		[5, 2, 4, 'average', 'plus', 5],
		[5, 1, 4, 'all', 'plus', 5],

		[20, 0, 5, 'none', 'plus', 0],
		[20, 1, 5, 'none', 'plus', 0],
		[20, 2, 5, 'none', 'plus', 0],
		[20, 3, 5, 'none', 'plus', 20],
		[20, 4, 5, 'none', 'plus', 20],
		[20, 5, 5, 'none', 'plus', 20],
		[20, 0, 5, 'average', 'plus', 4],
		[20, 1, 5, 'average', 'plus', 8],
		[20, 2, 5, 'average', 'plus', 16],
		[20, 3, 5, 'average', 'plus', 20],
		[20, 0, 5, 'all', 'plus', 20],
		[20, 1, 5, 'all', 'plus', 20],
		[20, 2, 5, 'all', 'plus', 20],
		[20, 3, 5, 'all', 'plus', 20],
		[20, 4, 5, 'all', 'plus', 20],
		[20, 5, 5, 'all', 'plus', 20],
		[20, 6, 5, 'all', 'plus', 20],
	])('works (mult: %s, oopses: %s, p: 1/%s, luck: %s, mode: %s)', (mult, oopses, denominator, luck, mode, expectedResult) => {
		expect(balanceMultWithLuck(mult, oopses, denominator, luck, mode)).toBe(expectedResult)
	})
})
