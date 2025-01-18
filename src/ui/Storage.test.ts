import { describe, test, expect, vi } from 'vitest'

import type { InitialState } from '#lib/types.js'
import { getState } from '#lib/getState.js'
import { readStateFromUrl, saveStateToUrl } from './Storage.js'

describe('Storage', () => {
	test.each<[InitialState, string]>([
		[
			{},
			'----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--',
		],
		[
			{
				blind: { name: 'Big Blind' },
				cards: [
					{ played: true, rank: 'Ace', suit: 'Diamonds', seal: 'red' },
					{ played: true, rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red', count: 4 },
					{ rank: 'Ace', suit: 'Diamonds', enhancement: 'mult' },
					{ rank: 'Ace', suit: 'Diamonds', enhancement: 'steel', seal: 'red' },
					{ rank: 'Ace', suit: 'Diamonds', enhancement: 'steel', seal: 'red' },
					{ rank: 'Ace', suit: 'Diamonds', seal: 'red' },
				],
				jokers: [
					{ name: 'DNA' },
					{ name: 'Blueprint' },
					{ name: 'The Idol', rank: 'Ace', suit: 'Diamonds' },
					{ name: 'Hologram', timesMultiplier: 12.25 },
					{ name: 'The Family' },
					{ name: 'Glass Joker', timesMultiplier: 5.5 },
				],
				handLevels: {
					'Flush Five': {
						level: 11,
						plays: 0,
					},
				},
			},
			'---1-1--5-___________-11*_*_*_*_*_*_*_*_*_*_*_*-50********_122********_126*****0*3**_69****12.25****_132********_119****5.5****-0*3***2**1*_0*3**4*2**1*4_0*3**2****_0*3**5*2***_0*3**5*2***_0*3***2***',
		],
	])('works', (initialState, expectedString) => {
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		const paramSetSpy = vi.spyOn(URLSearchParams.prototype, 'set').mockImplementation(() => {})
		saveStateToUrl(getState(initialState))
		expect(paramSetSpy).toHaveBeenCalledWith('state', expectedString)

		vi.spyOn(URLSearchParams.prototype, 'get').mockImplementation(() => expectedString)
		const state = readStateFromUrl()
		expect(state).toMatchObject(initialState)
	})
})
