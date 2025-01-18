import { readFileSync } from 'node:fs'
import { argv } from 'node:process'

import { getState } from './src/lib/getState.ts'
import { calculateScore } from './src/lib/calculateScore.ts'

const path = argv[2]
if (typeof path !== 'string' || path === '') {
	throw new Error('Path to JSON file containing save is missing!')
}

const content = readFileSync(path, { encoding: 'utf-8' })
const state = getState(JSON.parse(content))
const { hand, scores } = calculateScore(state)
console.info(JSON.stringify({ hand, scores }, null, 2))
