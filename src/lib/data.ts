import { flush, nOfAKind, straight } from '#lib/getHand.js'
import { isFaceCard } from '#utilities/isFaceCard.js'
import { isRank } from '#utilities/isRank.js'
import { isSuit } from '#utilities/isSuit.js'
import type { BlindName, DeckName, Edition, Enhancement, HandName, JokerDefinition, JokerEdition, JokerName, Rank, Score, Seal, Suit } from '#lib/types.js'

export const BLINDS: BlindName[] = ['Small Blind', 'Big Blind', 'The Hook', 'The Ox', 'The House', 'The Wall', 'The Wheel', 'The Arm', 'The Club', 'The Fish', 'The Psychic', 'The Goad', 'The Water', 'The Window', 'The Manacle', 'The Eye', 'The Mouth', 'The Plant', 'The Serpent', 'The Pillar', 'The Needle', 'The Head', 'The Tooth', 'The Flint', 'The Mark', 'Amber Acorn', 'Verdant Leaf', 'Violet Vessel', 'Crimson Heart', 'Cerulean Bell']

export const DECKS: DeckName[] = ['Red Deck', 'Blue Deck', 'Yellow Deck', 'Green Deck', 'Black Deck', 'Magic Deck', 'Nebula Deck', 'Ghost Deck', 'Abandoned Deck', 'Checkered Deck', 'Zodiac Deck', 'Painted Deck', 'Anaglyph Deck', 'Plasma Deck', 'Erratic Deck', 'Challenge Deck']

export const HANDS: HandName[] = ['Flush Five', 'Flush House', 'Five of a Kind', 'Straight Flush', 'Four of a Kind', 'Full House', 'Flush', 'Straight', 'Three of a Kind', 'Two Pair', 'Pair', 'High Card']

export const ENHANCEMENTS: Enhancement[] = ['none', 'bonus', 'mult', 'wild', 'glass', 'steel', 'stone', 'gold', 'lucky']
export const SEALS: Seal[] = ['none', 'gold', 'red', 'blue', 'purple']
export const EDITIONS: Edition[] = ['base', 'foil', 'holographic', 'polychrome']
export const JOKER_EDITIONS: JokerEdition[] = ['base', 'foil', 'holographic', 'polychrome', 'negative']

export const RANKS: Rank[] = ['Ace', 'King', 'Queen', 'Jack', '10', '9', '8', '7', '6', '5', '4', '3', '2']
export const SUITS: Suit[] = ['Clubs', 'Spades', 'Hearts', 'Diamonds']

