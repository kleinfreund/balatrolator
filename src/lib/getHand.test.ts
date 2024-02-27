import { describe, test, expect } from 'vitest'

import { getCards } from '#lib/balatro.js'
import { GetHandOptions, getHand } from './getHand.js'
import type { HandName, InitialCard } from '#lib/types.js'

type TestCase = {
	message: string
	initialCards: InitialCard[]
	options?: GetHandOptions
	expectedPlayedHand: HandName
	expectedScoringCards: InitialCard[]
}

describe('getHand', () => {
	test.each<TestCase>([
		{
			message: 'Flush five + Smeared Joker',
			initialCards: [
				{ rank: '10', suit: 'Diamonds' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
			],
			options: {
				hasSmearedJoker: true,
			},
			expectedPlayedHand: 'Flush Five',
			expectedScoringCards: [
				{ rank: '10', suit: 'Diamonds' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
			],
		},
		{
			message: 'Flush five',
			initialCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
			],
			expectedPlayedHand: 'Flush Five',
			expectedScoringCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
			],
		},
		{
			message: 'Five of a kind',
			initialCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Spades' },
			],
			expectedPlayedHand: 'Five of a Kind',
			expectedScoringCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Spades' },
			],
		},
		{
			message: 'Straight flush + Four Fingers + Shortcut + Smeared Joker',
			initialCards: [
				{ rank: '8', suit: 'Spades' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '6', suit: 'Diamonds' },
				{ rank: '4', suit: 'Diamonds' },
				{ rank: '2', suit: 'Hearts' },
			],
			options: {
				hasFourFingers: true,
				hasShortcut: true,
				hasSmearedJoker: true,
			},
			expectedPlayedHand: 'Straight Flush',
			expectedScoringCards: [
				{ rank: '8', suit: 'Spades' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '6', suit: 'Diamonds' },
				{ rank: '4', suit: 'Diamonds' },
				{ rank: '2', suit: 'Hearts' },
			],
		},
		{
			message: 'Straight flush + Four Fingers + Shortcut',
			initialCards: [
				{ rank: '8', suit: 'Spades' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '6', suit: 'Hearts' },
				{ rank: '4', suit: 'Hearts' },
				{ rank: '2', suit: 'Hearts' },
			],
			options: {
				hasFourFingers: true,
				hasShortcut: true,
			},
			expectedPlayedHand: 'Straight Flush',
			expectedScoringCards: [
				{ rank: '8', suit: 'Spades' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '6', suit: 'Hearts' },
				{ rank: '4', suit: 'Hearts' },
				{ rank: '2', suit: 'Hearts' },
			],
		},
		{
			message: 'Straight flush + Four Fingers',
			initialCards: [
				{ rank: '9', suit: 'Spades' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '8', suit: 'Hearts' },
				{ rank: '7', suit: 'Hearts' },
				{ rank: '2', suit: 'Hearts' },
			],
			options: {
				hasFourFingers: true,
			},
			expectedPlayedHand: 'Straight Flush',
			expectedScoringCards: [
				{ rank: '9', suit: 'Spades' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '8', suit: 'Hearts' },
				{ rank: '7', suit: 'Hearts' },
				{ rank: '2', suit: 'Hearts' },
			],
		},
		{
			message: 'Straight flush',
			initialCards: [
				{ rank: '9', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '8', suit: 'Hearts' },
				{ rank: '7', suit: 'Hearts' },
				{ rank: '6', suit: 'Hearts' },
			],
			expectedPlayedHand: 'Straight Flush',
			expectedScoringCards: [
				{ rank: '9', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '8', suit: 'Hearts' },
				{ rank: '7', suit: 'Hearts' },
				{ rank: '6', suit: 'Hearts' },
			],
		},
		{
			message: 'Four of a kind',
			initialCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: 'King', suit: 'Spades' },
			],
			expectedPlayedHand: 'Four of a Kind',
			expectedScoringCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
			],
		},
		{
			message: 'Flush house + Smeared Joker',
			initialCards: [
				{ rank: '10', suit: 'Clubs' },
				{ rank: '10', suit: 'Clubs' },
				{ rank: '10', suit: 'Clubs' },
				{ rank: '2', suit: 'Spades' },
				{ rank: '2', suit: 'Spades' },
			],
			options: {
				hasSmearedJoker: true,
			},
			expectedPlayedHand: 'Flush House',
			expectedScoringCards: [
				{ rank: '10', suit: 'Clubs' },
				{ rank: '10', suit: 'Clubs' },
				{ rank: '10', suit: 'Clubs' },
				{ rank: '2', suit: 'Spades' },
				{ rank: '2', suit: 'Spades' },
			],
		},
		{
			message: 'Flush house',
			initialCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '2', suit: 'Hearts' },
				{ rank: '2', suit: 'Hearts' },
			],
			expectedPlayedHand: 'Flush House',
			expectedScoringCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '2', suit: 'Hearts' },
				{ rank: '2', suit: 'Hearts' },
			],
		},
		{
			message: 'Full house',
			initialCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '2', suit: 'Hearts' },
				{ rank: '2', suit: 'Spades' },
			],
			expectedPlayedHand: 'Full House',
			expectedScoringCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '2', suit: 'Hearts' },
				{ rank: '2', suit: 'Spades' },
			],
		},
		{
			message: 'Flush + Four Fingers + wild enhancements',
			initialCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Clubs', enhancement: 'wild' },
				{ rank: '3', suit: 'Diamonds' },
				{ rank: '2', suit: 'Diamonds', enhancement: 'wild' },
				{ rank: 'King', suit: 'Spades' },
			],
			options: {
				hasFourFingers: true,
				hasSmearedJoker: true,
			},
			expectedPlayedHand: 'Flush',
			expectedScoringCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Clubs', enhancement: 'wild' },
				{ rank: '3', suit: 'Diamonds' },
				{ rank: '2', suit: 'Diamonds', enhancement: 'wild' },
			],
		},
		{
			message: 'Flush + Four Fingers + wild enhancements',
			initialCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Clubs', enhancement: 'wild' },
				{ rank: '3', suit: 'Hearts' },
				{ rank: '2', suit: 'Diamonds', enhancement: 'wild' },
				{ rank: 'King', suit: 'Spades' },
			],
			options: {
				hasFourFingers: true,
			},
			expectedPlayedHand: 'Flush',
			expectedScoringCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Clubs', enhancement: 'wild' },
				{ rank: '3', suit: 'Hearts' },
				{ rank: '2', suit: 'Diamonds', enhancement: 'wild' },
			],
		},
		{
			message: 'Flush + Four Fingers',
			initialCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Hearts' },
				{ rank: '3', suit: 'Hearts' },
				{ rank: '2', suit: 'Hearts' },
				{ rank: 'King', suit: 'Spades' },
			],
			options: {
				hasFourFingers: true,
			},
			expectedPlayedHand: 'Flush',
			expectedScoringCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Hearts' },
				{ rank: '3', suit: 'Hearts' },
				{ rank: '2', suit: 'Hearts' },
			],
		},
		{
			message: 'Flush + Smeared Joker + wild enhancements',
			initialCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Clubs', enhancement: 'wild' },
				{ rank: '3', suit: 'Hearts' },
				{ rank: '2', suit: 'Diamonds', enhancement: 'wild' },
				{ rank: 'King', suit: 'Diamonds' },
			],
			options: {
				hasSmearedJoker: true,
			},
			expectedPlayedHand: 'Flush',
			expectedScoringCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Clubs', enhancement: 'wild' },
				{ rank: '3', suit: 'Hearts' },
				{ rank: '2', suit: 'Diamonds', enhancement: 'wild' },
				{ rank: 'King', suit: 'Diamonds' },
			],
		},
		{
			message: 'Flush + wild enhancements',
			initialCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Clubs', enhancement: 'wild' },
				{ rank: '3', suit: 'Hearts' },
				{ rank: '2', suit: 'Diamonds', enhancement: 'wild' },
				{ rank: 'King', suit: 'Hearts' },
			],
			expectedPlayedHand: 'Flush',
			expectedScoringCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Clubs', enhancement: 'wild' },
				{ rank: '3', suit: 'Hearts' },
				{ rank: '2', suit: 'Diamonds', enhancement: 'wild' },
				{ rank: 'King', suit: 'Hearts' },
			],
		},
		{
			message: 'Flush + Smeared Joker',
			initialCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Hearts' },
				{ rank: '3', suit: 'Hearts' },
				{ rank: '2', suit: 'Diamonds' },
				{ rank: 'King', suit: 'Diamonds' },
			],
			options: {
				hasSmearedJoker: true,
			},
			expectedPlayedHand: 'Flush',
			expectedScoringCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Hearts' },
				{ rank: '3', suit: 'Hearts' },
				{ rank: '2', suit: 'Diamonds' },
				{ rank: 'King', suit: 'Diamonds' },
			],
		},
		{
			message: 'Flush',
			initialCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Hearts' },
				{ rank: '3', suit: 'Hearts' },
				{ rank: '2', suit: 'Hearts' },
				{ rank: 'King', suit: 'Hearts' },
			],
			expectedPlayedHand: 'Flush',
			expectedScoringCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Hearts' },
				{ rank: '3', suit: 'Hearts' },
				{ rank: '2', suit: 'Hearts' },
				{ rank: 'King', suit: 'Hearts' },
			],
		},
		{
			message: 'Low straight',
			initialCards: [
				{ rank: '5', suit: 'Clubs' },
				{ rank: '4', suit: 'Clubs' },
				{ rank: 'Ace', suit: 'Hearts' },
				{ rank: '2', suit: 'Spades' },
				{ rank: '3', suit: 'Diamonds' },
			],
			expectedPlayedHand: 'Straight',
			expectedScoringCards: [
				{ rank: '5', suit: 'Clubs' },
				{ rank: '4', suit: 'Clubs' },
				{ rank: 'Ace', suit: 'Hearts' },
				{ rank: '2', suit: 'Spades' },
				{ rank: '3', suit: 'Diamonds' },
			],
		},
		{
			message: 'Straight + Four Fingers + Shortcut',
			initialCards: [
				{ rank: '4', suit: 'Clubs' },
				{ rank: '5', suit: 'Clubs' },
				{ rank: '7', suit: 'Hearts' },
				{ rank: '3', suit: 'Diamonds' },
				{ rank: '2', suit: 'Spades' },
			],
			options: {
				hasFourFingers: true,
				hasShortcut: true,
			},
			expectedPlayedHand: 'Straight',
			expectedScoringCards: [
				{ rank: '4', suit: 'Clubs' },
				{ rank: '5', suit: 'Clubs' },
				{ rank: '7', suit: 'Hearts' },
				{ rank: '3', suit: 'Diamonds' },
				{ rank: '2', suit: 'Spades' },
			],
		},
		{
			message: 'Straight + Four Fingers',
			initialCards: [
				{ rank: '4', suit: 'Clubs' },
				{ rank: '5', suit: 'Clubs' },
				{ rank: '7', suit: 'Hearts' },
				{ rank: '3', suit: 'Diamonds' },
				{ rank: '2', suit: 'Spades' },
			],
			options: {
				hasFourFingers: true,
			},
			expectedPlayedHand: 'Straight',
			expectedScoringCards: [
				{ rank: '4', suit: 'Clubs' },
				{ rank: '5', suit: 'Clubs' },
				{ rank: '3', suit: 'Diamonds' },
				{ rank: '2', suit: 'Spades' },
			],
		},
		{
			message: 'Straight + Shortcut',
			initialCards: [
				{ rank: '6', suit: 'Clubs' },
				{ rank: '8', suit: 'Clubs' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '2', suit: 'Spades' },
				{ rank: '4', suit: 'Diamonds' },
			],
			options: {
				hasShortcut: true,
			},
			expectedPlayedHand: 'Straight',
			expectedScoringCards: [
				{ rank: '6', suit: 'Clubs' },
				{ rank: '8', suit: 'Clubs' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '2', suit: 'Spades' },
				{ rank: '4', suit: 'Diamonds' },
			],
		},
		{
			message: 'Straight',
			initialCards: [
				{ rank: '6', suit: 'Hearts' },
				{ rank: '5', suit: 'Clubs' },
				{ rank: '4', suit: 'Clubs' },
				{ rank: '3', suit: 'Diamonds' },
				{ rank: '2', suit: 'Spades' },
			],
			expectedPlayedHand: 'Straight',
			expectedScoringCards: [
				{ rank: '6', suit: 'Hearts' },
				{ rank: '5', suit: 'Clubs' },
				{ rank: '4', suit: 'Clubs' },
				{ rank: '3', suit: 'Diamonds' },
				{ rank: '2', suit: 'Spades' },
			],
		},
		{
			message: 'Three of a kind',
			initialCards: [
				{ rank: 'King', suit: 'Hearts' },
				{ rank: 'King', suit: 'Clubs' },
				{ rank: 'King', suit: 'Clubs' },
				{ rank: '7', suit: 'Diamonds' },
				{ rank: '5', suit: 'Spades' },
			],
			expectedPlayedHand: 'Three of a Kind',
			expectedScoringCards: [
				{ rank: 'King', suit: 'Hearts' },
				{ rank: 'King', suit: 'Clubs' },
				{ rank: 'King', suit: 'Clubs' },
			],
		},
		{
			message: 'Two pair',
			initialCards: [
				{ rank: 'King', suit: 'Hearts' },
				{ rank: 'King', suit: 'Clubs' },
				{ rank: '7', suit: 'Clubs' },
				{ rank: '7', suit: 'Diamonds' },
				{ rank: '5', suit: 'Spades' },
			],
			expectedPlayedHand: 'Two Pair',
			expectedScoringCards: [
				{ rank: 'King', suit: 'Hearts' },
				{ rank: 'King', suit: 'Clubs' },
				{ rank: '7', suit: 'Clubs' },
				{ rank: '7', suit: 'Diamonds' },
			],
		},
		{
			message: 'Pair',
			initialCards: [
				{ rank: 'King', suit: 'Hearts' },
				{ rank: 'King', suit: 'Clubs' },
				{ rank: '8', suit: 'Clubs' },
				{ rank: '7', suit: 'Diamonds' },
				{ rank: '5', suit: 'Spades' },
			],
			expectedPlayedHand: 'Pair',
			expectedScoringCards: [
				{ rank: 'King', suit: 'Hearts' },
				{ rank: 'King', suit: 'Clubs' },
			],
		},
		{
			message: 'High card',
			initialCards: [
				{ rank: 'King', suit: 'Clubs' },
				{ rank: 'Ace', suit: 'Hearts' },
				{ rank: '7', suit: 'Clubs' },
			],
			expectedPlayedHand: 'High Card',
			expectedScoringCards: [
				{ rank: 'Ace', suit: 'Hearts' },
			],
		},
	])('$message', ({ initialCards, options, expectedPlayedHand, expectedScoringCards }) => {
		const cards = getCards(initialCards)

		const { playedHand, scoringCards } = getHand(cards, options)

		expect(playedHand).toEqual(expectedPlayedHand)
		expect(scoringCards).toMatchObject(expectedScoringCards)
	})
})
