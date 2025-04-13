import { describe, test, expect } from 'vitest'

import { calculateScore } from './calculateScore.ts'
import { getState } from './getState.ts'
import type { Card, InitialState } from './types.ts'

export interface TestCase {
	message: string
	initialState: InitialState
	expected: Omit<ReturnType<typeof calculateScore>, 'scoringCards'> & {
		scoringCards: Partial<Card>[]
	}
}

describe('calculateScore', async () => {
	test.each<TestCase>([
		(await import('./test-files/001.ts')).default('Two pair'),
		(await import('./test-files/002.ts')).default('Two pair, enhancements'),
		(await import('./test-files/003.ts')).default('Bonus High Card, Held steel, Supernova'),
		(await import('./test-files/004.ts')).default('Flush, Held steel, Supernova'),
		(await import('./test-files/005.ts')).default('Debuffed High Card, 2x held steel'),
		(await import('./test-files/006.ts')).default('Pair, Sly Joker'),
		(await import('./test-files/007.ts')).default('Full House, Sly Joker, Even Steven, Bootstraps, Joker, Superposition'),
		(await import('./test-files/008.ts')).default('Straight, Sly Joker, Even Steven, Bootstraps, Joker, Crazy Joker'),
		(await import('./test-files/009.ts')).default('Flush, glass, steel'),
		(await import('./test-files/010.ts')).default('Two pair, stone'),
		(await import('./test-files/011.ts')).default('Five of a Kind 1'),
		(await import('./test-files/012.ts')).default('Five of a Kind 2'),
		(await import('./test-files/013.ts')).default('Five of a Kind 3'),
		(await import('./test-files/014.ts')).default('Flush Five 1'),
		(await import('./test-files/015.ts')).default('Flush Five 2'),
		(await import('./test-files/016.ts')).default('Flush Five 3'),
		(await import('./test-files/017.ts')).default('Flush Five (played by haelian on 2024-02-26 18:13 UTC)'),
		(await import('./test-files/018.ts')).default('Pair, 1x Blueprint, Sly Joker'),
		(await import('./test-files/019.ts')).default('Pair, 2x Blueprint, Sly Joker'),
		(await import('./test-files/020.ts')).default('Pair, 2x Blueprint, Sly Joker, Brainstorm'),
		(await import('./test-files/021.ts')).default('Four of a Kind'),
		(await import('./test-files/022.ts')).default('Four of a Kind, Flower Pot'),
		(await import('./test-files/023.ts')).default('Four of a Kind, Flower Pot, Wild card'),
		(await import('./test-files/024.ts')).default('Pair, inactive Verdant Leaf'),
		(await import('./test-files/025.ts')).default('Pair, active Verdant Leaf'),
		(await import('./test-files/026.ts')).default('Pair, The Pillar'),
		(await import('./test-files/027.ts')).default('Lucky Pair'),
		(await import('./test-files/028.ts')).default('Lucky Flush, Bloodstone'),
		(await import('./test-files/029.ts')).default('Lucky Flush, Bloodstone, 4x Oops! All 6s'),
		(await import('./test-files/030.ts')).default('Pair, Sly Joker, Observatory'),
		(await import('./test-files/031.ts')).default('One wild + Flower Pot'),
		(await import('./test-files/032.ts')).default('Four wild + Flower Pot'),
		(await import('./test-files/033.ts')).default('Run from 2024-04-10 16:52 UTC'),
		(await import('./test-files/034.ts')).default('Run from 2024-04-09 19:20 UTC'),
		(await import('./test-files/035.ts')).default('https://www.youtube.com/watch?v=hcZF7NJGuPE'),
		(await import('./test-files/036.ts')).default('Regression test for #17'),
		(await import('./test-files/037.ts')).default('Regression test for #18'),
		(await import('./test-files/038.ts')).default('Regression test for #20'),
		(await import('./test-files/039.ts')).default('Regression test for #22'),
		(await import('./test-files/040.ts')).default('Regression test for #25'),
		(await import('./test-files/041.ts')).default('Regression test for #26'),
	])('$message', ({ initialState, expected }) => {
		const score = calculateScore(getState(initialState))

		expect(score.hand).toEqual(expected.hand)
		expect(score.scoringCards).toMatchObject(expected.scoringCards)
		expect(score.scores).toMatchObject(expected.scores)
	})
})
