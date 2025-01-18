import { describe, test, expect } from 'vitest'

import { formatScore } from './formatScore.ts'

describe('formatScore', () => {
	test.each([
		['1', '1'],
		['1.44', '1'],
		['1.49', '1'],
		['1.5', '2'],
		['1000', '1,000'],
		['123456789', '123,456,789'],
		['47123456789', '47,123,456,789'],
		['999999999999', '999,999,999,999'],
		['1000000000000', '1.000e12'],
		['29000000000000', '2.900e13'],
		['77000000000000000', '7.700e16'],
		['81319879990278560', '8.132e16'],
		['860000000000000000000', '8.600e20'],
		['854450000000000000000', '8.545e20'],
		['1.6126936982633295697683283009811179373062885736448e+50', '1.613e50'],
	])('formatScore(\'%s\') = \'%s\'', (score, formattedScore) => {
		expect(formatScore(score)).toBe(formattedScore)
	})
})
