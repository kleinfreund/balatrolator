import { describe, test, expect } from 'vitest'

import { deminify, minify } from './minifier.js'
import { getState } from '#utilities/getState.js'
import type { InitialState } from '#lib/types.js'

describe('minifier', () => {
	test.each<[InitialState, string, InitialState]>([
		[
			{},
			'||||1||5|,;,;,;,;,;,;,;,;,;,;,;,|||',
			{
				hands: 0,
				discards: 0,
				money: 0,
				blind: {
					name: 'Small Blind',
					isActive: true,
				},
				deck: 'Red Deck',
				jokerSlots: 5,
				handLevels: {
					'Flush Five': { level: 1, plays: 0 },
					'Flush House': { level: 1, plays: 0 },
					'Five of a Kind': { level: 1, plays: 0 },
					'Straight Flush': { level: 1, plays: 0 },
					'Four of a Kind': { level: 1, plays: 0 },
					'Full House': { level: 1, plays: 0 },
					'Flush': { level: 1, plays: 0 },
					'Straight': { level: 1, plays: 0 },
					'Three of a Kind': { level: 1, plays: 0 },
					'Two Pair': { level: 1, plays: 0 },
					'Pair': { level: 1, plays: 0 },
					'High Card': { level: 1, plays: 0 },
				},
				jokers: [],
				playedCards: [],
				heldCards: [],
			},
		],
		[
			{
				hands: 1,
				discards: 2,
				money: 3,
				blind: {
					name: 'Big Blind',
					isActive: false,
				},
				deck: 'Plasma Deck',
				jokerSlots: 5,
				handLevels: {
					'Pair': { level: 4, plays: 4 },
					'High Card': { level: 5, plays: 5 },
				},
				jokers: [],
				playedCards: [],
				heldCards: [],
			},
			'1|2|3|1||13|5|,;,;,;,;,;,;,;,;,;,;4,4;5,5|||',
			{
				hands: 1,
				discards: 2,
				money: 3,
				blind: {
					name: 'Big Blind',
					isActive: false,
				},
				deck: 'Plasma Deck',
				jokerSlots: 5,
				handLevels: {
					'Flush Five': { level: 1, plays: 0 },
					'Flush House': { level: 1, plays: 0 },
					'Five of a Kind': { level: 1, plays: 0 },
					'Straight Flush': { level: 1, plays: 0 },
					'Four of a Kind': { level: 1, plays: 0 },
					'Full House': { level: 1, plays: 0 },
					'Flush': { level: 1, plays: 0 },
					'Straight': { level: 1, plays: 0 },
					'Three of a Kind': { level: 1, plays: 0 },
					'Two Pair': { level: 1, plays: 0 },
					'Pair': { level: 4, plays: 4 },
					'High Card': { level: 5, plays: 5 },
				},
				jokers: [],
				playedCards: [],
				heldCards: [],
			},
		],
		[
			{
				hands: 1,
				discards: 2,
				money: 3,
				blind: {
					name: 'Big Blind',
					isActive: false,
				},
				deck: 'Plasma Deck',
				jokerSlots: 5,
				handLevels: {
					'Flush Five': { level: 1, plays: 0 },
					'Flush House': { level: 1, plays: 1 },
					'Five of a Kind': { level: 1, plays: 2 },
					'Straight Flush': { level: 9, plays: 3 },
					'Four of a Kind': { level: 8, plays: 4 },
					'Full House': { level: 7, plays: 5 },
					'Flush': { level: 6, plays: 6 },
					'Straight': { level: 5, plays: 7 },
					'Three of a Kind': { level: 4, plays: 8 },
					'Two Pair': { level: 3, plays: 9 },
					'Pair': { level: 2, plays: 0 },
					'High Card': { level: 1, plays: 0 },
				},
				jokers: [],
				playedCards: [],
				heldCards: [],
			},
			'1|2|3|1||13|5|,;,1;,2;9,3;8,4;7,5;6,6;5,7;4,8;3,9;2,;,|||',
			{
				hands: 1,
				discards: 2,
				money: 3,
				blind: {
					name: 'Big Blind',
					isActive: false,
				},
				deck: 'Plasma Deck',
				jokerSlots: 5,
				handLevels: {
					'Flush Five': { level: 1, plays: 0 },
					'Flush House': { level: 1, plays: 1 },
					'Five of a Kind': { level: 1, plays: 2 },
					'Straight Flush': { level: 9, plays: 3 },
					'Four of a Kind': { level: 8, plays: 4 },
					'Full House': { level: 7, plays: 5 },
					'Flush': { level: 6, plays: 6 },
					'Straight': { level: 5, plays: 7 },
					'Three of a Kind': { level: 4, plays: 8 },
					'Two Pair': { level: 3, plays: 9 },
					'Pair': { level: 2, plays: 0 },
					'High Card': { level: 1, plays: 0 },
				},
				jokers: [],
				playedCards: [],
				heldCards: [],
			},
		],
		[
			{
				hands: 1,
				discards: 2,
				money: 3,
				blind: {
					name: 'Big Blind',
					isActive: false,
				},
				deck: 'Plasma Deck',
				jokerSlots: 5,
				handLevels: {
					'Flush Five': { level: 1, plays: 0 },
					'Flush House': { level: 1, plays: 1 },
					'Five of a Kind': { level: 1, plays: 2 },
					'Straight Flush': { level: 9, plays: 3 },
					'Four of a Kind': { level: 8, plays: 4 },
					'Full House': { level: 7, plays: 5 },
					'Flush': { level: 6, plays: 6 },
					'Straight': { level: 5, plays: 7 },
					'Three of a Kind': { level: 4, plays: 8 },
					'Two Pair': { level: 3, plays: 9 },
					'Pair': { level: 2, plays: 0 },
					'High Card': { level: 1, plays: 0 },
				},
				jokers: [
					{ name: 'Mime', edition: 'polychrome' },
					{ name: 'Castle', plusChips: 81 },
					{ name: 'Blueprint' },
					{ name: 'Baseball Card' },
					{ name: 'Baron' },
				],
				playedCards: [
					{ rank: 'King', suit: 'Diamonds', enhancement: 'gold' },
					{ rank: 'King', suit: 'Diamonds', enhancement: 'gold' },
					{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
					{ rank: 'Queen', suit: 'Diamonds', enhancement: 'glass' },
					{ rank: 'Queen', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
				],
				heldCards: [
					{ rank: 'King', suit: 'Diamonds', enhancement: 'gold' },
				],
			},
			'1|2|3|1||13|5|,;,1;,2;9,3;8,4;7,5;6,6;5,7;4,8;3,9;2,;,|18,3,,,,,,;102,,81,,,,,;122,,,,,,,;91,,,,,,,;71,,,,,,,|1,3,,7,,;1,3,,7,,;2,3,,7,,;2,3,,4,,;2,3,,4,2,|1,3,,7,,',
			{
				hands: 1,
				discards: 2,
				money: 3,
				blind: {
					name: 'Big Blind',
					isActive: false,
				},
				deck: 'Plasma Deck',
				jokerSlots: 5,
				handLevels: {
					'Flush Five': { level: 1, plays: 0 },
					'Flush House': { level: 1, plays: 1 },
					'Five of a Kind': { level: 1, plays: 2 },
					'Straight Flush': { level: 9, plays: 3 },
					'Four of a Kind': { level: 8, plays: 4 },
					'Full House': { level: 7, plays: 5 },
					'Flush': { level: 6, plays: 6 },
					'Straight': { level: 5, plays: 7 },
					'Three of a Kind': { level: 4, plays: 8 },
					'Two Pair': { level: 3, plays: 9 },
					'Pair': { level: 2, plays: 0 },
					'High Card': { level: 1, plays: 0 },
				},
				jokers: [
					{ name: 'Mime', edition: 'polychrome' },
					{ name: 'Castle', plusChips: 81 },
					{ name: 'Blueprint' },
					{ name: 'Baseball Card' },
					{ name: 'Baron' },
				],
				playedCards: [
					{ rank: 'King', suit: 'Diamonds', enhancement: 'gold' },
					{ rank: 'King', suit: 'Diamonds', enhancement: 'gold' },
					{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
					{ rank: 'Queen', suit: 'Diamonds', enhancement: 'glass' },
					{ rank: 'Queen', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
				],
				heldCards: [
					{ rank: 'King', suit: 'Diamonds', enhancement: 'gold' },
				],
			},
		],
	])('works', (initialState, expectedString, expectedInitialState) => {
		const state = getState(initialState)

		expect(minify(state)).toEqual(expectedString)
		expect(deminify(expectedString)).toMatchObject(expectedInitialState)
	})
})
