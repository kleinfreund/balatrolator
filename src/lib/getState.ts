import { DEFAULT_HAND_SCORE_SETS, PLANET_SCORE_SETS, JOKER_DEFINITIONS, HANDS } from './data.js'
import { getHand } from './getHand.js'
import { isDebuffed } from './cards.js'
import type { Card, HandLevel, HandLevels, HandName, HandScore, InitialCard, InitialHandLevels, InitialJoker, InitialObservatory, InitialState, Joker, Observatory, Score, State } from './types.js'

export function getState (initialState: InitialState): State {
	const {
		hands = 0,
		discards = 0,
		money = 0,
		blind: initialBlind,
		deck = 'Red Deck',
		observatory: initialObservatory = {},
		handLevels: initialHandLevels = {},
		jokers: initialJokers = [],
		jokerSlots = 5,
		cards: initialCards = [],
	} = initialState

	const observatory = getObservatory(initialObservatory)
	const handLevels = getHandLevels(initialHandLevels)
	const handBaseScores = getHandBaseScores(handLevels)
	const jokers = getJokers(initialJokers)
	const jokerSet = new Set(jokers.map(({ name }) => name))

	const blindIsActive = jokerSet.has('Chicot') ? false : (initialBlind?.active ?? true)
	const blind = {
		name: initialBlind?.name ?? 'Small Blind',
		active: blindIsActive,
	}

	const cards = getCards(initialCards).map((card) => ({
		...card,
		debuffed: card.debuffed ? true : isDebuffed(card, blind, jokerSet.has('Pareidolia')),
	}))

	const hasFourFingers = jokerSet.has('Four Fingers')
	const hasShortcut = jokerSet.has('Shortcut')
	const hasSmearedJoker = jokerSet.has('Smeared Joker')
	const playedCards = cards.filter((card) => card.played)
	const { playedHand, scoringCards: preliminaryScoringCards } = getHand(playedCards, { hasFourFingers, hasShortcut, hasSmearedJoker })

	const scoringCards = jokerSet.has('Splash') ? playedCards : preliminaryScoringCards

	return {
		hands,
		discards,
		money,
		blind,
		deck,
		observatory,
		handLevels,
		handBaseScores,
		jokers,
		jokerSet,
		jokerSlots,
		cards,
		playedHand,
		scoringCards,
	}
}

function getObservatory (initialObservatory: InitialObservatory): Observatory {
	const observatoryEntries = HANDS.map((handName) => [handName, initialObservatory[handName] ?? 0])

	return Object.fromEntries(observatoryEntries) as Observatory

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
			active = false,
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
			active,
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
			debuffed = false,
			played = false,
		} = card

		const modifiers = [edition, enhancement, seal].filter((modifier) => modifier !== undefined)
		const toString = () => `${rank} of ${suit}` + (modifiers.length > 0 ? ` (${modifiers.join(', ')})` : '')

		return {
			rank,
			suit,
			edition,
			enhancement,
			seal,
			debuffed,
			played,
			index,
			toString,
		}
	})
}
