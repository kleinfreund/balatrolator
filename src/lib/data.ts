import { balanceMultWithLuck } from './balanceMultWithLuck.ts'
import { flush, nOfAKind, straight, twoPair } from './getHand.ts'
import { isFaceCard, isRank, isSuit } from './cards.ts'
import type { BaseScore, BlindName, Card, DeckName, Edition, Enhancement, HandName, JokerDefinition, JokerEdition, JokerName, Luck, Rank, Seal, Suit } from './types.ts'
import { resolveJoker } from './resolveJokers.ts'

export const BLINDS: BlindName[] = ['Small Blind', 'Big Blind', 'The Hook', 'The Ox', 'The House', 'The Wall', 'The Wheel', 'The Arm', 'The Club', 'The Fish', 'The Psychic', 'The Goad', 'The Water', 'The Window', 'The Manacle', 'The Eye', 'The Mouth', 'The Plant', 'The Serpent', 'The Pillar', 'The Needle', 'The Head', 'The Tooth', 'The Flint', 'The Mark', 'Amber Acorn', 'Verdant Leaf', 'Violet Vessel', 'Crimson Heart', 'Cerulean Bell']

export const DECKS: DeckName[] = ['Red Deck', 'Blue Deck', 'Yellow Deck', 'Green Deck', 'Black Deck', 'Magic Deck', 'Nebula Deck', 'Ghost Deck', 'Abandoned Deck', 'Checkered Deck', 'Zodiac Deck', 'Painted Deck', 'Anaglyph Deck', 'Plasma Deck', 'Erratic Deck', 'Challenge Deck']

export const HANDS: HandName[] = ['Flush Five', 'Flush House', 'Five of a Kind', 'Straight Flush', 'Four of a Kind', 'Full House', 'Flush', 'Straight', 'Three of a Kind', 'Two Pair', 'Pair', 'High Card']

export const ENHANCEMENTS: Enhancement[] = ['None', 'Bonus', 'Mult', 'Wild', 'Glass', 'Steel', 'Stone', 'Gold', 'Lucky']
export const SEALS: Seal[] = ['None', 'Gold', 'Red', 'Blue', 'Purple']
export const EDITIONS: Edition[] = ['Base', 'Foil', 'Holographic', 'Polychrome']
export const JOKER_EDITIONS: JokerEdition[] = ['Base', 'Foil', 'Holographic', 'Polychrome', 'Negative']

export const RANKS: Rank[] = ['Ace', 'King', 'Queen', 'Jack', '10', '9', '8', '7', '6', '5', '4', '3', '2']
export const SUITS: Suit[] = ['Clubs', 'Spades', 'Hearts', 'Diamonds']

export const LUCKS: Luck[] = ['none', 'average', 'all']

export const PLANET_SCORE_SETS: Record<HandName, BaseScore> = {
	'Flush Five': { chips: 50, multiplier: 3 },
	'Flush House': { chips: 40, multiplier: 4 },
	'Five of a Kind': { chips: 35, multiplier: 3 },
	'Straight Flush': { chips: 40, multiplier: 4 },
	'Four of a Kind': { chips: 30, multiplier: 3 },
	'Full House': { chips: 25, multiplier: 2 },
	'Flush': { chips: 15, multiplier: 2 },
	'Straight': { chips: 30, multiplier: 3 },
	'Three of a Kind': { chips: 20, multiplier: 2 },
	'Two Pair': { chips: 20, multiplier: 1 },
	'Pair': { chips: 15, multiplier: 1 },
	'High Card': { chips: 10, multiplier: 1 },
}

export const DEFAULT_HAND_SCORE_SETS: Record<HandName, BaseScore> = {
	'Flush Five': { chips: 160, multiplier: 16 },
	'Flush House': { chips: 140, multiplier: 14 },
	'Five of a Kind': { chips: 120, multiplier: 12 },
	'Straight Flush': { chips: 100, multiplier: 8 },
	'Four of a Kind': { chips: 60, multiplier: 7 },
	'Full House': { chips: 40, multiplier: 4 },
	'Flush': { chips: 35, multiplier: 4 },
	'Straight': { chips: 30, multiplier: 4 },
	'Three of a Kind': { chips: 30, multiplier: 3 },
	'Two Pair': { chips: 20, multiplier: 2 },
	'Pair': { chips: 10, multiplier: 2 },
	'High Card': { chips: 5, multiplier: 1 },
}

