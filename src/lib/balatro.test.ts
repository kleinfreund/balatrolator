import { describe, test, expect } from 'vitest'

import { calculateScore } from './balatro.js'
import { InitialCard } from './types.js'

type Expected = Omit<ReturnType<typeof calculateScore>, 'scoringCards'> & { scoringCards: InitialCard[] }

type TestCase = {
	message: string
	parameters: Parameters<typeof calculateScore>
	expected: Expected
}

describe('calculateScore', () => {
	test.each<TestCase>([
		{
			message: 'Two pair',
			parameters: [{
				playedCards: [
					{ rank: 'King', suit: 'Hearts' },
					{ rank: 'King', suit: 'Clubs' },
					{ rank: '7', suit: 'Clubs' },
					{ rank: '7', suit: 'Diamonds' },
					{ rank: '5', suit: 'Spades' },
				],
			}],
			expected: {
				hand: 'Two Pair',
				scoringCards: [
					{ rank: 'King', suit: 'Hearts' },
					{ rank: 'King', suit: 'Clubs' },
					{ rank: '7', suit: 'Clubs' },
					{ rank: '7', suit: 'Diamonds' },
				],
				score: 108,
				formattedScore: '108',
			},
		},
		{
			message: 'Two pair + enhancements',
			parameters: [{
				playedCards: [
					{ rank: 'Ace', suit: 'Clubs' },
					{ rank: 'Ace', suit: 'Diamonds' },
					{ rank: '4', suit: 'Spades' },
					{ rank: '4', suit: 'Hearts', edition: 'holographic' },
				],
			}],
			expected: {
				hand: 'Two Pair',
				scoringCards: [
					{ rank: 'Ace', suit: 'Clubs' },
					{ rank: 'Ace', suit: 'Diamonds' },
					{ rank: '4', suit: 'Spades' },
					{ rank: '4', suit: 'Hearts', edition: 'holographic' },
				],
				score: 600,
				formattedScore: '600',
			},
		},
		{
			message: 'TODO',
			parameters: [{
				playedCards: [
					{ rank: '7', suit: 'Hearts', enhancement: 'bonus' },
				],
				heldCards: [
					{ rank: '3', suit: 'Spades', enhancement: 'steel' },
				],
				jokers: [
					{ name: 'Supernova' },
				],
				handLevels: {
					'High Card': {
						level: 1,
						plays: 1,
					},
				},
			}],
			expected: {
				hand: 'High Card',
				scoringCards: [
					{ rank: '7', suit: 'Hearts', enhancement: 'bonus' },
				],
				score: 147,
				formattedScore: '147',
			},
		},
		{
			message: 'TODO',
			parameters: [{
				playedCards: [
					{ rank: 'Ace', suit: 'Diamonds' },
					{ rank: '10', suit: 'Diamonds' },
					{ rank: '8', suit: 'Diamonds' },
					{ rank: '7', suit: 'Diamonds' },
					{ rank: '6', suit: 'Diamonds' },
				],
				heldCards: [
					{ rank: '3', suit: 'Spades', enhancement: 'steel' },
				],
				jokers: [
					{ name: 'Supernova' },
				],
			}],
			expected: {
				hand: 'Flush',
				scoringCards: [
					{ rank: 'Ace', suit: 'Diamonds' },
					{ rank: '10', suit: 'Diamonds' },
					{ rank: '8', suit: 'Diamonds' },
					{ rank: '7', suit: 'Diamonds' },
					{ rank: '6', suit: 'Diamonds' },
				],
				score: 539,
				formattedScore: '539',
			},
		},
		{
			message: 'TODO',
			parameters: [{
				playedCards: [
					{ rank: 'Queen', suit: 'Diamonds', isDebuffed: true },
					{ rank: '10', suit: 'Hearts' },
					{ rank: '8', suit: 'Spades' },
				],
				heldCards: [
					{ rank: '7', suit: 'Hearts', enhancement: 'bonus' },
					{ rank: '4', suit: 'Spades', edition: 'holographic' },
					{ rank: '4', suit: 'Clubs' },
					{ rank: '2', suit: 'Spades', enhancement: 'steel' },
					{ rank: '2', suit: 'Hearts', enhancement: 'steel' },
				],
				jokers: [
					{ name: 'Supernova' },
				],
			}],
			expected: {
				hand: 'High Card',
				scoringCards: [
					{ rank: 'Queen', suit: 'Diamonds', isDebuffed: true },
				],
				score: 16.25,
				formattedScore: '16',
			},
		},
		{
			message: 'TODO',
			parameters: [{
				playedCards: [
					{ rank: '8', suit: 'Spades' },
					{ rank: '7', suit: 'Spades' },
					{ rank: '7', suit: 'Hearts', isDebuffed: true },
					{ rank: '5', suit: 'Spades' },
					{ rank: '2', suit: 'Spades' },
				],
				jokers: [
					{ name: 'Sly Joker' },
				],
			}],
			expected: {
				hand: 'Pair',
				scoringCards: [
					{ rank: '7', suit: 'Spades' },
					{ rank: '7', suit: 'Hearts', isDebuffed: true },
				],
				score: 134,
				formattedScore: '134',
			},
		},
		{
			message: 'TODO',
			parameters: [{
				money: 1,
				playedCards: [
					{ rank: '6', suit: 'Hearts' },
					{ rank: '6', suit: 'Diamonds' },
					{ rank: '4', suit: 'Spades' },
					{ rank: '4', suit: 'Hearts' },
					{ rank: '4', suit: 'Clubs' },
				],
				jokers: [
					{ name: 'Sly Joker' },
					{ name: 'Even Steven' },
					{ name: 'Bootstraps' },
					{ name: 'Joker' },
					{ name: 'Superposition' },
				],
			}],
			expected: {
				hand: 'Full House',
				scoringCards: [
					{ rank: '6', suit: 'Hearts' },
					{ rank: '6', suit: 'Diamonds' },
					{ rank: '4', suit: 'Spades' },
					{ rank: '4', suit: 'Hearts' },
					{ rank: '4', suit: 'Clubs' },
				],
				score: 3192,
				formattedScore: '3,192',
			},
		},
		{
			message: 'TODO',
			parameters: [{
				money: 5,
				playedCards: [
					{ rank: 'Queen', suit: 'Diamonds', enhancement: 'wild' },
					{ rank: 'Jack', suit: 'Clubs' },
					{ rank: '10', suit: 'Diamonds' },
					{ rank: '9', suit: 'Spades' },
					{ rank: '8', suit: 'Spades' },
				],
				heldCards: [
					{ rank: '5', suit: 'Diamonds', enhancement: 'steel' },
				],
				jokers: [
					{ name: 'Sly Joker' },
					{ name: 'Even Steven' },
					{ name: 'Bootstraps' },
					{ name: 'Joker' },
					{ name: 'Crazy Joker' },
				],
			}],
			expected: {
				hand: 'Straight',
				scoringCards: [
					{ rank: 'Queen', suit: 'Diamonds', enhancement: 'wild' },
					{ rank: 'Jack', suit: 'Clubs' },
					{ rank: '10', suit: 'Diamonds' },
					{ rank: '9', suit: 'Spades' },
					{ rank: '8', suit: 'Spades' },
				],
				score: 2772,
				formattedScore: '2,772',
			},
		},
		{
			message: 'Flush + glass + steel',
			parameters: [{
				money: 17,
				playedCards: [
					{ rank: 'King', suit: 'Hearts' },
					{ rank: '10', suit: 'Hearts', enhancement: 'glass' },
					{ rank: '6', suit: 'Hearts' },
					{ rank: '4', suit: 'Hearts' },
					{ rank: '2', suit: 'Hearts' },
				],
				heldCards: [
					{ rank: '5', suit: 'Diamonds', enhancement: 'steel' },
				],
				jokers: [
					{ name: 'Even Steven' },
					{ name: 'Bootstraps' },
					{ name: 'Joker' },
					{ name: 'Crazy Joker' },
					{ name: 'Splash' },
				],
			}],
			expected: {
				hand: 'Flush',
				scoringCards: [
					{ rank: 'King', suit: 'Hearts' },
					{ rank: '10', suit: 'Hearts', enhancement: 'glass' },
					{ rank: '6', suit: 'Hearts' },
					{ rank: '4', suit: 'Hearts' },
					{ rank: '2', suit: 'Hearts' },
				],
				score: 3082,
				formattedScore: '3,082',
			},
		},
		{
			message: 'Two pair + stone',
			parameters: [{
				money: 16,
				playedCards: [
					{ rank: '10', suit: 'Spades' },
					{ rank: '10', suit: 'Clubs' },
					{ rank: '8', suit: 'Spades', enhancement: 'stone' },
					{ rank: '6', suit: 'Spades' },
					{ rank: '6', suit: 'Spades' },
				],
				heldCards: [],
				jokers: [
					{ name: 'Even Steven', plusChips: 1 },
					{ name: 'Bootstraps' },
					{ name: 'Joker' },
					{ name: 'Crazy Joker' },
					{ name: 'Splash' },
				],
			}],
			expected: {
				hand: 'Two Pair',
				scoringCards: [
					{ rank: '10', suit: 'Spades' },
					{ rank: '10', suit: 'Clubs' },
					{ rank: '8', suit: 'Spades', enhancement: 'stone' },
					{ rank: '6', suit: 'Spades' },
					{ rank: '6', suit: 'Spades' },
				],
				score: 2856,
				formattedScore: '2,856',
			},
		},
		{
			message: 'Five of a kind 1',
			parameters: [{
				playedCards: [
					{ rank: '5', suit: 'Hearts' },
					{ rank: '5', suit: 'Clubs' },
					{ rank: '5', suit: 'Clubs' },
					{ rank: '5', suit: 'Clubs' },
					{ rank: '5', suit: 'Spades', enhancement: 'glass', seal: 'red' },
				],
				heldCards: [],
				jokers: [
					{ name: 'Sixth Sense' },
					{ name: 'Odd Todd' },
					{ name: 'Swashbuckler', edition: 'foil', plusMult: 5 },
					{ name: 'Ceremonial Dagger', plusMult: 0 },
				],
			}],
			expected: {
				hand: 'Five of a Kind',
				scoringCards: [
					{ rank: '5', suit: 'Hearts' },
					{ rank: '5', suit: 'Clubs' },
					{ rank: '5', suit: 'Clubs' },
					{ rank: '5', suit: 'Clubs' },
					{ rank: '5', suit: 'Spades', enhancement: 'glass', seal: 'red' },
				],
				score: 20140,
				formattedScore: '20,140',
			},
		},
		{
			message: 'Five of a kind 2',
			parameters: [{
				playedCards: [
					{ rank: '5', suit: 'Clubs' },
					{ rank: '5', suit: 'Diamonds' },
					{ rank: '5', suit: 'Diamonds' },
					{ rank: '5', suit: 'Diamonds' },
					{ rank: '5', suit: 'Spades', seal: 'red' },
				],
				heldCards: [],
				jokers: [
					{ name: 'Sixth Sense' },
					{ name: 'Odd Todd' },
					{ name: 'Fortune Teller', plusMult: 9 },
					{ name: 'Swashbuckler', edition: 'foil', plusMult: 8 },
					{ name: 'Ceremonial Dagger', plusMult: 6 },
				],
			}],
			expected: {
				hand: 'Five of a Kind',
				scoringCards: [
					{ rank: '5', suit: 'Clubs' },
					{ rank: '5', suit: 'Diamonds' },
					{ rank: '5', suit: 'Diamonds' },
					{ rank: '5', suit: 'Diamonds' },
					{ rank: '5', suit: 'Spades', seal: 'red' },
				],
				score: 13300,
				formattedScore: '13,300',
			},
		},
		{
			message: 'Five of a kind 3',
			parameters: [{
				playedCards: [
					{ rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
					{ rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
					{ rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
					{ rank: '5', suit: 'Hearts', enhancement: 'mult' },
					{ rank: '5', suit: 'Clubs', seal: 'gold' },
				],
				heldCards: [],
				jokers: [
					{ name: 'Sixth Sense' },
					{ name: 'Odd Todd' },
					{ name: 'Smiley Face' },
					{ name: 'Pareidolia', edition: 'polychrome' },
					{ name: 'Swashbuckler', edition: 'foil', plusMult: 12 },
				],
				handLevels: {
					'Five of a Kind': {
						level: 2,
						plays: 11,
					},
				},
			}],
			expected: {
				hand: 'Five of a Kind',
				scoringCards: [
					{ rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
					{ rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
					{ rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
					{ rank: '5', suit: 'Hearts', enhancement: 'mult' },
					{ rank: '5', suit: 'Clubs', seal: 'gold' },
				],
				score: 60382,
				formattedScore: '60,382',
			},
		},
		{
			message: 'Flush Five 1',
			parameters: [{
				playedCards: [
					{ rank: '5', suit: 'Spades', enhancement: 'mult' },
					{ rank: '5', suit: 'Spades', enhancement: 'mult' },
					{ rank: '5', suit: 'Spades', enhancement: 'mult' },
					{ rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
					{ rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
				],
				heldCards: [],
				jokers: [
					{ name: 'Sixth Sense' },
					{ name: 'Smiley Face' },
					{ name: 'Pareidolia', edition: 'polychrome' },
					{ name: 'The Family' },
					{ name: 'Swashbuckler', edition: 'foil', plusMult: 14 },
				],
				handLevels: {
					'Flush Five': {
						level: 1,
						plays: 0,
					},
				},
			}],
			expected: {
				hand: 'Flush Five',
				scoringCards: [
					{ rank: '5', suit: 'Spades', enhancement: 'mult' },
					{ rank: '5', suit: 'Spades', enhancement: 'mult' },
					{ rank: '5', suit: 'Spades', enhancement: 'mult' },
					{ rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
					{ rank: '5', suit: 'Spades', enhancement: 'mult', seal: 'red' },
				],
				score: 109270,
				formattedScore: '109,270',
			},
		},
		{
			message: 'Flush Five 2',
			parameters: [{
				playedCards: [
					{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
					{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
					{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
					{ rank: 'Queen', suit: 'Diamonds' },
					{ rank: 'Queen', suit: 'Diamonds', enhancement: 'glass' },
				],
				heldCards: [
					{ rank: 'King', suit: 'Hearts', enhancement: 'gold' },
					{ rank: 'King', suit: 'Diamonds', enhancement: 'gold' },
				],
				jokers: [
					{ name: 'Mime', edition: 'polychrome' },
					{ name: 'Castle', plusChips: 78 },
					{ name: 'Blueprint' },
					{ name: 'Baseball Card' },
					{ name: 'Baron' },
				],
				handLevels: {
					'Flush Five': {
						level: 1,
						plays: 0,
					},
				},
			}],
			expected: {
				hand: 'Flush Five',
				scoringCards: [
					{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
					{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
					{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
					{ rank: 'Queen', suit: 'Diamonds' },
					{ rank: 'Queen', suit: 'Diamonds', enhancement: 'glass' },
				],
				score: 354294,
				formattedScore: '354,294',
			},
		},
		{
			message: 'Flush Five 3',
			parameters: [{
				blind: 'The Flint',
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
				jokers: [
					{ name: 'Mime', edition: 'polychrome' },
					{ name: 'Castle', plusChips: 81 },
					{ name: 'Blueprint' },
					{ name: 'Baseball Card' },
					{ name: 'Baron' },
				],
				handLevels: {
					'Flush House': {
						level: 2,
						plays: 2,
					},
				},
			}],
			expected: {
				hand: 'Flush House',
				scoringCards: [
					{ rank: 'King', suit: 'Diamonds', enhancement: 'gold' },
					{ rank: 'King', suit: 'Diamonds', enhancement: 'gold' },
					{ rank: 'Queen', suit: 'Diamonds', enhancement: 'gold' },
					{ rank: 'Queen', suit: 'Diamonds', enhancement: 'glass' },
					{ rank: 'Queen', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
				],
				score: 284173,
				formattedScore: '284,173',
			},
		},
		{
			message: 'Flush Five (played by haelian on 2024-02-26 18:13 UTC)',
			parameters: [{
				blind: 'Big Blind',
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
					{ name: 'Hologram', timesMult: 12.25 },
					{ name: 'The Family' },
					{ name: 'Glass Joker', timesMult: 5.5 },
				],
				handLevels: {
					'Flush Five': {
						level: 11,
						plays: 0,
					},
				},
			}],
			expected: {
				hand: 'Flush Five',
				scoringCards: [
					{ rank: 'Ace', suit: 'Diamonds', seal: 'red' },
					{ rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
					{ rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
					{ rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
					{ rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
				],
				score: 11_287_462_454_231_040,
				formattedScore: '1.129e16',
			},
		},
	])('$message', ({ parameters, expected }) => {
		expect(calculateScore(...parameters)).toMatchObject(expected)
	})
})
