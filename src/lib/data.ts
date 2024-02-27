import { flush, nOfAKind, straight } from '#lib/getHand.js'
import type { Blind, BlindName, HandName, JokerEffects, JokerName, ModifierDefaults, Rank, ScoreSet } from '#lib/types.js'
import { isFaceCard } from '#utilities/isFaceCard.js'
import { isRank } from '#utilities/isRank.js'
import { isSuit } from '#utilities/isSuit.js'

export const MODIFIER_DEFAULTS: ModifierDefaults = {
	edition: {
		base: {},
		foil: { plusChips: 50 },
		holographic: { plusMultiplier: 10 },
		polychrome: { timesMultiplier: 1.5 },
		negative: {},
	},
	enhancement: {
		none: {},
		bonus: { plusChips: 30 },
		mult: { plusMultiplier: 4 },
		wild: {},
		glass: { timesMultiplier: 2 },
		steel: { timesMultiplier: 1.5 },
		stone: { plusChips: 50 },
		gold: {},
		lucky: {},
	},
	seal: {
		none: {},
		gold: {},
		red: { timesMultiplier: 2 },
		blue: {},
		purple: {},
	},
}

export const BLINDS: Record<BlindName, Blind> = {
	'Small Blind': { reward: 3, multFactor: 1 },
	'Big Blind': { reward: 4, multFactor: 1.5 },
	'The Hook': { reward: 5, multFactor: 2 },
	'The Ox': { reward: 5, multFactor: 2 },
	'The House': { reward: 5, multFactor: 2 },
	'The Wall': { reward: 5, multFactor: 4 },
	'The Wheel': { reward: 5, multFactor: 2 },
	'The Arm': { reward: 5, multFactor: 2 },
	'The Club': { reward: 5, multFactor: 2 },
	'The Fish': { reward: 5, multFactor: 2 },
	'The Psychic': { reward: 5, multFactor: 2 },
	'The Goad': { reward: 5, multFactor: 2 },
	'The Water': { reward: 5, multFactor: 2 },
	'The Window': { reward: 5, multFactor: 2 },
	'The Manacle': { reward: 5, multFactor: 2 },
	'The Eye': { reward: 5, multFactor: 2 },
	'The Mouth': { reward: 5, multFactor: 2 },
	'The Plant': { reward: 5, multFactor: 2 },
	'The Serpent': { reward: 5, multFactor: 2 },
	'The Pillar': { reward: 5, multFactor: 2 },
	'The Needle': { reward: 5, multFactor: 1 },
	'The Head': { reward: 5, multFactor: 2 },
	'The Tooth': { reward: 5, multFactor: 2 },
	'The Flint': { reward: 5, multFactor: 2 },
	'The Mark': { reward: 5, multFactor: 2 },
	'Amber Acorn': { reward: 8, multFactor: 2 },
	'Unknown One': { reward: 8, multFactor: 2 },
	'Violet Vessel': { reward: 8, multFactor: 2 },
	'Unknown Two': { reward: 8, multFactor: 2 },
	'Cerulean Bell': { reward: 8, multFactor: 2 },
}

export const PLANET_SCORE_SETS: Record<HandName, ScoreSet> = {
	'Flush Five': { chips: 40, multiplier: 3 },
	'Flush House': { chips: 40, multiplier: 3 },
	'Five of a Kind': { chips: 35, multiplier: 3 },
	'Straight Flush': { chips: 40, multiplier: 3 },
	'Four of a Kind': { chips: 30, multiplier: 3 },
	'Full House': { chips: 25, multiplier: 2 },
	'Flush': { chips: 15, multiplier: 2 },
	'Straight': { chips: 30, multiplier: 2 },
	'Three of a Kind': { chips: 20, multiplier: 2 },
	'Two Pair': { chips: 20, multiplier: 1 },
	'Pair': { chips: 15, multiplier: 1 },
	'High Card': { chips: 10, multiplier: 1 },
}

