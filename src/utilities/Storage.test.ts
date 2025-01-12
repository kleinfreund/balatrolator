import { describe, test, expect, vi } from 'vitest'

import type { InitialState } from '#lib/types.js'
import { getState } from './getState.js'
import { readStateFromUrl, saveStateToUrl } from './Storage.js'

/*
This test deliberately doesn't mock lz-string so that changes to application logic that breaks the share URLs will be break this test.
*/

describe('Storage', () => {
	test.each<[InitialState, string]>([
		[
			{},
			'D44RhBWEBoG56IcpqEiA',
		],
		[
			{
				blind: { name: 'Big Blind' },
				cards: [
					{ played: true, rank: 'Ace', suit: 'Diamonds', seal: 'red' },
					{ played: true, rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
					{ played: true, rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
					{ played: true, rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
					{ played: true, rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
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
			'D4iM3YFY1AaA3I5TUvU6AGOu+NACZD88EiA2UnAZkQoE58iA6QqM0Gk0g0JvFBYdcwWnh6gE4uABY4k6XDpyFuKTPmLNauBuW4eiGRx5KVp3OYm4gA',
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
