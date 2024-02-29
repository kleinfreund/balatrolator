import { RANK_TO_CHIP_MAP, DEFAULT_HAND_SCORE_SETS, PLANET_SCORE_SETS, JOKER_DEFINITIONS, MODIFIER_DEFAULTS } from '#lib/data.js'
import { getHand } from '#lib/getHand.js'
import type { Card, CardJokerEffect, HandLevel, HandLevels, HandName, HandScore, InitialCard, InitialHandLevels, InitialJoker, InitialState, Joker, JokerEffect, Result, Score, State } from '#lib/types.js'
import { formatScore } from '#utilities/formatScore.js'
import { isFaceCard } from '#utilities/isFaceCard.js'
import { isRank } from '#/utilities/isRank.js'
import { log, logGroup, logGroupEnd } from '#utilities/log.js'

export function calculateScore (initialState: InitialState): Result {
	const state = getState(initialState)
	log('state', state)
	log('\nHand levels', state.handBaseScores[state.playedHand])

	const chips = getChips(state)
	const multiplier = getMultiplier(state)
	log('\nExpected', { chips: 340, multiplier: 1685e13 })
	log('Balanced', { chips: 2.470e16, multiplier: 2.470e16 })
	log('Received', { chips, multiplier })

	let actualScore
	if (state.deck === 'Plasma Deck') {
		actualScore = Math.pow((chips + multiplier) / 2, 2)
	} else {
		actualScore = chips * multiplier
	}
	// Balatro seems to round values starting at a certain threshold and it seems to round down. 🤔
	const score = actualScore > 10000 ? Math.floor(actualScore) : actualScore

	return {
		hand: state.playedHand,
		scoringCards: state.scoringCards,
		score,
		formattedScore: formatScore(score),
	}
}

function getChips (state: State): number {
	log('\nCHIPS')
	const plusChipsPerCard = state.scoringCards.map((card) => {
		logGroup(`Card effects: ${card}`)
		let chips = 0
		log('→', chips)
		// 0. Debuffed cards don't participate in scoring period
		if (card.isDebuffed) {
			logGroupEnd('← Debuffed.')
			return 0
		}

		let numberOfTriggers = 1
		if (state.jokerSet.has('Seltzer')) numberOfTriggers++
		if (state.jokerSet.has('Sock and Buskin') && isFaceCard({ state, card })) numberOfTriggers++
		if (state.jokerSet.has('Hanging Chad') && card.index === 0) numberOfTriggers++
		if (state.jokerSet.has('Hack') && isRank({ card }, ['2', '3', '4', '5'])) numberOfTriggers++
		if (card.seal === 'red') numberOfTriggers *= 2

		while (numberOfTriggers--) {
			// 1. +Chips
			chips += card.enhancement !== 'stone' ? RANK_TO_CHIP_MAP[card.rank] : 0
			chips += MODIFIER_DEFAULTS.enhancement[card.enhancement].plusChips ?? 0
			chips += MODIFIER_DEFAULTS.edition[card.edition].plusChips ?? 0

			// 2. Jokers
			for (const joker of state.jokers) {
				logGroup(`Card effects: ${joker}`)
				log('→', chips)
				chips = joker.applyCardPlusChips({ state, value: chips, card })
				logGroupEnd('←', chips)
			}
		}

		logGroupEnd('←', chips)

		return chips
	})

	// TODO: There should be a better way to apply blind effects
	// Yes, this value is indeed rounded here.
	const baseChips = Math.round(state.handBaseScores[state.playedHand].chips * (state.blind === 'The Flint' ? 0.5 : 1))
	let chips = plusChipsPerCard.reduce((total, chips) => total + chips, baseChips)

	log('=>', chips)

	for (const joker of state.jokers) {
		logGroup(`Effects: ${joker}`)
		log('→', chips)
		let numberOfTriggers = 1
		while (numberOfTriggers--) {
			chips = joker.applyPlusChips({ state, value: chips })
		}
		logGroupEnd('←', chips)

		logGroup(`Enhancements: ${joker}`)
		log('→', chips)
		chips += MODIFIER_DEFAULTS.edition[joker.edition].plusChips ?? 0
		logGroupEnd('←', chips)
	}

	log('=>', chips)

	return chips
}

