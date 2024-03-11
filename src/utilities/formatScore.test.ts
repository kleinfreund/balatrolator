import { describe, test, expect } from 'vitest'

import { formatScore } from './formatScore.js'

describe('formatScore', () => {
	test.each([
		[1, '1'],
		[1.5, '2'],
		[1.49, '1'],
		[1.44, '1'],
		[123_456_789, '123,456,789'],
		[47_123_456_789, '47,123,456,789'],
		[29_000_000_000_000, '2.900e13'],
		[77_000_000_000_000_000, '7.700e16'],
		[860_000_000_000_000_000_000, '8.600e20'],
	])('works', (score, formattedScore) => {
		expect(formatScore(score)).toBe(formattedScore)
	})
})
