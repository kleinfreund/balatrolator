import { describe, test, expect } from 'vitest'

import { getCard } from './getState.ts'
import { getHand } from './getHand.ts'
import type { HandName, InitialCard, JokerName } from './types.ts'

interface TestCase {
	message: string
	initialCards: InitialCard[]
	jokerSet?: Set<JokerName>
	expectedPlayedHand: HandName
	expectedScoringCards: (Omit<InitialCard, 'index'> & { index: number })[]
}

describe('getHand', () => {
	test.each<TestCase>([
		{
			message: 'Five of a Kind + Smeared Joker + Four Fingers = Flush Five',
			initialCards: [
				{ rank: '10', suit: 'Spades' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Diamonds' },
			],
			jokerSet: new Set(['Smeared Joker', 'Four Fingers']),
			expectedPlayedHand: 'Flush Five',
			expectedScoringCards: [
				{ index: 0, rank: '10', suit: 'Spades' },
				{ index: 1, rank: '10', suit: 'Hearts' },
				{ index: 2, rank: '10', suit: 'Hearts' },
				{ index: 3, rank: '10', suit: 'Hearts' },
				{ index: 4, rank: '10', suit: 'Diamonds' },
			],
		},
		{
			message: 'Five of a Kind + Four Fingers = Flush Five',
			initialCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Diamonds' },
			],
			jokerSet: new Set(['Four Fingers']),
			expectedPlayedHand: 'Flush Five',
			expectedScoringCards: [
				{ index: 0, rank: '10', suit: 'Hearts' },
				{ index: 1, rank: '10', suit: 'Hearts' },
				{ index: 2, rank: '10', suit: 'Hearts' },
				{ index: 3, rank: '10', suit: 'Hearts' },
				{ index: 4, rank: '10', suit: 'Diamonds' },
			],
		},
		{
			message: 'Flush Five + Smeared Joker',
			initialCards: [
				{ rank: '10', suit: 'Diamonds' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
			],
			jokerSet: new Set(['Smeared Joker']),
			expectedPlayedHand: 'Flush Five',
			expectedScoringCards: [
				{ index: 0, rank: '10', suit: 'Diamonds' },
				{ index: 1, rank: '10', suit: 'Hearts' },
				{ index: 2, rank: '10', suit: 'Hearts' },
				{ index: 3, rank: '10', suit: 'Hearts' },
				{ index: 4, rank: '10', suit: 'Hearts' },
			],
		},
		{
			message: 'Flush Five',
			initialCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
			],
			expectedPlayedHand: 'Flush Five',
			expectedScoringCards: [
				{ index: 0, rank: '10', suit: 'Hearts' },
				{ index: 1, rank: '10', suit: 'Hearts' },
				{ index: 2, rank: '10', suit: 'Hearts' },
				{ index: 3, rank: '10', suit: 'Hearts' },
				{ index: 4, rank: '10', suit: 'Hearts' },
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
				{ index: 0, rank: '10', suit: 'Hearts' },
				{ index: 1, rank: '10', suit: 'Hearts' },
				{ index: 2, rank: '10', suit: 'Hearts' },
				{ index: 3, rank: '10', suit: 'Hearts' },
				{ index: 4, rank: '10', suit: 'Spades' },
			],
		},
		{
			message: 'Straight Flush + Four Fingers + Shortcut + Smeared Joker',
			initialCards: [
				{ rank: '8', suit: 'Spades' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '6', suit: 'Diamonds' },
				{ rank: '4', suit: 'Diamonds' },
				{ rank: '2', suit: 'Hearts' },
			],
			jokerSet: new Set(['Four Fingers', 'Shortcut', 'Smeared Joker']),
			expectedPlayedHand: 'Straight Flush',
			expectedScoringCards: [
				{ index: 0, rank: '8', suit: 'Spades' },
				{ index: 1, rank: '10', suit: 'Hearts' },
				{ index: 2, rank: '6', suit: 'Diamonds' },
				{ index: 3, rank: '4', suit: 'Diamonds' },
				{ index: 4, rank: '2', suit: 'Hearts' },
			],
		},
		{
			message: 'Straight Flush + Four Fingers + Shortcut',
			initialCards: [
				{ rank: '8', suit: 'Spades' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '6', suit: 'Hearts' },
				{ rank: '4', suit: 'Hearts' },
				{ rank: '2', suit: 'Hearts' },
			],
			jokerSet: new Set(['Four Fingers', 'Shortcut']),
			expectedPlayedHand: 'Straight Flush',
			expectedScoringCards: [
				{ index: 0, rank: '8', suit: 'Spades' },
				{ index: 1, rank: '10', suit: 'Hearts' },
				{ index: 2, rank: '6', suit: 'Hearts' },
				{ index: 3, rank: '4', suit: 'Hearts' },
				{ index: 4, rank: '2', suit: 'Hearts' },
			],
		},
		{
			message: 'Straight Flush + Four Fingers',
			initialCards: [
				{ rank: '9', suit: 'Spades' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '8', suit: 'Hearts' },
				{ rank: '7', suit: 'Hearts' },
				{ rank: '2', suit: 'Hearts' },
			],
			jokerSet: new Set(['Four Fingers']),
			expectedPlayedHand: 'Straight Flush',
			expectedScoringCards: [
				{ index: 0, rank: '9', suit: 'Spades' },
				{ index: 1, rank: '10', suit: 'Hearts' },
				{ index: 2, rank: '8', suit: 'Hearts' },
				{ index: 3, rank: '7', suit: 'Hearts' },
				{ index: 4, rank: '2', suit: 'Hearts' },
			],
		},
		{
			message: 'Straight Flush + Four Fingers + four cards only',
			initialCards: [
				{ rank: '9', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '8', suit: 'Hearts' },
				{ rank: '7', suit: 'Hearts' },
				{ rank: '2', suit: 'Diamonds' },
			],
			jokerSet: new Set(['Four Fingers']),
			expectedPlayedHand: 'Straight Flush',
			expectedScoringCards: [
				{ index: 0, rank: '9', suit: 'Hearts' },
				{ index: 1, rank: '10', suit: 'Hearts' },
				{ index: 2, rank: '8', suit: 'Hearts' },
				{ index: 3, rank: '7', suit: 'Hearts' },
			],
		},
		{
			message: 'Straight Flush',
			initialCards: [
				{ rank: '9', suit: 'Hearts' },
				{ rank: '10', suit: 'Hearts' },
				{ rank: '8', suit: 'Hearts' },
				{ rank: '7', suit: 'Hearts' },
				{ rank: '6', suit: 'Hearts' },
			],
			expectedPlayedHand: 'Straight Flush',
			expectedScoringCards: [
				{ index: 0, rank: '9', suit: 'Hearts' },
				{ index: 1, rank: '10', suit: 'Hearts' },
				{ index: 2, rank: '8', suit: 'Hearts' },
				{ index: 3, rank: '7', suit: 'Hearts' },
				{ index: 4, rank: '6', suit: 'Hearts' },
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
				{ index: 0, rank: '10', suit: 'Hearts' },
				{ index: 1, rank: '10', suit: 'Hearts' },
				{ index: 2, rank: '10', suit: 'Hearts' },
				{ index: 3, rank: '10', suit: 'Hearts' },
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
			jokerSet: new Set(['Smeared Joker']),
			expectedPlayedHand: 'Flush House',
			expectedScoringCards: [
				{ index: 0, rank: '10', suit: 'Clubs' },
				{ index: 1, rank: '10', suit: 'Clubs' },
				{ index: 2, rank: '10', suit: 'Clubs' },
				{ index: 3, rank: '2', suit: 'Spades' },
				{ index: 4, rank: '2', suit: 'Spades' },
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
				{ index: 0, rank: '10', suit: 'Hearts' },
				{ index: 1, rank: '10', suit: 'Hearts' },
				{ index: 2, rank: '10', suit: 'Hearts' },
				{ index: 3, rank: '2', suit: 'Hearts' },
				{ index: 4, rank: '2', suit: 'Hearts' },
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
				{ index: 0, rank: '10', suit: 'Hearts' },
				{ index: 1, rank: '10', suit: 'Hearts' },
				{ index: 2, rank: '10', suit: 'Hearts' },
				{ index: 3, rank: '2', suit: 'Hearts' },
				{ index: 4, rank: '2', suit: 'Spades' },
			],
		},
		{
			message: 'Flush + Four Fingers + wild enhancements',
			initialCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Clubs', enhancement: 'Wild' },
				{ rank: '3', suit: 'Diamonds' },
				{ rank: '2', suit: 'Diamonds', enhancement: 'Wild' },
				{ rank: 'King', suit: 'Spades' },
			],
			jokerSet: new Set(['Four Fingers', 'Smeared Joker']),
			expectedPlayedHand: 'Flush',
			expectedScoringCards: [
				{ index: 0, rank: '10', suit: 'Hearts' },
				{ index: 1, rank: '9', suit: 'Clubs', enhancement: 'Wild' },
				{ index: 2, rank: '3', suit: 'Diamonds' },
				{ index: 3, rank: '2', suit: 'Diamonds', enhancement: 'Wild' },
			],
		},
		{
			message: 'Flush + Four Fingers + wild enhancements',
			initialCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Clubs', enhancement: 'Wild' },
				{ rank: '3', suit: 'Hearts' },
				{ rank: '2', suit: 'Diamonds', enhancement: 'Wild' },
				{ rank: 'King', suit: 'Spades' },
			],
			jokerSet: new Set(['Four Fingers']),
			expectedPlayedHand: 'Flush',
			expectedScoringCards: [
				{ index: 0, rank: '10', suit: 'Hearts' },
				{ index: 1, rank: '9', suit: 'Clubs', enhancement: 'Wild' },
				{ index: 2, rank: '3', suit: 'Hearts' },
				{ index: 3, rank: '2', suit: 'Diamonds', enhancement: 'Wild' },
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
			jokerSet: new Set(['Four Fingers']),
			expectedPlayedHand: 'Flush',
			expectedScoringCards: [
				{ index: 0, rank: '10', suit: 'Hearts' },
				{ index: 1, rank: '9', suit: 'Hearts' },
				{ index: 2, rank: '3', suit: 'Hearts' },
				{ index: 3, rank: '2', suit: 'Hearts' },
			],
		},
		{
			message: 'Flush + Four Fingers + stone card',
			initialCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Hearts' },
				{ rank: '3', suit: 'Hearts' },
				{ rank: '2', suit: 'Hearts' },
				{ rank: 'King', suit: 'Spades', enhancement: 'Stone' },
			],
			jokerSet: new Set(['Four Fingers']),
			expectedPlayedHand: 'Flush',
			expectedScoringCards: [
				{ index: 0, rank: '10', suit: 'Hearts' },
				{ index: 1, rank: '9', suit: 'Hearts' },
				{ index: 2, rank: '3', suit: 'Hearts' },
				{ index: 3, rank: '2', suit: 'Hearts' },
				{ index: 4, rank: 'King', suit: 'Spades', enhancement: 'Stone' },
			],
		},
		{
			message: 'Flush + Smeared Joker + wild enhancements',
			initialCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Clubs', enhancement: 'Wild' },
				{ rank: '3', suit: 'Hearts' },
				{ rank: '2', suit: 'Diamonds', enhancement: 'Wild' },
				{ rank: 'King', suit: 'Diamonds' },
			],
			jokerSet: new Set(['Smeared Joker']),
			expectedPlayedHand: 'Flush',
			expectedScoringCards: [
				{ index: 0, rank: '10', suit: 'Hearts' },
				{ index: 1, rank: '9', suit: 'Clubs', enhancement: 'Wild' },
				{ index: 2, rank: '3', suit: 'Hearts' },
				{ index: 3, rank: '2', suit: 'Diamonds', enhancement: 'Wild' },
				{ index: 4, rank: 'King', suit: 'Diamonds' },
			],
		},
		{
			message: 'Flush + wild enhancements',
			initialCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Clubs', enhancement: 'Wild' },
				{ rank: '3', suit: 'Hearts' },
				{ rank: '2', suit: 'Diamonds', enhancement: 'Wild' },
				{ rank: 'King', suit: 'Hearts' },
			],
			expectedPlayedHand: 'Flush',
			expectedScoringCards: [
				{ index: 0, rank: '10', suit: 'Hearts' },
				{ index: 1, rank: '9', suit: 'Clubs', enhancement: 'Wild' },
				{ index: 2, rank: '3', suit: 'Hearts' },
				{ index: 3, rank: '2', suit: 'Diamonds', enhancement: 'Wild' },
				{ index: 4, rank: 'King', suit: 'Hearts' },
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
			jokerSet: new Set(['Smeared Joker']),
			expectedPlayedHand: 'Flush',
			expectedScoringCards: [
				{ index: 0, rank: '10', suit: 'Hearts' },
				{ index: 1, rank: '9', suit: 'Hearts' },
				{ index: 2, rank: '3', suit: 'Hearts' },
				{ index: 3, rank: '2', suit: 'Diamonds' },
				{ index: 4, rank: 'King', suit: 'Diamonds' },
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
				{ index: 0, rank: '10', suit: 'Hearts' },
				{ index: 1, rank: '9', suit: 'Hearts' },
				{ index: 2, rank: '3', suit: 'Hearts' },
				{ index: 3, rank: '2', suit: 'Hearts' },
				{ index: 4, rank: 'King', suit: 'Hearts' },
			],
		},
		{
			message: 'High straight',
			initialCards: [
				{ rank: 'King', suit: 'Clubs' },
				{ rank: 'Queen', suit: 'Clubs' },
				{ rank: 'Ace', suit: 'Hearts' },
				{ rank: 'Jack', suit: 'Spades' },
				{ rank: '10', suit: 'Diamonds' },
			],
			expectedPlayedHand: 'Straight',
			expectedScoringCards: [
				{ index: 0, rank: 'King', suit: 'Clubs' },
				{ index: 1, rank: 'Queen', suit: 'Clubs' },
				{ index: 2, rank: 'Ace', suit: 'Hearts' },
				{ index: 3, rank: 'Jack', suit: 'Spades' },
				{ index: 4, rank: '10', suit: 'Diamonds' },
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
				{ index: 0, rank: '5', suit: 'Clubs' },
				{ index: 1, rank: '4', suit: 'Clubs' },
				{ index: 2, rank: 'Ace', suit: 'Hearts' },
				{ index: 3, rank: '2', suit: 'Spades' },
				{ index: 4, rank: '3', suit: 'Diamonds' },
			],
		},
		{
			message: 'Not a low straight',
			initialCards: [
				{ rank: 'King', suit: 'Clubs' },
				{ rank: '4', suit: 'Clubs' },
				{ rank: 'Ace', suit: 'Hearts' },
				{ rank: '2', suit: 'Spades' },
				{ rank: '3', suit: 'Diamonds' },
			],
			expectedPlayedHand: 'High Card',
			expectedScoringCards: [
				{ index: 2, rank: 'Ace', suit: 'Hearts' },
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
			jokerSet: new Set(['Four Fingers', 'Shortcut']),
			expectedPlayedHand: 'Straight',
			expectedScoringCards: [
				{ index: 0, rank: '4', suit: 'Clubs' },
				{ index: 1, rank: '5', suit: 'Clubs' },
				{ index: 2, rank: '7', suit: 'Hearts' },
				{ index: 3, rank: '3', suit: 'Diamonds' },
				{ index: 4, rank: '2', suit: 'Spades' },
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
			jokerSet: new Set(['Four Fingers']),
			expectedPlayedHand: 'Straight',
			expectedScoringCards: [
				{ index: 0, rank: '4', suit: 'Clubs' },
				{ index: 1, rank: '5', suit: 'Clubs' },
				{ index: 3, rank: '3', suit: 'Diamonds' },
				{ index: 4, rank: '2', suit: 'Spades' },
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
			jokerSet: new Set(['Shortcut']),
			expectedPlayedHand: 'Straight',
			expectedScoringCards: [
				{ index: 0, rank: '6', suit: 'Clubs' },
				{ index: 1, rank: '8', suit: 'Clubs' },
				{ index: 2, rank: '10', suit: 'Hearts' },
				{ index: 3, rank: '2', suit: 'Spades' },
				{ index: 4, rank: '4', suit: 'Diamonds' },
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
				{ index: 0, rank: '6', suit: 'Hearts' },
				{ index: 1, rank: '5', suit: 'Clubs' },
				{ index: 2, rank: '4', suit: 'Clubs' },
				{ index: 3, rank: '3', suit: 'Diamonds' },
				{ index: 4, rank: '2', suit: 'Spades' },
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
				{ index: 0, rank: 'King', suit: 'Hearts' },
				{ index: 1, rank: 'King', suit: 'Clubs' },
				{ index: 2, rank: 'King', suit: 'Clubs' },
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
				{ index: 0, rank: 'King', suit: 'Hearts' },
				{ index: 1, rank: 'King', suit: 'Clubs' },
				{ index: 2, rank: '7', suit: 'Clubs' },
				{ index: 3, rank: '7', suit: 'Diamonds' },
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
				{ index: 0, rank: 'King', suit: 'Hearts' },
				{ index: 1, rank: 'King', suit: 'Clubs' },
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
				{ index: 1, rank: 'Ace', suit: 'Hearts' },
			],
		},
		{
			message: 'High card + stone card',
			initialCards: [
				{ rank: 'King', suit: 'Clubs', enhancement: 'Stone' },
				{ rank: 'Ace', suit: 'Hearts' },
				{ rank: '7', suit: 'Clubs' },
			],
			expectedPlayedHand: 'High Card',
			expectedScoringCards: [
				{ index: 0, rank: 'King', suit: 'Clubs', enhancement: 'Stone' },
				{ index: 1, rank: 'Ace', suit: 'Hearts' },
			],
		},
		{
			message: 'Almost Flush + Four Fingers + stone cards',
			initialCards: [
				{ rank: '10', suit: 'Hearts' },
				{ rank: '9', suit: 'Hearts' },
				// This card breaks up the Flush because it has stone enhancement.
				{ rank: '3', suit: 'Hearts', enhancement: 'Stone' },
				{ rank: '2', suit: 'Hearts' },
				{ rank: 'King', suit: 'Spades', enhancement: 'Stone' },
			],
			jokerSet: new Set(['Four Fingers']),
			expectedPlayedHand: 'High Card',
			expectedScoringCards: [
				{ index: 0, rank: '10', suit: 'Hearts' },
				{ index: 2, rank: '3', suit: 'Hearts', enhancement: 'Stone' },
				{ index: 4, rank: 'King', suit: 'Spades', enhancement: 'Stone' },
			],
		},
		{
			message: 'Straight Flush (regression test for #27)',
			initialCards: [
				{ rank: 'Ace', suit: 'Spades' },
				{ rank: '8', suit: 'Spades' },
				{ rank: '7', suit: 'Spades' },
				{ rank: '6', suit: 'Spades' },
				{ rank: '5', suit: 'Spades' },
			],
			jokerSet: new Set(['Four Fingers']),
			expectedPlayedHand: 'Straight Flush',
			expectedScoringCards: [
				{ index: 0, rank: 'Ace', suit: 'Spades' },
				{ index: 1, rank: '8', suit: 'Spades' },
				{ index: 2, rank: '7', suit: 'Spades' },
				{ index: 3, rank: '6', suit: 'Spades' },
				{ index: 4, rank: '5', suit: 'Spades' },
			],
		},
		{
			message: 'Straight (regression test for #27)',
			initialCards: [
				{ rank: '6', suit: 'Spades' },
				{ rank: '5', suit: 'Spades' },
				{ rank: '4', suit: 'Hearts' },
				{ rank: '3', suit: 'Hearts' },
				{ rank: '4', suit: 'Hearts' },
			],
			jokerSet: new Set(['Four Fingers']),
			expectedPlayedHand: 'Straight',
			expectedScoringCards: [
				{ index: 0, rank: '6', suit: 'Spades' },
				{ index: 1, rank: '5', suit: 'Spades' },
				{ index: 2, rank: '4', suit: 'Hearts' },
				{ index: 3, rank: '3', suit: 'Hearts' },
				{ index: 4, rank: '4', suit: 'Hearts' },
			],
		},
	])('$message', ({ initialCards, jokerSet, expectedPlayedHand, expectedScoringCards }) => {
		const cards = initialCards.map(getCard)

		const { playedHand, scoringCards } = getHand(cards, jokerSet ?? new Set())

		expect(playedHand).toBe(expectedPlayedHand)

		// Map the expected scoring cards (which are of type `InitialCard`) to complete scoring cards (of type `Card`) by using their index as the key in a find predicate. This way, we can use `toStrictEqual` assertions below.
		const completeExpectedScoringCards = expectedScoringCards.map(({ index }) => {
			return scoringCards.find((scoringCard) => scoringCard.index === index)!
		})
		expect(scoringCards).toStrictEqual(completeExpectedScoringCards)
		expect(scoringCards.length).toBe(expectedScoringCards.length)
	})
})