function getMultiplier (state: State): number {
	log('\nMULTIPLIER')
	// TODO: There should be a better way to apply blind effects
	// Yes, this value is indeed rounded here.
	const baseMultiplier = Math.round(state.handBaseScores[state.playedHand].multiplier * (state.blind === 'The Flint' ? 0.5 : 1))

	let multiplier = state.scoringCards.reduce((multiplier, card) => {
		logGroup(`Card effects: ${card}`)
		log('→', multiplier)
		// 0. Debuffed cards don't participate in scoring period
		if (card.isDebuffed) {
			logGroupEnd('← Debuffed.')
			return multiplier
		}

		let numberOfTriggers = 1
		if (state.jokerSet.has('Seltzer')) numberOfTriggers++
		if (state.jokerSet.has('Sock and Buskin') && isFaceCard({ state, card })) numberOfTriggers++
		if (state.jokerSet.has('Hanging Chad') && card.index === 0) numberOfTriggers++
		if (state.jokerSet.has('Hack') && isRank({ card }, ['2', '3', '4', '5'])) numberOfTriggers++
		if (card.seal === 'red') numberOfTriggers *= 2

		while (numberOfTriggers--) {
			// 1. +Mult
			multiplier += MODIFIER_DEFAULTS.enhancement[card.enhancement].plusMultiplier ?? 0
			multiplier += MODIFIER_DEFAULTS.edition[card.edition].plusMultiplier ?? 0

			// 2. xMult
			multiplier *= MODIFIER_DEFAULTS.edition[card.edition].timesMultiplier ?? 1
			multiplier *= MODIFIER_DEFAULTS.enhancement[card.enhancement].timesMultiplier ?? 1

			// 3. Jokers
			for (const joker of state.jokers) {
				logGroup(`Card effects: ${joker}`)
				log('→', multiplier)
				multiplier = joker.applyCardPlusMultiplier({ state, value: multiplier, card })
				multiplier = joker.applyCardTimesMultiplier({ state, value: multiplier, card })
				logGroupEnd('←', multiplier)
			}
		}

		logGroupEnd('←', multiplier)

		return multiplier
	}, baseMultiplier)

	log('=>', multiplier)

	multiplier = state.heldCards.reduce((multiplier, card) => {
		logGroup(`Held card effects: ${card}`)
		log('→', multiplier)
		if (card.isDebuffed) {
			logGroupEnd('← Debuffed.')
			return multiplier
		}

		let numberOfTriggers = 1
		if (state.jokerSet.has('Seltzer')) numberOfTriggers++
		if (state.jokerSet.has('Sock and Buskin') && isFaceCard({ state, card })) numberOfTriggers++
		if (state.jokerSet.has('Mime')) numberOfTriggers++
		if (card.seal === 'red') numberOfTriggers *= 2

		while (numberOfTriggers--) {
			multiplier *= MODIFIER_DEFAULTS.enhancement[card.enhancement].timesMultiplier ?? 1

			// 3. Jokers
			for (const joker of state.jokers) {
				logGroup(`Card effects: ${joker}`)
				log('→', multiplier)
				multiplier = joker.applyHeldCardPlusMultiplier({ state, value: multiplier, card })
				multiplier = joker.applyHeldCardTimesMultiplier({ state, value: multiplier, card })
				logGroupEnd('←', multiplier)
			}
		}

		logGroupEnd('←', multiplier)

		return multiplier
	}, multiplier)

	log('=>', multiplier)

	for (const joker of state.jokers) {
		logGroup(`General effects: ${joker}`)
		log('→', multiplier)
		let numberOfTriggers = 1
		while (numberOfTriggers--) {
			multiplier = joker.applyPlusMultiplier({ state, value: multiplier })
			multiplier = joker.applyTimesMultiplier({ state, value: multiplier })
		}
		logGroupEnd('←', multiplier)

		logGroup(`Enhancements: ${joker}`)
		log('→', multiplier)
		if (joker.rarity === 'uncommon' && state.jokerSet.has('Baseball Card')) {
			// This is SUPER whacky. Blueprint applying to Baseball Card is very difficult to model because the Baseball Card effect applies when applying the general effects of Jokers and *not* when applying general effects of Baseball Card.
			const blueprintIndex = state.jokers.findIndex(({ name }) => name === 'Blueprint')
			const rightJoker = blueprintIndex !== -1 ? state.jokers[blueprintIndex + 1] : undefined
			multiplier *= 1.5 * (rightJoker?.name === 'Baseball Card' ? 1.5 : 1)
		}
		multiplier += MODIFIER_DEFAULTS.edition[joker.edition].plusMultiplier ?? 0
		multiplier *= MODIFIER_DEFAULTS.edition[joker.edition].timesMultiplier ?? 1
		logGroupEnd('←', multiplier)
	}

	log('=>', multiplier)

	return multiplier
}

