import { describe, test, expect } from 'vitest'

import { calculateScore } from './calculateScore.js'
import { getState } from './getState.js'
import type { Card, InitialState } from './types.js'

export interface TestCase {
	message: string
	initialState: InitialState
	expected: Omit<ReturnType<typeof calculateScore>, 'scoringCards'> & {
		scoringCards: Partial<Card>[]
	}
}

describe('calculateScore', async () => {
	test.each<TestCase>([
		(await import('./test-files/001.js')).default('Two pair'),
		(await import('./test-files/002.js')).default('Two pair, enhancements'),
		(await import('./test-files/003.js')).default('Bonus High Card, Held steel, Supernova'),
		(await import('./test-files/004.js')).default('Flush, Held steel, Supernova'),
		(await import('./test-files/005.js')).default('Debuffed High Card, 2x held steel'),
		(await import('./test-files/006.js')).default('Pair, Sly Joker'),
		(await import('./test-files/007.js')).default('Full House, Sly Joker, Even Steven, Bootstraps, Joker, Superposition'),
		(await import('./test-files/008.js')).default('Straight, Sly Joker, Even Steven, Bootstraps, Joker, Crazy Joker'),
		(await import('./test-files/009.js')).default('Flush, glass, steel'),
		(await import('./test-files/010.js')).default('Two pair, stone'),
		(await import('./test-files/011.js')).default('Five of a Kind 1'),
		(await import('./test-files/012.js')).default('Five of a Kind 2'),
		(await import('./test-files/013.js')).default('Five of a Kind 3'),
		(await import('./test-files/014.js')).default('Flush Five 1'),
		(await import('./test-files/015.js')).default('Flush Five 2'),
		(await import('./test-files/016.js')).default('Flush Five 3'),
		(await import('./test-files/017.js')).default('Flush Five (played by haelian on 2024-02-26 18:13 UTC)'),
		(await import('./test-files/018.js')).default('Pair, 1x Blueprint, Sly Joker'),
		(await import('./test-files/019.js')).default('Pair, 2x Blueprint, Sly Joker'),
		(await import('./test-files/020.js')).default('Pair, 2x Blueprint, Sly Joker, Brainstorm'),
		(await import('./test-files/021.js')).default('Four of a Kind'),
		(await import('./test-files/022.js')).default('Four of a Kind, Flower Pot'),
		(await import('./test-files/023.js')).default('Four of a Kind, Flower Pot, Wild card'),
		(await import('./test-files/024.js')).default('Pair, inactive Verdant Leaf'),
		(await import('./test-files/025.js')).default('Pair, active Verdant Leaf'),
		(await import('./test-files/026.js')).default('Pair, The Pillar'),
		(await import('./test-files/027.js')).default('Lucky Pair'),
		(await import('./test-files/028.js')).default('Lucky Flush, Bloodstone'),
		(await import('./test-files/029.js')).default('Lucky Flush, Bloodstone, 4x Oops! All 6s'),
		(await import('./test-files/030.js')).default('Pair, Sly Joker, Observatory'),
		(await import('./test-files/031.js')).default('One wild + Flower Pot'),
		(await import('./test-files/032.js')).default('Four wild + Flower Pot'),
		(await import('./test-files/033.js')).default('Run from 2024-04-10 16:52 UTC'),
		(await import('./test-files/034.js')).default('Run from 2024-04-09 19:20 UTC'),
		(await import('./test-files/035.js')).default('https://www.youtube.com/watch?v=hcZF7NJGuPE'),
	])('$message', ({ initialState, expected }) => {
		const score = calculateScore(getState(initialState))

		expect(score.hand).toEqual(expected.hand)
		expect(score.scoringCards).toMatchObject(expected.scoringCards)
		expect(score.scores).toMatchObject(expected.scores)
	})
})
