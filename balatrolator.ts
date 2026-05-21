#! /usr/bin/env node

import { readFileSync } from 'node:fs'
import { parseArgs } from 'node:util'

import { getState } from './src/lib/getState.ts'
import { calculateScore } from './src/lib/calculateScore.ts'

const { values } = parseArgs({
	options: {
		path: { type: 'string' },
	},
})

if (!values.path) {
	throw new Error('Path to JSON file containing save is missing!')
}

const content = readFileSync(values.path, { encoding: 'utf-8' })
const state = getState(JSON.parse(content))
const { hand, results } = calculateScore(state)
console.info(JSON.stringify({ hand, results }, null, 2))
