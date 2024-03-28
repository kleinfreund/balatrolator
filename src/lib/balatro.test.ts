import { describe, test, expect } from 'vitest'

import { calculateScore } from './balatro.js'
import { getState } from '#utilities/getState.js'
import type { Card, InitialState } from '#lib/types.js'
import case001 from './test-files/001.js'
import case002 from './test-files/002.js'
import case003 from './test-files/003.js'
import case004 from './test-files/004.js'
import case005 from './test-files/005.js'
import case006 from './test-files/006.js'
import case007 from './test-files/007.js'
import case008 from './test-files/008.js'
import case009 from './test-files/009.js'
import case010 from './test-files/010.js'
import case011 from './test-files/011.js'
import case012 from './test-files/012.js'
import case013 from './test-files/013.js'
import case014 from './test-files/014.js'
import case015 from './test-files/015.js'
import case016 from './test-files/016.js'
import case017 from './test-files/017.js'
import case018 from './test-files/018.js'
import case019 from './test-files/019.js'
import case020 from './test-files/020.js'
import case021 from './test-files/021.js'
import case022 from './test-files/022.js'
import case023 from './test-files/023.js'
import case024 from './test-files/024.js'
import case025 from './test-files/025.js'
import case026 from './test-files/026.js'
import case027 from './test-files/027.js'
import case028 from './test-files/028.js'
import case029 from './test-files/029.js'
import case030 from './test-files/030.js'
import case031 from './test-files/031.js'

export type TestCase = {
	message: string
	initialState: InitialState
	expected: Omit<ReturnType<typeof calculateScore>, 'scoringCards'> & {
		scoringCards: Partial<Card>[]
	}
}

describe('calculateScore', () => {
	test.each<TestCase>([
		case001('Two pair'),
		case002('Two pair, enhancements'),
		case003('Bonus High Card, Held steel, Supernova'),
		case004('Flush, Held steel, Supernova'),
		case005('Debuffed High Card, 2x held steel'),
		case006('Pair, Sly Joker'),
		case007('Full House, Sly Joker, Even Steven, Bootstraps, Joker, Superposition'),
		case008('Straight, Sly Joker, Even Steven, Bootstraps, Joker, Crazy Joker'),
		case009('Flush, glass, steel'),
		case010('Two pair, stone'),
		case011('Five of a Kind 1'),
		case012('Five of a Kind 2'),
		case013('Five of a Kind 3'),
		case014('Flush Five 1'),
		case015('Flush Five 2'),
		case016('Flush Five 3'),
		case017('Flush Five (played by haelian on 2024-02-26 18:13 UTC)'),
		case018('Pair, 1x Blueprint, Sly Joker'),
		case019('Pair, 2x Blueprint, Sly Joker'),
		case020('Pair, 2x Blueprint, Sly Joker, Brainstorm'),
		case021('Four of a Kind'),
		case022('Four of a Kind, Flower Pot'),
		case023('Four of a Kind, Flower Pot, Wild card'),
		case024('Pair, inactive Verdant Leaf'),
		case025('Pair, active Verdant Leaf'),
		case026('Pair, The Pillar'),
		case027('Lucky Pair'),
		case028('Lucky Flush, Bloodstone'),
		case029('Lucky Flush, Bloodstone, 4x Oops! All 6s'),
		case030('Pair, Sly Joker, Observatory'),
		case031('One wild + Flower Pot'),
	])('$message', ({ initialState, expected }) => {
		const score = calculateScore(getState(initialState))

		expect(score.hand).toEqual(expected.hand)
		expect(score.scoringCards).toMatchObject(expected.scoringCards)
		expect(score.scores).toMatchObject(expected.scores)
	})
})