export const RANK_TO_CHIP_MAP: Record<Rank, number> = {
	'Ace': 11,
	'King': 10,
	'Queen': 10,
	'Jack': 10,
	'10': 10,
	'9': 9,
	'8': 8,
	'7': 7,
	'6': 6,
	'5': 5,
	'4': 4,
	'3': 3,
	'2': 2,
}

export const RANK_TO_INDEX_MAP: Record<Rank, number> = {
	'Ace': 14,
	'King': 13,
	'Queen': 12,
	'Jack': 11,
	'10': 10,
	'9': 9,
	'8': 8,
	'7': 7,
	'6': 6,
	'5': 5,
	'4': 4,
	'3': 3,
	'2': 2,
}

export const PLAYED_CARD_RETRIGGER_JOKER_NAMES: JokerName[] = [
	'Seltzer',
	'Sock and Buskin',
	'Dusk',
	'Hanging Chad',
	'Hack',
]
export const HELD_CARD_RETRIGGER_JOKER_NAMES: JokerName[] = [
	'Mime',
]

export const JOKER_DEFINITIONS: Record<JokerName, JokerDefinition> = {
	'Joker': {
		rarity: 'common',
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['+', 4],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Greedy Joker': {
		rarity: 'common',
		playedCardEffect ({ state, score, card, trigger }) {
			score.push({
				multiplier: ['+', isSuit(card, 'Diamonds', state.jokerSet) ? 3 : 0],
				phase: 'played-cards',
				card,
				joker: this,
				trigger,
			})
		},
	},
	'Lusty Joker': {
		rarity: 'common',
		playedCardEffect ({ state, score, card, trigger }) {
			score.push({
				multiplier: ['+', isSuit(card, 'Hearts', state.jokerSet) ? 3 : 0],
				phase: 'played-cards',
				card,
				joker: this,
				trigger,
			})
		},
	},
	'Wrathful Joker': {
		rarity: 'common',
		playedCardEffect ({ state, score, card, trigger }) {
			score.push({
				multiplier: ['+', isSuit(card, 'Spades', state.jokerSet) ? 3 : 0],
				phase: 'played-cards',
				card,
				joker: this,
				trigger,
			})
		},
	},
	'Gluttonous Joker': {
		rarity: 'common',
		playedCardEffect ({ state, score, card, trigger }) {
			score.push({
				multiplier: ['+', isSuit(card, 'Clubs', state.jokerSet) ? 3 : 0],
				phase: 'played-cards',
				card,
				joker: this,
				trigger,
			})
		},
	},
	'Jolly Joker': {
		rarity: 'common',
		effect ({ state, score, trigger }) {
			const cards = nOfAKind(state.cards.filter(({ played }) => played), 2)
			score.push({
				multiplier: ['+', cards.length > 0 ? 8 : 0],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Zany Joker': {
		rarity: 'common',
		effect ({ state, score, trigger }) {
			const cards = nOfAKind(state.cards.filter(({ played }) => played), 3)
			score.push({
				multiplier: ['+', cards.length > 0 ? 8 : 0],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Mad Joker': {
		rarity: 'common',
		effect ({ state, score, trigger }) {
			const cards = twoPair(state.cards.filter(({ played }) => played))
			score.push({
				multiplier: ['+', cards.length > 0 ? 8 : 0],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Crazy Joker': {
		rarity: 'common',
		effect ({ state, score, trigger }) {
			const cards = straight(state.cards.filter(({ played }) => played), state.jokerSet)
			score.push({
				multiplier: ['+', cards.length > 0 ? 12 : 0],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Droll Joker': {
		rarity: 'common',
		effect ({ state, score, trigger }) {
			const cards = flush(state.cards.filter(({ played }) => played), state.jokerSet)
			score.push({
				multiplier: ['+', cards.length > 0 ? 10 : 0],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Sly Joker': {
		rarity: 'common',
		effect ({ state, score, trigger }) {
			const cards = nOfAKind(state.cards.filter(({ played }) => played), 2)
			score.push({
				chips: ['+', cards.length > 0 ? 50 : 0],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Wily Joker': {
		rarity: 'common',
		effect ({ state, score, trigger }) {
			const cards = nOfAKind(state.cards.filter(({ played }) => played), 3)
			score.push({
				chips: ['+', cards.length > 0 ? 100 : 0],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Clever Joker': {
		rarity: 'common',
		effect ({ state, score, trigger }) {
			const cards = twoPair(state.cards.filter(({ played }) => played))
			score.push({
				chips: ['+', cards.length > 0 ? 150 : 0],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Devious Joker': {
		rarity: 'common',
		effect ({ state, score, trigger }) {
			const cards = straight(state.cards.filter(({ played }) => played), state.jokerSet)
			score.push({
				chips: ['+', cards.length > 0 ? 100 : 0],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Crafty Joker': {
		rarity: 'common',
		effect ({ state, score, trigger }) {
			const cards = flush(state.cards.filter(({ played }) => played), state.jokerSet)
			score.push({
				chips: ['+', cards.length > 0 ? 80 : 0],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Half Joker': {
		rarity: 'common',
		effect ({ state, score, trigger }) {
			score.push({
				multiplier: ['+', state.cards.filter(({ played }) => played).length <= 3 ? 20 : 0],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Joker Stencil': {
		rarity: 'uncommon',
		effect ({ state, score, trigger }) {
			const nonStencilNonNegativeJokers = state.jokers.filter((joker) => joker.name !== 'Joker Stencil' && joker.edition !== 'Negative')
			score.push({
				multiplier: ['*', Math.max(1, state.jokerSlots - nonStencilNonNegativeJokers.length)],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Four Fingers': {
		rarity: 'uncommon',
	},
	'Mime': {
		rarity: 'uncommon',
	},
	'Credit Card': {
		rarity: 'common',
	},
	'Ceremonial Dagger': {
		rarity: 'uncommon',
		hasPlusMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['+', this.plusMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Banner': {
		rarity: 'common',
		effect ({ state, score, trigger }) {
			score.push({
				chips: ['+', state.discards * 30],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Mystic Summit': {
		rarity: 'common',
		effect ({ state, score, trigger }) {
			score.push({
				multiplier: ['+', state.discards === 0 ? 15 : 0],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Marble Joker': {
		rarity: 'uncommon',
	},
	'Loyalty Card': {
		rarity: 'uncommon',
		hasIsActiveInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['*', this.active ? 4 : 1],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'8 Ball': {
		rarity: 'common',
	},
	'Misprint': {
		rarity: 'common',
		effect ({ score, luck, trigger }) {
			score.push({
				multiplier: ['+', luck === 'all' ? 23 : luck === 'none' ? 0 : 11.5],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Dusk': {
		rarity: 'uncommon',
	},
	'Raised Fist': {
		rarity: 'common',
		heldCardEffect ({ state, card, score, trigger }) {
			// Stone cards won't add any mult.
			if (card.enhancement === 'Stone') {
				return
			}

			const handCards = state.cards.filter(({ played }) => !played)
			if (handCards.length === 0) {
				return
			}

			const handCardsLowestRankFirst = handCards.sort((cardA, cardB) => RANK_TO_CHIP_MAP[cardA.rank] - RANK_TO_CHIP_MAP[cardB.rank])
			const lowestRank = handCardsLowestRankFirst[0]!.rank
			const lowestHandCards = handCards.filter(({ rank }) => rank === lowestRank)
			const lastLowestHandCard = lowestHandCards.at(-1)!
			// If the current card isn't the *last* lowest, it's not relevant.
			if (lastLowestHandCard.index !== card.index) {
				return
			}

			score.push({
				multiplier: ['+', 2 * RANK_TO_CHIP_MAP[lastLowestHandCard.rank]],
				phase: 'held-cards',
				joker: this,
				trigger,
			})
		},
	},
	'Chaos the Clown': {
		rarity: 'common',
	},
	'Fibonacci': {
		rarity: 'uncommon',
		playedCardEffect ({ score, card, trigger }) {
			score.push({
				multiplier: ['+', isRank(card, ['Ace', '2', '3', '5', '8']) ? 8 : 0],
				phase: 'played-cards',
				card,
				joker: this,
				trigger,
			})
		},
	},
	'Steel Joker': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['*', this.timesMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Scary Face': {
		rarity: 'common',
		playedCardEffect ({ state, score, card, trigger }) {
			score.push({
				chips: ['+', isFaceCard(card, state.jokerSet) ? 30 : 0],
				phase: 'played-cards',
				card,
				joker: this,
				trigger,
			})
		},
	},
	'Abstract Joker': {
		rarity: 'common',
		effect ({ state, score, trigger }) {
			score.push({
				multiplier: ['+', 3 * state.jokers.length],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Delayed Gratification': {
		rarity: 'common',
	},
	'Hack': {
		rarity: 'uncommon',
	},
	'Pareidolia': {
		rarity: 'uncommon',
	},
	'Gros Michel': {
		rarity: 'common',
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['+', 15],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Even Steven': {
		rarity: 'common',
		playedCardEffect ({ score, card, trigger }) {
			score.push({
				multiplier: ['+', isRank(card, ['10', '8', '6', '4', '2']) ? 4 : 0],
				phase: 'played-cards',
				card,
				joker: this,
				trigger,
			})
		},
	},
	'Odd Todd': {
		rarity: 'common',
		playedCardEffect ({ score, card, trigger }) {
			score.push({
				chips: ['+', isRank(card, ['Ace', '9', '7', '5', '3']) ? 31 : 0],
				phase: 'played-cards',
				card,
				joker: this,
				trigger,
			})
		},
	},
	'Scholar': {
		rarity: 'common',
		playedCardEffect ({ score, card, trigger }) {
			const isAce = isRank(card, 'Ace')
			score.push({
				chips: ['+', isAce ? 20 : 0],
				multiplier: ['+', isAce ? 4 : 0],
				phase: 'played-cards',
				card,
				joker: this,
				trigger,
			})
		},
	},
	'Business Card': {
		rarity: 'common',
	},
	'Supernova': {
		rarity: 'common',
		effect ({ state, score, playedHand, trigger }) {
			score.push({
				// TODO: This is a conceptual mistake. The values input by the user should be the effective values after having played a hand and so we shouldn't `+ 1` here and instead have users input a value that's one higher than when they played a corresponding hand. All other inputs in Balatrolator work like this and hand levels are the only exception. This is a breaking change.
				multiplier: ['+', state.handLevels[playedHand].plays + 1],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Ride the Bus': {
		rarity: 'common',
		hasPlusMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['+', this.plusMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Space Joker': {
		rarity: 'uncommon',
		// Note: I don't apply Space Joker automatically. Instead, users should increase the level of the played hand in the UI.
	},
	'Egg': {
		rarity: 'common',
	},
	'Burglar': {
		rarity: 'uncommon',
	},
	'Blackboard': {
		rarity: 'uncommon',
		effect ({ state, score, trigger }) {
			const allHandCardsAreSpadesOrClubs = state.cards
				.filter(({ played }) => !played)
				.every((card) => isSuit(card, ['Spades', 'Clubs'], state.jokerSet))
			score.push({
				multiplier: ['*', allHandCardsAreSpadesOrClubs ? 3 : 1],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Runner': {
		rarity: 'common',
		hasPlusChipsInput: true,
		effect ({ score, trigger }) {
			score.push({
				chips: ['+', this.plusChips],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Ice Cream': {
		rarity: 'common',
		hasPlusChipsInput: true,
		effect ({ score, trigger }) {
			score.push({
				chips: ['+', this.plusChips],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'DNA': {
		rarity: 'rare',
	},
	'Splash': {
		rarity: 'common',
	},
	'Blue Joker': {
		rarity: 'common',
		hasPlusChipsInput: true,
		effect ({ score, trigger }) {
			score.push({
				chips: ['+', this.plusChips],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Sixth Sense': {
		rarity: 'uncommon',
	},
	'Constellation': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['*', this.timesMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Hiker': {
		rarity: 'common',
		hasPlusChipsInput: true,
		effect ({ score, trigger }) {
			score.push({
				chips: ['+', this.plusChips],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Faceless Joker': {
		rarity: 'common',
	},
	'Green Joker': {
		rarity: 'common',
		hasPlusMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['+', this.plusMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Superposition': {
		rarity: 'common',
	},
	'To Do List': {
		rarity: 'common',
	},
	'Cavendish': {
		rarity: 'common',
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['*', 3],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Card Sharp': {
		rarity: 'uncommon',
		hasIsActiveInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['*', this.active ? 3 : 1],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Red Card': {
		rarity: 'common',
		hasPlusMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['+', this.plusMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Madness': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['*', this.timesMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Square Joker': {
		rarity: 'common',
		hasPlusChipsInput: true,
		effect ({ score, trigger }) {
			score.push({
				chips: ['+', this.plusChips],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Séance': {
		rarity: 'uncommon',
	},
	'Riff-Raff': {
		rarity: 'common',
	},
	'Vampire': {
		rarity: 'rare',
		hasTimesMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['*', this.timesMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Shortcut': {
		rarity: 'common',
	},
	'Hologram': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['*', this.timesMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Vagabond': {
		rarity: 'rare',
	},
	'Baron': {
		rarity: 'rare',
		heldCardEffect ({ score, card, trigger }) {
			score.push({
				multiplier: ['*', card.rank === 'King' ? 1.5 : 1],
				phase: 'held-cards',
				card,
				joker: this,
				trigger,
			})
		},
	},
	'Cloud 9': {
		rarity: 'uncommon',
	},
	'Rocket': {
		rarity: 'uncommon',
	},
	'Obelisk': {
		rarity: 'rare',
		hasTimesMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['*', this.timesMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Midas Mask': {
		rarity: 'uncommon',
	},
	'Luchador': {
		rarity: 'uncommon',
	},
	'Photograph': {
		rarity: 'common',
		playedCardEffect ({ state, score, card, trigger }) {
			const firstPlayedFaceCard = state.cards.filter(({ played }) => played).find((playedCard) => ['King', 'Queen', 'Jack'].includes(playedCard.rank))
			const isFirstPlayedFaceCard = card.index === firstPlayedFaceCard?.index
			score.push({
				multiplier: ['*', isFirstPlayedFaceCard ? 2 : 1],
				phase: 'played-cards',
				card,
				joker: this,
				trigger,
			})
		},
	},
	'Gift Card': {
		rarity: 'uncommon',
	},
	'Turtle Bean': {
		rarity: 'uncommon',
	},
	'Erosion': {
		rarity: 'uncommon',
		hasPlusMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['+', this.plusMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Reserved Parking': {
		rarity: 'common',
	},
	'Mail-in Rebate': {
		rarity: 'common',
	},
	'To the Moon': {
		rarity: 'uncommon',
	},
	'Hallucination': {
		rarity: 'common',
	},
	'Fortune Teller': {
		rarity: 'common',
		hasPlusMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['+', this.plusMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Juggler': {
		rarity: 'common',
	},
	'Drunkard': {
		rarity: 'common',
	},
	'Stone Joker': {
		rarity: 'uncommon',
		hasPlusChipsInput: true,
		effect ({ score, trigger }) {
			score.push({
				chips: ['+', this.plusChips],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Golden Joker': {
		rarity: 'common',
	},
	'Lucky Cat': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['*', this.timesMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Baseball Card': {
		rarity: 'rare',
		indirectEffect ({ score, joker, trigger }) {
			score.push({
				multiplier: ['*', joker.rarity === 'uncommon' ? 1.5 : 1],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Bull': {
		rarity: 'uncommon',
		effect ({ state, score, trigger }) {
			score.push({
				chips: ['+', state.money * 2],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Diet Cola': {
		rarity: 'uncommon',
	},
	'Trading Card': {
		rarity: 'uncommon',
	},
	'Flash Card': {
		rarity: 'uncommon',
		hasPlusMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['+', this.plusMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Popcorn': {
		rarity: 'common',
		hasPlusMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['+', this.plusMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Spare Trousers': {
		rarity: 'uncommon',
		hasPlusMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['+', this.plusMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Ancient Joker': {
		// Note: Its effect does **not** does not consider which suits exist in the deck
		rarity: 'rare',
		hasSuitInput: true,
		playedCardEffect ({ state, score, card, trigger }) {
			score.push({
				multiplier: ['*', isSuit(card, this.suit!, state.jokerSet) ? 1.5 : 1],
				phase: 'played-cards',
				card,
				joker: this,
				trigger,
			})
		},
	},
	'Ramen': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['*', this.timesMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Walkie Talkie': {
		rarity: 'common',
		playedCardEffect ({ score, card, trigger }) {
			const isFourOrTen = isRank(card, ['4', '10'])
			score.push({
				chips: ['+', isFourOrTen ? 10 : 0],
				multiplier: ['+', isFourOrTen ? 4 : 0],
				phase: 'played-cards',
				card,
				joker: this,
				trigger,
			})
		},
	},
	'Seltzer': {
		rarity: 'uncommon',
	},
	'Castle': {
		rarity: 'uncommon',
		hasPlusChipsInput: true,
		effect ({ score, trigger }) {
			score.push({
				chips: ['+', this.plusChips],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Smiley Face': {
		rarity: 'common',
		playedCardEffect ({ state, score, card, trigger }) {
			score.push({
				multiplier: ['+', isFaceCard(card, state.jokerSet) ? 5 : 0],
				phase: 'played-cards',
				card,
				joker: this,
				trigger,
			})
		},
	},
	'Campfire': {
		rarity: 'rare',
		hasTimesMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['*', this.timesMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Golden Ticket': {
		rarity: 'common',
	},
	'Mr. Bones': {
		rarity: 'uncommon',
	},
	'Acrobat': {
		rarity: 'uncommon',
		effect ({ state, score, trigger }) {
			score.push({
				multiplier: ['*', state.hands === 1 ? 3 : 1],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Sock and Buskin': {
		rarity: 'uncommon',
	},
	'Swashbuckler': {
		rarity: 'common',
		hasPlusMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['+', this.plusMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Troubador': {
		rarity: 'uncommon',
	},
	'Certificate': {
		rarity: 'uncommon',
	},
	'Smeared Joker': {
		rarity: 'uncommon',
	},
	'Throwback': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['*', this.timesMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Hanging Chad': {
		rarity: 'common',
	},
	'Rough Gem': {
		rarity: 'uncommon',
	},
	'Bloodstone': {
		rarity: 'uncommon',
		playedCardEffect ({ state, score, card, luck, trigger }) {
			if (isSuit(card, 'Hearts', state.jokerSet)) {
				const denominator = 2
				const xMult = 2
				const oopses = state.jokers.filter(({ name }) => name === 'Oops! All 6s')
				const mult = balanceMultWithLuck(xMult, oopses.length, denominator, luck, 'times')

				score.push({
					multiplier: ['*', mult],
					phase: 'played-cards',
					card,
					joker: this,
					trigger,
				})
			}
		},
	},
	'Arrowhead': {
		rarity: 'uncommon',
		playedCardEffect ({ state, score, card, trigger }) {
			score.push({
				chips: ['+', isSuit(card, 'Spades', state.jokerSet) ? 50 : 0],
				phase: 'played-cards',
				card,
				joker: this,
				trigger,
			})
		},
	},
	'Onyx Agate': {
		rarity: 'uncommon',
		playedCardEffect ({ state, score, card, trigger }) {
			score.push({
				multiplier: ['+', isSuit(card, 'Clubs', state.jokerSet) ? 7 : 0],
				phase: 'played-cards',
				card,
				joker: this,
				trigger,
			})
		},
	},
	'Glass Joker': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['*', this.timesMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Showman': {
		rarity: 'uncommon',
	},
	'Flower Pot': {
		rarity: 'uncommon',
		effect ({ state, score, scoringCards, trigger }) {
			if (scoringCards.length < 4) {
				return
			}

			let hasAllSuits = false
			const suits = ['Spades', 'Hearts', 'Clubs', 'Diamonds'] as Suit[]
			const cards = new Set<Card>()
			for (const suit of suits) {
				for (const card of scoringCards) {
					if (cards.has(card)) {
						continue
					}

					// Only check base suit when card is debuffed
					if (card.debuffed ? card.suit === suit : isSuit(card, suit, state.jokerSet)) {
						cards.add(card)

						if (cards.size === 4) {
							hasAllSuits = true
						}
					}
				}
			}

			score.push({
				multiplier: ['*', hasAllSuits ? 3 : 1],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Blueprint': {
		rarity: 'rare',
		effect (options) {
			const resolvedJoker = resolveJoker(options.state.jokers, this)

			if (resolvedJoker && resolvedJoker.effect) {
				resolvedJoker.effect(options)
			}
		},
	},
	'Wee Joker': {
		rarity: 'rare',
		hasPlusChipsInput: true,
		effect ({ score, trigger }) {
			score.push({
				chips: ['+', this.plusChips],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Merry Andy': {
		rarity: 'uncommon',
	},
	'Oops! All 6s': {
		rarity: 'uncommon',
	},
	'The Idol': {
		rarity: 'uncommon',
		hasRankInput: true,
		hasSuitInput: true,
		playedCardEffect ({ state, score, card, trigger }) {
			score.push({
				multiplier: ['*', this.suit && isSuit(card, this.suit, state.jokerSet) && card.rank === this.rank ? 2 : 1],
				phase: 'played-cards',
				card,
				joker: this,
				trigger,
			})
		},
	},
	'Seeing Double': {
		rarity: 'uncommon',
		effect ({ state, score, scoringCards, trigger }) {
			const hasScoringClubsCard = scoringCards.some((card) => isSuit(card, 'Clubs', state.jokerSet))
			const hasScoringCardOfOtherSuit = scoringCards.some((card) => isSuit(card, ['Spades', 'Hearts', 'Diamonds'], state.jokerSet))

			score.push({
				multiplier: ['*', hasScoringClubsCard && hasScoringCardOfOtherSuit ? 2 : 1],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Matador': {
		rarity: 'uncommon',
	},
	'Hit the Road': {
		rarity: 'rare',
		hasTimesMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['*', this.timesMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'The Duo': {
		rarity: 'rare',
		effect ({ state, score, trigger }) {
			const cards = nOfAKind(state.cards.filter(({ played }) => played), 2)
			score.push({
				multiplier: ['*', cards.length > 0 ? 2 : 1],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'The Trio': {
		rarity: 'rare',
		effect ({ state, score, trigger }) {
			const cards = nOfAKind(state.cards.filter(({ played }) => played), 3)
			score.push({
				multiplier: ['*', cards.length > 0 ? 3 : 1],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'The Family': {
		rarity: 'rare',
		effect ({ state, score, trigger }) {
			const cards = nOfAKind(state.cards.filter(({ played }) => played), 4)
			score.push({
				multiplier: ['*', cards.length > 0 ? 4 : 1],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'The Order': {
		rarity: 'common',
		effect ({ state, score, trigger }) {
			const cards = straight(state.cards.filter(({ played }) => played), state.jokerSet)
			score.push({
				multiplier: ['*', cards.length > 0 ? 3 : 1],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'The Tribe': {
		rarity: 'rare',
		effect ({ state, score, trigger }) {
			const cards = flush(state.cards.filter(({ played }) => played), state.jokerSet)
			score.push({
				multiplier: ['*', cards.length > 0 ? 2 : 1],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Stuntman': {
		rarity: 'rare',
		effect ({ score, trigger }) {
			score.push({
				chips: ['+', 250],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Invisible Joker': {
		rarity: 'rare',
	},
	'Brainstorm': {
		rarity: 'rare',
		effect (options) {
			const resolvedJoker = resolveJoker(options.state.jokers, this)

			if (resolvedJoker && resolvedJoker.effect) {
				resolvedJoker.effect(options)
			}
		},
	},
	'Satellite': {
		rarity: 'uncommon',
	},
	'Shoot the Moon': {
		rarity: 'common',
		heldCardEffect ({ score, card, trigger }) {
			score.push({
				multiplier: ['+', card.rank === 'Queen' ? 13 : 0],
				phase: 'held-cards',
				card,
				joker: this,
				trigger,
			})
		},
	},
	'Driver\'s license': {
		rarity: 'rare',
		hasIsActiveInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['*', this.active ? 3 : 1],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Cartomancer': {
		rarity: 'uncommon',
	},
	'Astronomer': {
		rarity: 'uncommon',
	},
	'Burnt Joker': {
		rarity: 'rare',
	},
	'Bootstraps': {
		rarity: 'common',
		effect ({ state, score, trigger }) {
			// Note: I'm assuming here that this can't *subtract* multiplier if money is negative.
			const factor = Math.max(0, Math.floor(state.money / 5))
			score.push({
				multiplier: ['+', factor * 2],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Canio': {
		rarity: 'legendary',
		hasTimesMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['*', this.timesMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Triboulet': {
		rarity: 'legendary',
		playedCardEffect ({ score, card, trigger }) {
			score.push({
				multiplier: ['*', isRank(card, ['King', 'Queen']) ? 2 : 0],
				phase: 'played-cards',
				card,
				joker: this,
				trigger,
			})
		},
	},
	'Yorick': {
		rarity: 'legendary',
		hasTimesMultiplierInput: true,
		effect ({ score, trigger }) {
			score.push({
				multiplier: ['*', this.timesMultiplier],
				phase: 'jokers',
				joker: this,
				trigger,
			})
		},
	},
	'Chicot': {
		rarity: 'legendary',
	},
	'Perkeo': {
		rarity: 'legendary',
	},
}

export const JOKER_NAMES = Object.keys(JOKER_DEFINITIONS) as JokerName[]