export function getState (initialState: InitialState): State {
	const {
		hands = 0,
		discards = 0,
		money = 0,
		blind = 'Small Blind',
		deck = 'Red Deck',
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
	const playedCards = getCards(initialPlayedCards)
	const heldCards = getCards(initialHeldCards)

	const hasFourFingers = jokerSet.has('Four Fingers')
	const hasShortcut = jokerSet.has('Shortcut')
	const { playedHand, scoringCards: preliminaryScoringCards } = getHand(playedCards, { hasFourFingers, hasShortcut })

	const scoringCards = jokerSet.has('Splash') ? playedCards : preliminaryScoringCards

	const blueprintIndex = jokers.findIndex((joker) => joker.name === 'Blueprint')
	let blueprintTarget
	if (blueprintIndex !== -1 && jokers[blueprintIndex + 1]) {
		blueprintTarget = jokers[blueprintIndex + 1]!.name
	}

	let brainstormTarget
	if (jokerSet.has('Brainstorm') && jokers[0]) {
		brainstormTarget = jokers[0]!.name
	}

	return {
		hands,
		discards,
		money,
		blind,
		deck,
		handLevels,
		handBaseScores,
		jokers,
		jokerSet,
		jokerSlots,
		blueprintTarget,
		brainstormTarget,
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
			edition = 'base',
			plusChips = 0,
			plusMultiplier = 0,
			timesMultiplier = 1,
			isActive = false,
		} = initialJoker

		const modifiers = [initialJoker.edition].filter((modifier) => modifier !== undefined)
		const toString = () => `${initialJoker.name}`
			+ (modifiers.length > 0 ? ` (${modifiers.join(', ')})` : '')

		const definition = JOKER_DEFINITIONS[initialJoker.name]

		const applyPlusChips = createEffect(definition.applyPlusChips)
		const applyCardPlusChips = createCardEffect(definition.applyCardPlusChips)
		const applyHeldCardPlusChips = createCardEffect(definition.applyHeldCardPlusChips)

		const applyPlusMultiplier = createEffect(definition.applyPlusMultiplier)
		const applyCardPlusMultiplier = createCardEffect(definition.applyCardPlusMultiplier)
		const applyHeldCardPlusMultiplier = createCardEffect(definition.applyHeldCardPlusMultiplier)

		const applyTimesMultiplier = createEffect(definition.applyTimesMultiplier)
		const applyCardTimesMultiplier = createCardEffect(definition.applyCardTimesMultiplier)
		const applyHeldCardTimesMultiplier = createCardEffect(definition.applyHeldCardTimesMultiplier)

		const {
			rarity,
			probability = { numerator: 1, denominator: 1 },
		} = definition

		return {
			...initialJoker,
			rarity,
			probability,
			applyPlusChips,
			applyCardPlusChips,
			applyHeldCardPlusChips,
			applyPlusMultiplier,
			applyCardPlusMultiplier,
			applyHeldCardPlusMultiplier,
			applyTimesMultiplier,
			applyCardTimesMultiplier,
			applyHeldCardTimesMultiplier,
			toString,
			index,
			edition,
			plusChips,
			plusMultiplier,
			timesMultiplier,
			isActive,
		}
	})
}

function createEffect (effect?: JokerEffect): JokerEffect {
	if (effect) {
		return function (options) {
			const value = effect.call(this, options)

			let factor = 1
			if (options.state.blueprintTarget === this.name) factor *= 2
			if (options.state.brainstormTarget === this.name) factor *= 2

			return value * factor
		}
	}

	return ({ value }) => value
}

function createCardEffect (effect?: CardJokerEffect): CardJokerEffect {
	if (effect) {
		return function (options) {
			const value = effect.call(this, options)

			let factor = 1
			if (options.state.blueprintTarget === this.name) factor *= 2
			if (options.state.brainstormTarget === this.name) factor *= 2

			return value * factor
		}
	}

	return ({ value }) => value
}

export function getCards (cards: InitialCard[]): Card[] {
	return cards.map((card, index) => {
		const {
			edition = 'base',
			enhancement = 'none',
			seal = 'none',
			isDebuffed = false,
		} = card

		const modifiers = [card.edition, card.enhancement, card.seal].filter((modifier) => modifier !== undefined)
		const toString = () => `${card.rank} of ${card.suit}`
			+ (modifiers.length > 0 ? ` (${modifiers.join(', ')})` : '')

		return {
			...card,
			toString,
			index,
			edition,
			enhancement,
			seal,
			isDebuffed,
		}
	})
}
