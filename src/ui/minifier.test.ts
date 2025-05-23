import { describe, test, expect } from 'vitest'

import { getState } from '#lib/getState.ts'
import type { InitialState } from '#lib/types.ts'
import { deminify, minify } from './minifier.ts'

describe('minifier', () => {
	test.each<[InitialState, string, InitialState]>([
		[
			{},
			'----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--',
			{
				hands: 0,
				discards: 0,
				money: 0,
				blind: {
					name: 'Small Blind',
					active: true,
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
				cards: [],
			},
		],
		[
			{
				hands: 1,
				discards: 2,
				money: 3,
				blind: {
					name: 'Big Blind',
					active: false,
				},
				deck: 'Plasma Deck',
				jokerSlots: 5,
				handLevels: {
					'Pair': { level: 4, plays: 4 },
					'High Card': { level: 5, plays: 5 },
				},
				jokers: [],
				cards: [],
			},
			'1-2-3-1--13-5-___________-*_*_*_*_*_*_*_*_*_*_4*4_5*5--',
			{
				hands: 1,
				discards: 2,
				money: 3,
				blind: {
					name: 'Big Blind',
					active: false,
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
				cards: [],
			},
		],
		[
			{
				hands: 1,
				discards: 2,
				money: 3,
				blind: {
					name: 'Big Blind',
					active: false,
				},
				deck: 'Plasma Deck',
				observatory: {
					'Pair': 1,
					'Flush': 1,
					'Flush Five': 1,
				},
				jokerSlots: 5,
				handLevels: {
					'Pair': { level: 4, plays: 4 },
					'High Card': { level: 5, plays: 5 },
				},
				jokers: [],
				cards: [],
			},
			'1-2-3-1--13-5-1______1____1_-*_*_*_*_*_*_*_*_*_*_4*4_5*5--',
			{
				hands: 1,
				discards: 2,
				money: 3,
				blind: {
					name: 'Big Blind',
					active: false,
				},
				deck: 'Plasma Deck',
				observatory: {
					'Pair': 1,
					'Flush': 1,
					'Flush Five': 1,
				},
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
				cards: [],
			},
		],
		[
			{
				hands: 1,
				discards: 2,
				money: 3,
				blind: {
					name: 'Big Blind',
					active: false,
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
				cards: [],
			},
			'1-2-3-1--13-5-___________-*_*1_*2_9*3_8*4_7*5_6*6_5*7_4*8_3*9_2*_*--',
			{
				hands: 1,
				discards: 2,
				money: 3,
				blind: {
					name: 'Big Blind',
					active: false,
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
				cards: [],
			},
		],
		[
			{
				hands: 1,
				discards: 2,
				money: 3,
				blind: {
					name: 'Big Blind',
					active: false,
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
				cards: [
					{ played: true, rank: 'King', suit: 'Diamonds', enhancement: 'gold', count: 2 },
					{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
					{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'glass' },
					{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
					{ rank: 'King', suit: 'Diamonds', enhancement: 'gold' },
				],
			},
			'1-2-3-1--13-5-___________-*_*1_*2_9*3_8*4_7*5_6*6_5*7_4*8_3*9_2*_*-18*3*******_102**81******_122********_91********_71********-1*3**7***1*2_2*3**7***1*_2*3**4***1*_2*3**4*2**1*_1*3**7****',
			{
				hands: 1,
				discards: 2,
				money: 3,
				blind: {
					name: 'Big Blind',
					active: false,
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
				cards: [
					{ played: true, rank: 'King', suit: 'Diamonds', enhancement: 'gold', count: 2 },
					{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
					{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'glass' },
					{ played: true, rank: 'Queen', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
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