export const DEFAULT_HAND_SCORE_SETS: Record<HandName, ScoreSet> = {
	'Flush Five': { chips: 160, multiplier: 16 },
	'Flush House': { chips: 140, multiplier: 14 }, // TODO: Verify values
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

export const PLANET_TO_HAND_MAP = {
	Eris: 'Flush Five',
	Ceres: 'Flush House',
	'Planet X': 'Five of a Kind',
	Neptune: 'Straight Flush',
	Mars: 'Four of a Kind',
	Earth: 'Full House',
	Jupiter: 'Flush',
	Saturn: 'Straight',
	Venus: 'Three of a Kind',
	Uranus: 'Two Pair',
	Mercury: 'Pair',
	Pluto: 'High Card',
} as const

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
	'Ace': 1,
}

export const JOKER_DEFINITIONS: Record<JokerName, JokerEffects> = {
	'Joker': {
		rarity: 'common',
		applyPlusMultiplier ({ value }) {
			return value + 4
		},
	},
	'Greedy Joker': {
		rarity: 'common',
		applyCardPlusMultiplier ({ value, card }) {
			return value + (isSuit({ card }, 'Diamonds') ? 4 : 0)
		},
	},
	'Lusty Joker': {
		rarity: 'common',
		applyCardPlusMultiplier ({ value, card }) {
			return value + (isSuit({ card }, 'Hearts') ? 4 : 0)
		},
	},
	'Wrathful Joker': {
		rarity: 'common',
		applyCardPlusMultiplier ({ value, card }) {
			return value + (isSuit({ card }, 'Spades') ? 4 : 0)
		},
	},
	'Gluttonous Joker': {
		rarity: 'common',
		applyCardPlusMultiplier ({ value, card }) {
			return value + (isSuit({ card }, 'Clubs') ? 4 : 0)
		},
	},
	'Jolly Joker': {
		rarity: 'common',
		applyPlusMultiplier ({ value, state }) {
			const cards = nOfAKind(state.playedCards, 2)
			return value + (cards.length > 0 ? 8 : 0)
		},
	},
	'Zany Joker': {
		rarity: 'common',
		applyPlusMultiplier ({ value, state }) {
			const cards = nOfAKind(state.playedCards, 3)
			return value + (cards.length > 0 ? 8 : 0)
		},
	},
	'Mad Joker': {
		rarity: 'common',
		applyPlusMultiplier ({ value, state }) {
			const cards = nOfAKind(state.playedCards, 4)
			return value + (cards.length > 0 ? 8 : 0)
		},
	},
	'Crazy Joker': {
		rarity: 'common',
		applyPlusMultiplier ({ value, state }) {
			const hasFourFingers = state.jokerSet.has('Four Fingers')
			const hasShortcut = state.jokerSet.has('Shortcut')
			const cards = straight(state.playedCards, hasFourFingers, hasShortcut)
			return value + (cards.length > 0 ? 12 : 0)
		},
	},
	'Droll Joker': {
		rarity: 'common',
		applyPlusMultiplier ({ value, state }) {
			const hasFourFingers = state.jokerSet.has('Four Fingers')
			const hasSmearedJoker = state.jokerSet.has('Smeared Joker')
			const cards = flush(state.playedCards, hasFourFingers, hasSmearedJoker)
			return value + (cards.length > 0 ? 10 : 0)
		},
	},
	'Sly Joker': {
		rarity: 'common',
		applyPlusChips ({ value, state }) {
			const cards = nOfAKind(state.playedCards, 2)
			return value + (cards.length > 0 ? 50 : 0)
		},
	},
	'Wily Joker': {
		rarity: 'common',
		applyPlusChips ({ value, state }) {
			const cards = nOfAKind(state.playedCards, 3)
			return value + (cards.length > 0 ? 100 : 0)
		},
	},
	'Clever Joker': {
		rarity: 'common',
		applyPlusChips ({ value, state }) {
			const cards = nOfAKind(state.playedCards, 4)
			return value + (cards.length > 0 ? 150 : 0)
		},
	},
	'Devious Joker': {
		rarity: 'common',
		applyPlusChips ({ value, state }) {
			const hasFourFingers = state.jokerSet.has('Four Fingers')
			const hasShortcut = state.jokerSet.has('Shortcut')
			const cards = straight(state.playedCards, hasFourFingers, hasShortcut)
			return value + (cards.length > 0 ? 100 : 0)
		},
	},
	'Crafty Joker': {
		rarity: 'common',
		applyPlusChips ({ value, state }) {
			const hasFourFingers = state.jokerSet.has('Four Fingers')
			const hasSmearedJoker = state.jokerSet.has('Smeared Joker')
			const cards = flush(state.playedCards, hasFourFingers, hasSmearedJoker)
			return value + (cards.length > 0 ? 80 : 0)
		},
	},
	'Half Joker': {
		rarity: 'common',
		applyPlusMultiplier ({ value, state }) {
			return value + (state.playedCards.length <= 3 ? 20 : 0)
		},
	},
	'Joker Stencil': {
		rarity: 'uncommon',
		applyTimesMultiplier ({ value, state }) {
			const nonNegativeJokers = state.jokers.filter(({ edition }) => edition !== 'negative')
			return value * (state.jokerSlots - nonNegativeJokers.length)
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
		applyPlusMultiplier ({ value }) {
			return value + this.plusMultiplier
		},
	},
	'Banner': {
		rarity: 'common',
		applyPlusChips ({ value, state }) {
			return value + (state.discards * 40)
		},
	},
	'Mystic Summit': {
		rarity: 'common',
		applyPlusMultiplier ({ value, state }) {
			return value + (state.discards === 0 ? 15 : 0)
		},
	},
	'Marble Joker': {
		rarity: 'uncommon',
	},
	'Loyalty Card': {
		rarity: 'uncommon',
		hasIsActiveInput: true,
		applyTimesMultiplier ({ value }) {
			return value * (this.isActive ? 4 : 0)
		},
	},
	'8 Ball': {
		rarity: 'common',
	},
	'Misprint': { // TODO:
		rarity: 'common',
		applyPlusMultiplier ({ value }) {
			return value + 0
		},
	},
	'Dusk': {
		rarity: 'uncommon',
	},
	'Raised Fist': {
		rarity: 'common',
		applyPlusMultiplier ({ value, state }) {
			const ranks = state.heldCards.map(({ rank }) => RANK_TO_CHIP_MAP[rank])
			ranks.sort((a, b) => a - b)
			const lowestCardRank = ranks[0]
			return value + (lowestCardRank ? (2 * lowestCardRank) : 0)
		},
	},
	'Chaos the Clown': {
		rarity: 'common',
	},
	'Fibonacci': {
		rarity: 'uncommon',
		applyCardPlusMultiplier ({ value, card }) {
			return value + (isRank({ card }, ['Ace', '2', '3', '5', '8']) ? 8 : 0)
		},
	},
	'Steel Joker': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		applyTimesMultiplier ({ value }) {
			return value * this.timesMultiplier
		},
	},
	'Scary Face': {
		rarity: 'common',
		applyCardPlusChips ({ value, state, card }) {
			return value + (isFaceCard({ state, card }) ? 30 : 0)
		},
	},
	'Abstract Joker': {
		rarity: 'common',
		applyPlusMultiplier ({ value, state }) {
			return value + state.jokers.length
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
		probability: {
			numerator: 1,
			denominator: 4,
		},
		applyPlusMultiplier ({ value }) {
			return value + 15
		},
	},
	'Even Steven': {
		rarity: 'common',
		applyCardPlusMultiplier ({ value, card }) {
			return value + (isRank({ card }, ['10', '8', '6', '4', '2']) ? 4 : 0)
		},
	},
	'Odd Todd': {
		rarity: 'common',
		applyCardPlusChips ({ value, card }) {
			return value + (isRank({ card }, ['Ace', '9', '7', '5', '3']) ? 30 : 0)
		},
	},
	'Scholar': {
		rarity: 'common',
		applyCardPlusChips ({ value, card }) {
			return value + (isRank({ card }, 'Ace') ? 20 : 0)
		},
		applyCardPlusMultiplier ({ value, card }) {
			return value + (isRank({ card }, 'Ace') ? 4 : 0)
		},
	},
	'Business Card': {
		rarity: 'common',
		probability: {
			numerator: 1,
			denominator: 2,
		},
	},
	'Supernova': {
		rarity: 'common',
		applyPlusMultiplier ({ value, state }) {
			// TODO: Remove the following by instead incrementing `plays` after determining the played hand.
			// Note: This is counting one extra play because the Joker takes *the current played hand* into account for the calculation.
			return value + state.handLevels[state.playedHand].plays + 1
		},
	},
	'Ride the Bus': {
		rarity: 'common',
		hasPlusMultiplierInput: true,
		applyPlusMultiplier ({ value }) {
			return value + this.plusMultiplier
		},
	},
	'Space Joker': {
		rarity: 'uncommon',
		probability: {
			numerator: 1,
			denominator: 4,
		},
	},
	'Egg': {
		rarity: 'common',
	},
	'Burglar': {
		rarity: 'uncommon',
	},
	'Blackboard': {
		rarity: 'uncommon',
		applyTimesMultiplier ({ value, state }) {
			const allHandCardsAreSpadesOrClubs = state.heldCards.every((card) => isSuit({ card }, ['Spades', 'Clubs']))
			return value * (allHandCardsAreSpadesOrClubs ? 3 : 1)
		},
	},
	'Runner': {
		rarity: 'common',
		hasPlusChipsInput: true,
		applyPlusChips ({ value }) {
			return value + this.plusChips
		},
	},
	'Ice Cream': {
		rarity: 'common',
		hasPlusChipsInput: true,
		applyPlusChips ({ value }) {
			return value + this.plusChips
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
		applyPlusChips ({ value }) {
			return value + this.plusChips
		},
	},
	'Sixth Sense': {
		rarity: 'rare',
	},
	'Constellation': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		applyTimesMultiplier ({ value }) {
			return value * this.timesMultiplier
		},
	},
	'Hiker': {
		rarity: 'common',
		hasPlusChipsInput: true,
		applyPlusChips ({ value }) {
			return value + this.plusChips
		},
	},
	'Faceless Joker': {
		rarity: 'common',
	},
	'Green Joker': {
		rarity: 'common',
		hasPlusMultiplierInput: true,
		applyPlusMultiplier ({ value }) {
			return value + this.plusMultiplier
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
		probability: {
			numerator: 1,
			denominator: 1000,
		},
		applyTimesMultiplier ({ value }) {
			return value * 3
		},
	},
	'Card Sharp': {
		rarity: 'uncommon',
		applyTimesMultiplier ({ value }) {
			return value * (this.isActive ? 3 : 1)
		},
	},
	'Red Card': {
		rarity: 'common',
		hasPlusMultiplierInput: true,
		applyPlusMultiplier ({ value }) {
			return value + this.plusMultiplier
		},
	},
	'Madness': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		applyTimesMultiplier ({ value }) {
			return value * this.timesMultiplier
		},
	},
	'Square Joker': {
		rarity: 'common',
		hasPlusChipsInput: true,
		applyPlusChips ({ value }) {
			return value + this.plusChips
		},
	},
	'Séance': {
		rarity: 'rare',
	},
	'Riff-Raff': {
		rarity: 'common',
	},
	'Vampire': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		applyTimesMultiplier ({ value }) {
			return value * this.timesMultiplier
		},
	},
	'Shortcut': {
		rarity: 'common',
	},
	'Hologram': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		applyTimesMultiplier ({ value }) {
			return value * this.timesMultiplier
		},
	},
	'Vagabond': {
		rarity: 'uncommon',
	},
	'Baron': {
		rarity: 'rare',
		applyHeldCardTimesMultiplier ({ value, card }) {
			return value * (card.rank === 'King' ? 1.5 : 1)
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
		applyTimesMultiplier ({ value }) {
			return value * this.timesMultiplier
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
		applyCardTimesMultiplier ({ value, state, card }) {
			const firstPlayedFaceCard = state.playedCards.find((playedCard) => ['King', 'Queen', 'Jack'].includes(playedCard.rank))
			const isFirstPlayedFaceCard = card.index === firstPlayedFaceCard?.index
			return value * (isFirstPlayedFaceCard ? 2 : 1)
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
		applyPlusMultiplier ({ value }) {
			return value + this.plusMultiplier
		},
	},
	'Reserved Parking': {
		rarity: 'uncommon',
		probability: {
			numerator: 1,
			denominator: 2,
		},
	},
	'Mail-in Rebate': {
		rarity: 'common',
	},
	'To the Moon': {
		rarity: 'uncommon',
	},
	'Hallucination': {
		rarity: 'common',
		probability: {
			numerator: 1,
			denominator: 2,
		},
	},
	'Fortune Teller': {
		rarity: 'common',
		hasPlusMultiplierInput: true,
		applyPlusMultiplier ({ value }) {
			return value + this.plusMultiplier
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
		applyPlusChips ({ value }) {
			return value + this.plusChips
		},
	},
	'Golden Joker': {
		rarity: 'common',
	},
	'Lucky Cat': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		applyTimesMultiplier ({ value }) {
			return value * this.timesMultiplier
		},
	},
	'Baseball Card': {
		rarity: 'rare',
	},
	'Bull': {
		rarity: 'uncommon',
		applyPlusChips ({ value, state }) {
			return value + (state.money * 2)
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
		applyPlusMultiplier ({ value }) {
			return value + this.plusMultiplier
		},
	},
	'Popcorn': {
		rarity: 'common',
		hasPlusMultiplierInput: true,
		applyPlusMultiplier ({ value }) {
			return value + this.plusMultiplier
		},
	},
	'Spare Trousers': {
		rarity: 'uncommon',
		hasPlusMultiplierInput: true,
		applyPlusMultiplier ({ value }) {
			return value + this.plusMultiplier
		},
	},
	'Ancient Joker': {
		rarity: 'rare',
		hasSuitInput: true,
		applyTimesMultiplier ({ value, state }) {
			const playedCardsWithMatchingSuits = state.playedCards.filter((card) => isSuit({ card }, this.suit!))
			return value * playedCardsWithMatchingSuits.length * 1.5
		},
	},
	'Ramen': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		applyTimesMultiplier ({ value }) {
			return value * this.timesMultiplier
		},
	},
	'Walkie Talkie': {
		rarity: 'common',
		applyCardPlusChips ({ value, card }) {
			return value + (['6', '10'].includes(card.rank) ? 10 : 0)
		},
		applyCardPlusMultiplier ({ value, card }) {
			return value + (['6', '10'].includes(card.rank) ? 4 : 0)
		},
	},
	'Seltzer': {
		rarity: 'uncommon',
	},
	'Castle': {
		rarity: 'uncommon',
		hasPlusChipsInput: true,
		applyPlusChips ({ value }) {
			return value + this.plusChips
		},
	},
	'Smiley Face': {
		rarity: 'common',
		applyCardPlusMultiplier ({ value, state, card }) {
			return value + (isFaceCard({ state, card }) ? 4 : 0)
		},
	},
	'Campfire': {
		rarity: 'rare',
		hasTimesMultiplierInput: true,
		applyTimesMultiplier ({ value }) {
			return value * this.timesMultiplier
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
		applyTimesMultiplier ({ value, state }) {
			return value * (state.hands === 1 ? 3 : 1)
		},
	},
	'Sock and Buskin': {
		rarity: 'uncommon',
	},
	'Swashbuckler': {
		rarity: 'common',
		hasPlusMultiplierInput: true,
		applyPlusMultiplier ({ value }) {
			return value + this.plusMultiplier
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
		applyTimesMultiplier ({ value }) {
			return value * this.timesMultiplier
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
		probability: {
			numerator: 1,
			denominator: 3,
		},
		applyCardTimesMultiplier ({ value, card }) {
			return value * (isSuit({ card }, 'Hearts') ? 1 : 1)
		},
	},
	'Arrowhead': {
		rarity: 'uncommon',
		applyCardPlusChips ({ value, card }) {
			return value + (isSuit({ card }, 'Spades') ? 50 : 0)
		},
	},
	'Onyx Agate': {
		rarity: 'uncommon',
		applyCardPlusMultiplier ({ value, card }) {
			return value + (isSuit({ card }, 'Clubs') ? 8 : 0)
		},
	},
	'Glass Joker': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		applyPlusMultiplier ({ value }) {
			return value * this.timesMultiplier
		},
	},
	'Showman': {
		rarity: 'uncommon',
	},
	'Flowerpot': {
		rarity: 'uncommon',
		applyTimesMultiplier ({ value, state }) {
			const hasAllSuits = (['Spades', 'Hearts', 'Clubs', 'Diamonds'] as const).every((suit) => {
				return state.scoringCards.some((card) => isSuit({ card }, suit))
			})

			return value * (hasAllSuits ? 3 : 1)
		},
	},
	'Blueprint': {
		rarity: 'rare',
	},
	'Wee Joker': {
		rarity: 'rare',
		hasPlusChipsInput: true,
		applyPlusChips ({ value }) {
			return value + this.plusChips
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
		applyCardTimesMultiplier ({ value, card }) {
			return value * (this.suit && isSuit({ card }, this.suit) && card.rank === this.rank ? 2 : 1)
		},
	},
	'Seeing Double': {
		rarity: 'uncommon',
		applyTimesMultiplier ({ value, state }) {
			const hasScoringClubsCard = state.scoringCards.some((card) => isSuit({ card }, 'Clubs'))
			const hasScoringCardOfOtherSuit = state.scoringCards.some((card) => isSuit({ card }, ['Spades', 'Hearts', 'Diamonds']))

			return value * (hasScoringClubsCard && hasScoringCardOfOtherSuit ? 2 : 1)
		},
	},
	'Matador': {
		rarity: 'common',
	},
	'Hit the Road': {
		rarity: 'rare',
		hasTimesMultiplierInput: true,
		applyTimesMultiplier ({ value }) {
			return value * this.timesMultiplier
		},
	},
	'The Duo': {
		rarity: 'rare',
		applyTimesMultiplier ({ value, state }) {
			const cards = nOfAKind(state.playedCards, 2)
			return value * (cards.length > 0 ? 2 : 1)
		},
	},
	'The Trio': {
		rarity: 'rare',
		applyTimesMultiplier ({ value, state }) {
			const cards = nOfAKind(state.playedCards, 3)
			return value * (cards.length > 0 ? 3 : 1)
		},
	},
	'The Family': {
		rarity: 'rare',
		applyTimesMultiplier ({ value, state }) {
			const cards = nOfAKind(state.playedCards, 4)
			return value * (cards.length > 0 ? 4 : 1)
		},
	},
	'The Order': {
		rarity: 'common',
		applyTimesMultiplier ({ value, state }) {
			const hasFourFingers = state.jokerSet.has('Four Fingers')
			const hasShortcut = state.jokerSet.has('Shortcut')
			const cards = straight(state.playedCards, hasFourFingers, hasShortcut)
			return value * (cards.length > 0 ? 3 : 1)
		},
	},
	'The Tribe': {
		rarity: 'rare',
		applyTimesMultiplier ({ value, state }) {
			const hasFourFingers = state.jokerSet.has('Four Fingers')
			const hasSmearedJoker = state.jokerSet.has('Smeared Joker')
			const cards = flush(state.playedCards, hasFourFingers, hasSmearedJoker)
			return value * (cards.length > 0 ? 2 : 1)
		},
	},
	'Stuntman': {
		rarity: 'uncommon',
		applyPlusChips ({ value }) {
			return value + 300
		},
	},
	'Invisible Joker': {
		rarity: 'rare',
	},
	'Brainstorm': {
		rarity: 'rare',
	},
	'Satellite': {
		rarity: 'uncommon',
	},
	'Shoot the Moon': {
		rarity: 'common',
		applyCardPlusMultiplier ({ value, card }) {
			return value + (card.rank === 'Queen' ? 13 : 0)
		},
	},
	'Driver\'s license': {
		rarity: 'rare',
		hasTimesMultiplierInput: true,
		applyTimesMultiplier ({ value }) {
			return value * this.timesMultiplier
		},
	},
	'Cartomancer': {
		rarity: 'common',
	},
	'Astronomer': {
		rarity: 'uncommon',
	},
	'Burnt Joker': {
		rarity: 'uncommon',
	},
	'Bootstraps': {
		rarity: 'common',
		applyPlusMultiplier ({ value, state }) {
			// Note: I'm assuming here that this can't *subtract* multiplier if money is negative.
			const factor = Math.max(0, Math.floor(state.money / 5))
			return value + (factor * 2)
		},
	},
	'Canio': {
		rarity: 'legendary',
		hasTimesMultiplierInput: true,
		applyTimesMultiplier ({ value }) {
			return value * this.timesMultiplier
		},
	},
	'Triboulet': {
		rarity: 'legendary',
		applyCardTimesMultiplier ({ value, card }) {
			return value * (['King', 'Queen'].includes(card.rank) ? 2 : 0)
		},
	},
	'Yorick': {
		rarity: 'legendary',
		hasTimesMultiplierInput: true,
		applyTimesMultiplier ({ value }) {
			return value * this.timesMultiplier
		},
	},
	'Chicot': {
		rarity: 'legendary',
	},
	'Perkeo': {
		rarity: 'legendary',
	},
}
