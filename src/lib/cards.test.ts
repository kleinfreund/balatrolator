import { describe, test, expect } from 'vitest'

import { isDebuffed, isFaceCard, isRank, isSuit } from './cards.ts'
import { getCard } from './getState.ts'

describe('cards', () => {
	describe('isDebuffed', () => {
		test.each<{ parameters: Parameters<typeof isDebuffed>, expected: boolean }>([
			{
				parameters: [
					getCard({ rank: '2', suit: 'Hearts' }),
					{ active: true, name: 'Small Blind' },
					false,
				],
				expected: false,
			},
			{
				parameters: [
					getCard({ rank: '2', suit: 'Hearts' }),
					{ active: true, name: 'Verdant Leaf' },
					false,
				],
				expected: true,
			},
			{
				parameters: [
					getCard({ rank: '2', suit: 'Clubs' }),
					{ active: true, name: 'The Club' },
					false,
				],
				expected: true,
			},
			{
				parameters: [
					getCard({ rank: '2', suit: 'Spades' }),
					{ active: true, name: 'The Goad' },
					false,
				],
				expected: true,
			},
			{
				parameters: [
					getCard({ rank: '2', suit: 'Hearts' }),
					{ active: true, name: 'The Head' },
					false,
				],
				expected: true,
			},
			{
				parameters: [
					getCard({ rank: '2', suit: 'Diamonds' }),
					{ active: true, name: 'The Window' },
					false,
				],
				expected: true,
			},
			{
				parameters: [
					getCard({ rank: 'King', suit: 'Diamonds' }),
					{ active: true, name: 'The Plant' },
					false,
				],
				expected: true,
			},
			{
				parameters: [
					getCard({ rank: '2', suit: 'Diamonds' }),
					{ active: true, name: 'The Plant' },
					true,
				],
				expected: true,
			},
		])('works', ({ parameters, expected }) => {
			expect(isDebuffed(...parameters)).toBe(expected)
		})
	})

	describe('isFaceCard', () => {
		test.each<{ parameters: Parameters<typeof isFaceCard>, expected: boolean }>([
			{
				parameters: [
					getCard({ rank: '2', suit: 'Hearts' }),
					false,
				],
				expected: false,
			},
		])('works', ({ parameters, expected }) => {
			expect(isFaceCard(...parameters)).toBe(expected)
		})
	})

	describe('isRank', () => {
		test.each<{ parameters: Parameters<typeof isRank>, expected: boolean }>([
			{
				parameters: [
					getCard({ rank: '2', suit: 'Hearts' }),
					'3',
				],
				expected: false,
			},
			{
				parameters: [
					getCard({ rank: '2', suit: 'Hearts' }),
					['4', 'Ace'],
				],
				expected: false,
			},
			{
				parameters: [
					getCard({ rank: '2', suit: 'Hearts' }),
					'2',
				],
				expected: true,
			},
			{
				parameters: [
					getCard({ rank: '4', suit: 'Hearts' }),
					['4', 'Ace'],
				],
				expected: true,
			},
			{
				parameters: [
					getCard({ debuffed: true, rank: '4', suit: 'Hearts' }),
					['4', 'Ace'],
				],
				expected: false,
			},
			{
				parameters: [
					getCard({ rank: '4', suit: 'Hearts', enhancement: 'stone' }),
					['4', 'Ace'],
				],
				expected: false,
			},
		])('works', ({ parameters, expected }) => {
			expect(isRank(...parameters)).toBe(expected)
		})
	})

	describe('isSuit', () => {
		test.each<{ parameters: Parameters<typeof isSuit>, expected: boolean }>([
			{
				parameters: [
					getCard({ rank: '2', suit: 'Hearts' }),
					'Diamonds',
				],
				expected: false,
			},
			{
				parameters: [
					getCard({ rank: '2', suit: 'Hearts' }),
					['Diamonds', 'Clubs'],
				],
				expected: false,
			},
			{
				parameters: [
					getCard({ rank: '2', suit: 'Diamonds' }),
					'Diamonds',
				],
				expected: true,
			},
			{
				parameters: [
					getCard({ rank: '2', suit: 'Diamonds' }),
					['Diamonds', 'Clubs'],
				],
				expected: true,
			},
			{
				parameters: [
					getCard({ debuffed: true, rank: '2', suit: 'Diamonds' }),
					['Diamonds', 'Clubs'],
				],
				expected: false,
			},
			{
				parameters: [
					getCard({ rank: '2', suit: 'Diamonds', enhancement: 'stone' }),
					['Diamonds', 'Clubs'],
				],
				expected: false,
			},
			{
				parameters: [
					getCard({ rank: '2', suit: 'Hearts', enhancement: 'wild' }),
					['Diamonds', 'Clubs'],
				],
				expected: true,
			},
			{
				parameters: [
					getCard({ debuffed: true, rank: '2', suit: 'Hearts', enhancement: 'wild' }),
					['Diamonds', 'Clubs'],
				],
				expected: false,
			},
			{
				parameters: [
					getCard({ debuffed: true, rank: '2', suit: 'Diamonds', enhancement: 'wild' }),
					['Diamonds', 'Clubs'],
				],
				expected: true,
			},
		])('works', ({ parameters, expected }) => {
			expect(isSuit(...parameters)).toBe(expected)
		})
	})
})