export const PLANET_SCORE_SETS: Record<HandName, Score> = {
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

export const DEFAULT_HAND_SCORE_SETS: Record<HandName, Score> = {
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
	'Seltzer',
	'Sock and Buskin',
	'Mime',
]

export const JOKER_DEFINITIONS: Record<JokerName, JokerDefinition> = {
	'Joker': {
		rarity: 'common',
		effect ({ score }) {
			score.multiplier += 4
		},
	},
	'Greedy Joker': {
		rarity: 'common',
		playedCardEffect ({ score, card }) {
			score.multiplier += (isSuit(card, 'Diamonds') ? 4 : 0)
		},
	},
	'Lusty Joker': {
		rarity: 'common',
		playedCardEffect ({ score, card }) {
			score.multiplier += (isSuit(card, 'Hearts') ? 4 : 0)
		},
	},
	'Wrathful Joker': {
		rarity: 'common',
		playedCardEffect ({ score, card }) {
			score.multiplier += (isSuit(card, 'Spades') ? 4 : 0)
		},
	},
	'Gluttonous Joker': {
		rarity: 'common',
		playedCardEffect ({ score, card }) {
			score.multiplier += (isSuit(card, 'Clubs') ? 4 : 0)
		},
	},
	'Jolly Joker': {
		rarity: 'common',
		effect ({ score, state }) {
			const cards = nOfAKind(state.playedCards, 2)
			score.multiplier += (cards.length > 0 ? 8 : 0)
		},
	},
	'Zany Joker': {
		rarity: 'common',
		effect ({ score, state }) {
			const cards = nOfAKind(state.playedCards, 3)
			score.multiplier += (cards.length > 0 ? 8 : 0)
		},
	},
	'Mad Joker': {
		rarity: 'common',
		effect ({ score, state }) {
			const cards = nOfAKind(state.playedCards, 4)
			score.multiplier += (cards.length > 0 ? 8 : 0)
		},
	},
	'Crazy Joker': {
		rarity: 'common',
		effect ({ score, state }) {
			const hasFourFingers = state.jokerSet.has('Four Fingers')
			const hasShortcut = state.jokerSet.has('Shortcut')
			const cards = straight(state.playedCards, hasFourFingers, hasShortcut)
			score.multiplier += (cards.length > 0 ? 12 : 0)
		},
	},
	'Droll Joker': {
		rarity: 'common',
		effect ({ score, state }) {
			const hasFourFingers = state.jokerSet.has('Four Fingers')
			const hasSmearedJoker = state.jokerSet.has('Smeared Joker')
			const cards = flush(state.playedCards, hasFourFingers, hasSmearedJoker)
			score.multiplier += (cards.length > 0 ? 10 : 0)
		},
	},
	'Sly Joker': {
		rarity: 'common',
		effect ({ score, state }) {
			const cards = nOfAKind(state.playedCards, 2)
			score.chips += (cards.length > 0 ? 50 : 0)
		},
	},
	'Wily Joker': {
		rarity: 'common',
		effect ({ score, state }) {
			const cards = nOfAKind(state.playedCards, 3)
			score.chips += (cards.length > 0 ? 100 : 0)
		},
	},
	'Clever Joker': {
		rarity: 'common',
		effect ({ score, state }) {
			const cards = nOfAKind(state.playedCards, 4)
			score.chips += (cards.length > 0 ? 150 : 0)
		},
	},
	'Devious Joker': {
		rarity: 'common',
		effect ({ score, state }) {
			const hasFourFingers = state.jokerSet.has('Four Fingers')
			const hasShortcut = state.jokerSet.has('Shortcut')
			const cards = straight(state.playedCards, hasFourFingers, hasShortcut)
			score.chips += (cards.length > 0 ? 100 : 0)
		},
	},
	'Crafty Joker': {
		rarity: 'common',
		effect ({ score, state }) {
			const hasFourFingers = state.jokerSet.has('Four Fingers')
			const hasSmearedJoker = state.jokerSet.has('Smeared Joker')
			const cards = flush(state.playedCards, hasFourFingers, hasSmearedJoker)
			score.chips += (cards.length > 0 ? 80 : 0)
		},
	},
	'Half Joker': {
		rarity: 'common',
		effect ({ score, state }) {
			score.multiplier += (state.playedCards.length <= 3 ? 20 : 0)
		},
	},
	'Joker Stencil': {
		rarity: 'uncommon',
		effect ({ score, state }) {
			const nonStencilNonNegativeJokers = state.jokers.filter((joker) => joker.name !== 'Joker Stencil' && joker.edition !== 'negative')
			score.multiplier *= Math.max(1, state.jokerSlots - nonStencilNonNegativeJokers.length)
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
		effect ({ score }) {
			score.multiplier += this.plusMultiplier
		},
	},
	'Banner': {
		rarity: 'common',
		effect ({ score, state }) {
			score.chips += (state.discards * 40)
		},
	},
	'Mystic Summit': {
		rarity: 'common',
		effect ({ score, state }) {
			score.multiplier += (state.discards === 0 ? 15 : 0)
		},
	},
	'Marble Joker': {
		rarity: 'uncommon',
	},
	'Loyalty Card': {
		rarity: 'uncommon',
		hasIsActiveInput: true,
		effect ({ score }) {
			score.multiplier *= (this.isActive ? 4 : 0)
		},
	},
	'8 Ball': {
		rarity: 'common',
	},
	'Misprint': {
		rarity: 'common',
		effect ({ score }) {
			score.multiplier += 0
		},
	},
	'Dusk': {
		rarity: 'uncommon',
	},
	'Raised Fist': {
		rarity: 'common',
		effect ({ score, state }) {
			const ranks = state.heldCards.map(({ rank }) => RANK_TO_CHIP_MAP[rank])
			ranks.sort((a, b) => a - b)
			const lowestCardRank = ranks[0]
			score.multiplier += (lowestCardRank ? (2 * lowestCardRank) : 0)
		},
	},
	'Chaos the Clown': {
		rarity: 'common',
	},
	'Fibonacci': {
		rarity: 'uncommon',
		playedCardEffect ({ score, card }) {
			score.multiplier += (isRank(card, ['Ace', '2', '3', '5', '8']) ? 8 : 0)
		},
	},
	'Steel Joker': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		effect ({ score }) {
			score.multiplier *= this.timesMultiplier
		},
	},
	'Scary Face': {
		rarity: 'common',
		playedCardEffect ({ score, state, card }) {
			score.chips += (isFaceCard(card, state.jokerSet.has('Pareidolia')) ? 30 : 0)
		},
	},
	'Abstract Joker': {
		rarity: 'common',
		effect ({ score, state }) {
			score.multiplier += state.jokers.length
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
		effect ({ score }) {
			score.multiplier += 15
		},
	},
	'Even Steven': {
		rarity: 'common',
		playedCardEffect ({ score, card }) {
			score.multiplier += (isRank(card, ['10', '8', '6', '4', '2']) ? 4 : 0)
		},
	},
	'Odd Todd': {
		rarity: 'common',
		playedCardEffect ({ score, card }) {
			score.chips += (isRank(card, ['Ace', '9', '7', '5', '3']) ? 30 : 0)
		},
	},
	'Scholar': {
		rarity: 'common',
		playedCardEffect ({ score, card }) {
			const isAce = isRank(card, 'Ace')
			score.chips += (isAce ? 20 : 0)
			score.multiplier += (isAce ? 4 : 0)
		},
	},
	'Business Card': {
		rarity: 'common',
	},
	'Supernova': {
		rarity: 'common',
		effect ({ score, state }) {
			// TODO: Remove the following by instead incrementing `plays` after determining the played hand.
			// Note: This is counting one extra play because the Joker takes *the current played hand* into account for the calculation.
			score.multiplier += state.handLevels[state.playedHand].plays + 1
		},
	},
	'Ride the Bus': {
		rarity: 'common',
		hasPlusMultiplierInput: true,
		effect ({ score }) {
			score.multiplier += this.plusMultiplier
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
		effect ({ score, state }) {
			const allHandCardsAreSpadesOrClubs = state.heldCards.every((card) => isSuit(card, ['Spades', 'Clubs']))
			score.multiplier *= (allHandCardsAreSpadesOrClubs ? 3 : 1)
		},
	},
	'Runner': {
		rarity: 'common',
		hasPlusChipsInput: true,
		effect ({ score }) {
			score.chips += this.plusChips
		},
	},
	'Ice Cream': {
		rarity: 'common',
		hasPlusChipsInput: true,
		effect ({ score }) {
			score.chips += this.plusChips
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
		effect ({ score }) {
			score.chips += this.plusChips
		},
	},
	'Sixth Sense': {
		rarity: 'rare',
	},
	'Constellation': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		effect ({ score }) {
			score.multiplier *= this.timesMultiplier
		},
	},
	'Hiker': {
		rarity: 'common',
		hasPlusChipsInput: true,
		effect ({ score }) {
			score.chips += this.plusChips
		},
	},
	'Faceless Joker': {
		rarity: 'common',
	},
	'Green Joker': {
		rarity: 'common',
		hasPlusMultiplierInput: true,
		effect ({ score }) {
			score.multiplier += this.plusMultiplier
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
		effect ({ score }) {
			score.multiplier *= 3
		},
	},
	'Card Sharp': {
		rarity: 'uncommon',
		hasIsActiveInput: true,
		effect ({ score }) {
			score.multiplier *= (this.isActive ? 3 : 1)
		},
	},
	'Red Card': {
		rarity: 'common',
		hasPlusMultiplierInput: true,
		effect ({ score }) {
			score.multiplier += this.plusMultiplier
		},
	},
	'Madness': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		effect ({ score }) {
			score.multiplier *= this.timesMultiplier
		},
	},
	'Square Joker': {
		rarity: 'common',
		hasPlusChipsInput: true,
		effect ({ score }) {
			score.chips += this.plusChips
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
		effect ({ score }) {
			score.multiplier *= this.timesMultiplier
		},
	},
	'Shortcut': {
		rarity: 'common',
	},
	'Hologram': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		effect ({ score }) {
			score.multiplier *= this.timesMultiplier
		},
	},
	'Vagabond': {
		rarity: 'uncommon',
	},
	'Baron': {
		rarity: 'rare',
		heldCardEffect ({ score, card }) {
			score.multiplier *= (card.rank === 'King' ? 1.5 : 1)
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
		effect ({ score }) {
			score.multiplier *= this.timesMultiplier
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
		playedCardEffect ({ score, state, card }) {
			const firstPlayedFaceCard = state.playedCards.find((playedCard) => ['King', 'Queen', 'Jack'].includes(playedCard.rank))
			const isFirstPlayedFaceCard = card.index === firstPlayedFaceCard?.index
			score.multiplier *= (isFirstPlayedFaceCard ? 2 : 1)
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
		effect ({ score }) {
			score.multiplier += this.plusMultiplier
		},
	},
	'Reserved Parking': {
		rarity: 'uncommon',
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
		effect ({ score }) {
			score.multiplier += this.plusMultiplier
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
		effect ({ score }) {
			score.chips += this.plusChips
		},
	},
	'Golden Joker': {
		rarity: 'common',
	},
	'Lucky Cat': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		effect ({ score }) {
			score.multiplier *= this.timesMultiplier
		},
	},
	'Baseball Card': {
		rarity: 'rare',
		indirectEffect ({ score, joker }) {
			score.multiplier *= (joker.rarity === 'uncommon' ? 1.5 : 1)
		},
	},
	'Bull': {
		rarity: 'uncommon',
		effect ({ score, state }) {
			score.chips += (state.money * 2)
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
		effect ({ score }) {
			score.multiplier += this.plusMultiplier
		},
	},
	'Popcorn': {
		rarity: 'common',
		hasPlusMultiplierInput: true,
		effect ({ score }) {
			score.multiplier += this.plusMultiplier
		},
	},
	'Spare Trousers': {
		rarity: 'uncommon',
		hasPlusMultiplierInput: true,
		effect ({ score }) {
			score.multiplier += this.plusMultiplier
		},
	},
	'Ancient Joker': {
		// Note: Its effect does **not** does not consider which suits exist in the deck
		rarity: 'rare',
		hasSuitInput: true,
		playedCardEffect ({ score, card }) {
			score.multiplier *= (isSuit(card, this.suit!) ? 1.5 : 1)
		},
	},
	'Ramen': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		effect ({ score }) {
			score.multiplier *= this.timesMultiplier
		},
	},
	'Walkie Talkie': {
		rarity: 'common',
		playedCardEffect ({ score, card }) {
			const isFourOrTen = isRank(card, ['4', '10'])
			score.chips += (isFourOrTen ? 10 : 0)
			score.multiplier += (isFourOrTen ? 4 : 0)
		},
	},
	'Seltzer': {
		rarity: 'uncommon',
	},
	'Castle': {
		rarity: 'uncommon',
		hasPlusChipsInput: true,
		effect ({ score }) {
			score.chips += this.plusChips
		},
	},
	'Smiley Face': {
		rarity: 'common',
		playedCardEffect ({ score, state, card }) {
			score.multiplier += (isFaceCard(card, state.jokerSet.has('Pareidolia')) ? 4 : 0)
		},
	},
	'Campfire': {
		rarity: 'rare',
		hasTimesMultiplierInput: true,
		effect ({ score }) {
			score.multiplier *= this.timesMultiplier
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
		effect ({ score, state }) {
			score.multiplier *= (state.hands === 1 ? 3 : 1)
		},
	},
	'Sock and Buskin': {
		rarity: 'uncommon',
	},
	'Swashbuckler': {
		rarity: 'common',
		hasPlusMultiplierInput: true,
		effect ({ score }) {
			score.multiplier += this.plusMultiplier
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
		effect ({ score }) {
			score.multiplier *= this.timesMultiplier
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
		playedCardEffect ({ score, card }) {
			score.multiplier *= (isSuit(card, 'Hearts') ? 1 : 1)
		},
	},
	'Arrowhead': {
		rarity: 'uncommon',
		playedCardEffect ({ score, card }) {
			score.chips += (isSuit(card, 'Spades') ? 50 : 0)
		},
	},
	'Onyx Agate': {
		rarity: 'uncommon',
		playedCardEffect ({ score, card }) {
			score.multiplier += (isSuit(card, 'Clubs') ? 8 : 0)
		},
	},
	'Glass Joker': {
		rarity: 'uncommon',
		hasTimesMultiplierInput: true,
		effect ({ score }) {
			score.multiplier *= this.timesMultiplier
		},
	},
	'Showman': {
		rarity: 'uncommon',
	},
	'Flowerpot': {
		rarity: 'uncommon',
		effect ({ score, state }) {
			const hasAllSuits = (['Spades', 'Hearts', 'Clubs', 'Diamonds'] as const).every((suit) => {
				return state.scoringCards.some((card) => isSuit(card, suit))
			})

			score.multiplier *= (hasAllSuits ? 3 : 1)
		},
	},
	'Blueprint': {
		rarity: 'rare',
	},
	'Wee Joker': {
		rarity: 'rare',
		hasPlusChipsInput: true,
		effect ({ score }) {
			score.chips += this.plusChips
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
		playedCardEffect ({ score, card }) {
			score.multiplier *= (this.suit && isSuit(card, this.suit) && card.rank === this.rank ? 2 : 1)
		},
	},
	'Seeing Double': {
		rarity: 'uncommon',
		effect ({ score, state }) {
			const hasScoringClubsCard = state.scoringCards.some((card) => isSuit(card, 'Clubs'))
			const hasScoringCardOfOtherSuit = state.scoringCards.some((card) => isSuit(card, ['Spades', 'Hearts', 'Diamonds']))

			score.multiplier *= (hasScoringClubsCard && hasScoringCardOfOtherSuit ? 2 : 1)
		},
	},
	'Matador': {
		rarity: 'uncommon',
	},
	'Hit the Road': {
		rarity: 'rare',
		hasTimesMultiplierInput: true,
		effect ({ score }) {
			score.multiplier *= this.timesMultiplier
		},
	},
	'The Duo': {
		rarity: 'rare',
		effect ({ score, state }) {
			const cards = nOfAKind(state.playedCards, 2)
			score.multiplier *= (cards.length > 0 ? 2 : 1)
		},
	},
	'The Trio': {
		rarity: 'rare',
		effect ({ score, state }) {
			const cards = nOfAKind(state.playedCards, 3)
			score.multiplier *= (cards.length > 0 ? 3 : 1)
		},
	},
	'The Family': {
		rarity: 'rare',
		effect ({ score, state }) {
			const cards = nOfAKind(state.playedCards, 4)
			score.multiplier *= (cards.length > 0 ? 4 : 1)
		},
	},
	'The Order': {
		rarity: 'common',
		effect ({ score, state }) {
			const hasFourFingers = state.jokerSet.has('Four Fingers')
			const hasShortcut = state.jokerSet.has('Shortcut')
			const cards = straight(state.playedCards, hasFourFingers, hasShortcut)
			score.multiplier *= (cards.length > 0 ? 3 : 1)
		},
	},
	'The Tribe': {
		rarity: 'rare',
		effect ({ score, state }) {
			const hasFourFingers = state.jokerSet.has('Four Fingers')
			const hasSmearedJoker = state.jokerSet.has('Smeared Joker')
			const cards = flush(state.playedCards, hasFourFingers, hasSmearedJoker)
			score.multiplier *= (cards.length > 0 ? 2 : 1)
		},
	},
	'Stuntman': {
		rarity: 'uncommon',
		effect ({ score }) {
			score.chips += 300
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
		heldCardEffect ({ score, card }) {
			score.multiplier += (card.rank === 'Queen' ? 13 : 0)
		},
	},
	'Driver\'s license': {
		rarity: 'rare',
		hasIsActiveInput: true,
		effect ({ score }) {
			score.multiplier *= (this.isActive ? 3 : 1)
		},
	},
	'Cartomancer': {
		rarity: 'uncommon',
	},
	'Astronomer': {
		rarity: 'uncommon',
	},
	'Burnt Joker': {
		rarity: 'uncommon',
	},
	'Bootstraps': {
		rarity: 'common',
		effect ({ score, state }) {
			// Note: I'm assuming here that this can't *subtract* multiplier if money is negative.
			const factor = Math.max(0, Math.floor(state.money / 5))
			score.multiplier += (factor * 2)
		},
	},
	'Canio': {
		rarity: 'legendary',
		hasTimesMultiplierInput: true,
		effect ({ score }) {
			score.multiplier *= this.timesMultiplier
		},
	},
	'Triboulet': {
		rarity: 'legendary',
		playedCardEffect ({ score, card }) {
			score.multiplier *= (isRank(card, ['King', 'Queen']) ? 2 : 0)
		},
	},
	'Yorick': {
		rarity: 'legendary',
		hasIsActiveInput: true,
		effect ({ score }) {
			score.multiplier *= (this.isActive ? 3 : 1)
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
