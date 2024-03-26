import { describe, test, expect, vi } from 'vitest'

import type { InitialState } from '#lib/types.js'
import { getState } from './getState.js'
import { fetchState, saveState } from './Storage.js'

/*
This test deliberately doesn't mock lz-string so that changes to application logic that breaks the share URLs will be break this test.
*/

describe('Storage', () => {
	test.each<[InitialState, string]>([
		[
			{},
			'D44RhBWEBoG56IcpqGiA',
		],
		[
			{
				blind: { name: 'Big Blind' },
				playedCards: [
					{ rank: 'Ace', suit: 'Diamonds', seal: 'red' },
					{ rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
					{ rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
					{ rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
					{ rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
				],
				heldCards: [
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
			'D4iM3YFY1AaA3I5TUvU6AGOu+NACZD88EiA2UnAZkQoE58iA6QqM0Gk0g0JvFBYdcwWnhIJxcACxxJ0uQrh1Z8xIvViVuHlJ1wOy1UY0H1QA',
		],
	])('works', (initialState, expectedString) => {
		const paramSetSpy = vi.spyOn(URLSearchParams.prototype, 'set').mockImplementation(() => {})
		saveState('state', getState(initialState))
		expect(paramSetSpy).toHaveBeenCalledWith('state', expectedString)

		vi.spyOn(URLSearchParams.prototype, 'get').mockImplementation(() => expectedString)
		const state = fetchState('state')
		expect(state).toMatchObject(initialState)
	})
})
