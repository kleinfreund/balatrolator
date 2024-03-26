import { DEFAULT_HAND_SCORE_SETS, PLANET_SCORE_SETS, JOKER_DEFINITIONS } from '#lib/data.js'
import { getHand } from '#lib/getHand.js'
import { isDebuffed } from '#utilities/isDebuffed.js'
import type { Card, HandLevel, HandLevels, HandName, HandScore, InitialCard, InitialHandLevels, InitialJoker, InitialState, Joker, Score, State } from '#lib/types.js'

export function getState (initialState: InitialState): State {
	const {
		hands = 0,
		discards = 0,
		money = 0,
		blind: initialBlind,
		deck = 'Red Deck',
		observatoryHands = [],
		handLevels: initialHandLevels = {},
		jokers: initialJokers = [],
		jokerSlots = 5,
		playedCards: initialPlayedCards = [],
		heldCards: initialHeldCards = [],
	} = initialState

	const handLevels = getHandLevels(initialHandLevels)
	const handBaseScores = getHandBaseScores(handLevels)
	const jokers = getJokers(initialJokers)
	const jokerSet = new Set(jokers.map(({ name }) => name))

	const blindIsActive = jokerSet.has('Chicot') ? false : (initialBlind?.isActive ?? true)
	const blind = {
		name: initialBlind?.name ?? 'Small Blind',
		isActive: blindIsActive,
	}

	const playedCards = getCards(initialPlayedCards).map((card) => ({
		...card,
		isDebuffed: card.isDebuffed ? true : isDebuffed(card, blind, jokerSet.has('Pareidolia')),
	}))
	const heldCards = getCards(initialHeldCards).map((card) => ({
		...card,
		isDebuffed: card.isDebuffed ? true : isDebuffed(card, blind, jokerSet.has('Pareidolia')),
	}))

	const hasFourFingers = jokerSet.has('Four Fingers')
	const hasShortcut = jokerSet.has('Shortcut')
	const { playedHand, scoringCards: preliminaryScoringCards } = getHand(playedCards, { hasFourFingers, hasShortcut })

	const scoringCards = jokerSet.has('Splash') ? playedCards : preliminaryScoringCards

	return {
		hands,
		discards,
		money,
		blind,
		deck,
		observatoryHands,
		handLevels,
		handBaseScores,
		jokers,
		jokerSet,
		jokerSlots,
		playedCards,
		heldCards,
		playedHand,
		scoringCards,
	}
}

function getHandLevels (initialHandLevels: InitialHandLevels): HandLevels {
	const handNames = Object.keys(DEFAULT_HAND_SCORE_SETS) as HandName[]
	const handLevelEntries = handNames.map<[HandName, HandLevel]>((handName) => [handName, initialHandLevels[handName] ?? { level: 1, plays: 0 }])

	return Object.fromEntries(handLevelEntries) as HandLevels
}

function getHandBaseScores (handLevels: HandLevels): HandScore {
	const handLevelEntries = Object.entries(handLevels) as [HandName, HandLevel][]
	const handBaseScoresEntries = handLevelEntries.map<[HandName, Score]>(([handName, { level }]) => {
		const defaultScore = DEFAULT_HAND_SCORE_SETS[handName]
		const levelBasedScore = PLANET_SCORE_SETS[handName]

		// Hand levels start at level 1 which effectively adds the default score sets. It is, however, possible that hand levels are set to 0. Then, the default score set doesn't apply
		const chips = level === 0 ? 0 : (defaultScore.chips + (level - 1) * levelBasedScore.chips)
		const multiplier = level === 0 ? 0 : (defaultScore.multiplier + (level - 1) * levelBasedScore.multiplier)

		return [handName, { chips, multiplier }]
	})

	return Object.fromEntries(handBaseScoresEntries) as HandScore
}

function getJokers (initialJokers: InitialJoker[]): Joker[] {
	return initialJokers.map((initialJoker, index) => {
		const {
			name,
			edition = 'base',
			plusChips = 0,
			plusMultiplier = 0,
			timesMultiplier = 1,
			rank,
			suit,
			isActive = false,
		} = initialJoker

		const {
			rarity,
			effect,
			indirectEffect,
			playedCardEffect,
			heldCardEffect,
		} = JOKER_DEFINITIONS[name]
		const modifiers = [edition].filter((modifier) => modifier !== undefined)
		const toString = () => `${name}` + (modifiers.length > 0 ? ` (${modifiers.join(', ')})` : '')

		return {
			name,
			edition,
			plusChips,
			plusMultiplier,
			timesMultiplier,
			rank,
			suit,
			isActive,
			rarity,
			effect,
			indirectEffect,
			playedCardEffect,
			heldCardEffect,
			index,
			toString,
		}
	})
}

export function getCards (cards: InitialCard[]): Card[] {
	return cards.map((card, index) => {
		const {
			rank,
			suit,
			edition = 'base',
			enhancement = 'none',
			seal = 'none',
			isDebuffed = false,
		} = card

		const modifiers = [edition, enhancement, seal].filter((modifier) => modifier !== undefined)
		const toString = () => `${rank} of ${suit}` + (modifiers.length > 0 ? ` (${modifiers.join(', ')})` : '')

		return {
			rank,
			suit,
			edition,
			enhancement,
			seal,
			isDebuffed,
			index,
			toString,
		}
	})
}
