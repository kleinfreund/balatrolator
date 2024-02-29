import { describe, test, expect } from 'vitest'

import { calculateScore } from './balatro.js'
import type { InitialCard } from '#lib/types.js'
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
// import case018 from './test-files/018.js'

type Expected = Omit<ReturnType<typeof calculateScore>, 'scoringCards'> & { scoringCards: InitialCard[] }

export type TestCase = {
	message: string
	parameters: Parameters<typeof calculateScore>
	expected: Expected
}

describe('calculateScore', () => {
	test.each<TestCase>([
		case001('Two pair'),
		case002('Two pair + enhancements'),
		case003('Bonus High Card  + Held steel + Supernova'),
		case004('Flush  + Held steel + Supernova'),
		case005('Debuffed High Card + 2x held steel'),
		case006('Pair + Sly Joker'),
		case007('TODO'),
		case008('TODO'),
		case009('Flush + glass + steel'),
		case010('Two pair + stone'),
		case011('Five of a kind 1'),
		case012('Five of a kind 2'),
		case013('Five of a kind 3'),
		case014('Flush Five 1'),
		case015('Flush Five 2'),
		case016('Flush Five 3'),
		case017('Flush Five (played by haelian on 2024-02-26 18:13 UTC)'),
		// case018('Full House (played by haelian on 2024-02-28 20:54 UTC)'),
	])('$message', ({ parameters, expected }) => {
		expect(calculateScore(...parameters)).toMatchObject(expected)
	})
})
