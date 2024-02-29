import { RANK_TO_CHIP_MAP, DEFAULT_HAND_SCORE_SETS, PLANET_SCORE_SETS, JOKER_DEFINITIONS, MODIFIER_DEFAULTS } from '#lib/data.js'
import { getHand } from '#lib/getHand.js'
import type { Card, CardEffect, HandLevel, HandLevels, HandName, HandScore, InitialCard, InitialHandLevels, InitialJoker, InitialState, Joker, Effect, Result, Score, State, IndirectEffect } from '#lib/types.js'
import { formatScore } from '#utilities/formatScore.js'
import { isFaceCard } from '#utilities/isFaceCard.js'
import { isRank } from '#/utilities/isRank.js'
import { log, logGroup, logGroupEnd } from '#utilities/log.js'
import { notNullish } from '../utilities/notNullish.js'

export function calculateScore (initialState: InitialState): Result {
	const state = getState(initialState)

	const { chips, multiplier } = getScore(state)

	log('\nReceived:', { chips, multiplier })
	log('Expected:', { chips: 340, multiplier: 1685e13 })

	let actualScore
	if (state.deck === 'Plasma Deck') {
		log('Balanced:', { chips: 2.470e16, multiplier: 2.470e16 })
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

function getScore (state: State): Score {
	const { chips: baseChips, multiplier: baseMultiplier } = state.handBaseScores[state.playedHand]

	// Step 0. Determine base chips and multiplier.
	log('\n0. Determining base score …')
	// The Flint halves the base chips and multiplier.
	// The base score seems to be rounded here.
	const baseFactor = (state.blind === 'The Flint' ? 0.5 : 1)
	const score: Score = {
		chips: Math.round(baseChips * baseFactor),
		multiplier: Math.round(baseMultiplier * baseFactor),
	}
	log('\n0. BASE SCORE =>', score)

	log('\n1. Scoring played cards …')
	for (const card of state.scoringCards) {
		logGroup(`\n→ ${card}`, score)
		scoreScoringCard(state, card, score)
		logGroupEnd(`← ${card}`, score)
	}
	log('\n1. PLAYED CARD SCORE =>', score)

	log('\n2. Scoring held cards …')
	for (const card of state.heldCards) {
		logGroup(`\n→ ${card}`, score)
		scoreHeldCard(state, card, score)
		logGroupEnd(`← ${card}`, score)
	}
	log('\n2. HELD CARD SCORE =>', score)

	log('\n3. Scoring jokers …')
	for (const joker of state.jokers) {
		logGroup(`\n→ ${joker}`, score)
		scoreJoker(state, joker, score)
		logGroupEnd(`← ${joker}`, score)
	}
	log('\n3. JOKER SCORE =>', score)

	return score
}

function scoreScoringCard (state: State, card: Card, score: Score): Score {
	// 1.0. Debuffed cards don't participate in scoring period
	if (card.isDebuffed) {
		logGroupEnd('!!! Debuffed !!!')
		return score
	}

	let numberOfTriggers = 1
	if (state.jokerSet.has('Seltzer')) numberOfTriggers++
	if (state.jokerSet.has('Sock and Buskin') && isFaceCard({ state, card })) numberOfTriggers++
	if (state.jokerSet.has('Hanging Chad') && card.index === 0) numberOfTriggers++
	if (state.jokerSet.has('Hack') && isRank({ card }, ['2', '3', '4', '5'])) numberOfTriggers++
	if (card.seal === 'red') numberOfTriggers *= 2

	for (let trigger = 0; trigger < numberOfTriggers; trigger++) {
		log(`Trigger: ${trigger + 1} Score:`, score)

		// 1.1. +Chips
		if (card.enhancement !== 'stone') {
			score.chips += RANK_TO_CHIP_MAP[card.rank]
			log(score, '(+Chips from rank)')
		}

		const { plusChips: plusChipsEnhancement } = MODIFIER_DEFAULTS.enhancement[card.enhancement]
		if (plusChipsEnhancement) {
			score.chips += plusChipsEnhancement
			log(score, '(+Chips from enhancement)')
		}

		const { plusChips: plusChipsEdition } = MODIFIER_DEFAULTS.edition[card.edition]
		if (plusChipsEdition) {
			score.chips += plusChipsEdition
			log(score, '(+Chips from edition)')
		}

		// 1.2. +Mult
		const { plusMultiplier: plusMultiplierEnhancement } = MODIFIER_DEFAULTS.enhancement[card.enhancement]
		if (plusMultiplierEnhancement) {
			score.multiplier += plusMultiplierEnhancement
			log(score, '(+Mult from enhancement)')
		}

		const { plusMultiplier: plusMultiplierEdition } = MODIFIER_DEFAULTS.edition[card.edition]
		if (plusMultiplierEdition) {
			score.multiplier += plusMultiplierEdition
			log(score, '(+Mult from edition)')
		}

		// 1.3. xMult
		const { timesMultiplier: timesMultiplierEnhancement } = MODIFIER_DEFAULTS.enhancement[card.enhancement]
		if (timesMultiplierEnhancement) {
			score.multiplier *= timesMultiplierEnhancement
			log(score, '(xMult from enhancement)')
		}

		const { timesMultiplier: timesMultiplierEdition } = MODIFIER_DEFAULTS.edition[card.edition]
		if (timesMultiplierEdition) {
			score.multiplier *= timesMultiplierEdition
			log(score, '(xMult from edition)')
		}

		// 1.4. Jokers
		for (const joker of state.jokers) {
			joker.cardEffect({ state, score, card })
			log(score, `(${joker})`)
		}
	}

	return score
}

function scoreHeldCard (state: State, card: Card, score: Score): Score {
	// 2.0. Debuffed cards don't participate in scoring period
	if (card.isDebuffed) {
		logGroupEnd('!!! Debuffed !!!')
		return score
	}

	let numberOfTriggers = 1
	if (state.jokerSet.has('Seltzer')) numberOfTriggers++
	if (state.jokerSet.has('Sock and Buskin') && isFaceCard({ state, card })) numberOfTriggers++
	if (state.jokerSet.has('Mime')) numberOfTriggers++
	if (card.seal === 'red') numberOfTriggers *= 2

	for (let trigger = 0; trigger < numberOfTriggers; trigger++) {
		log(`Trigger: ${trigger + 1} Score:`, score)

		// TODO: Almost certain this is a bug. Held cards don't score enhancements *except* for steel cards (possibly with red seal). So this needs to be locked down more precisely.
		const { timesMultiplier: timesMultiplierEnhancement } = MODIFIER_DEFAULTS.enhancement[card.enhancement]
		if (timesMultiplierEnhancement) {
			score.multiplier *= timesMultiplierEnhancement
			log(score, '(xMult from enhancement)')
		}

		for (const joker of state.jokers) {
			// TODO: This is probably a bug. There are no +Mult effects from Jokers applying to held cards that I can think of. E.g. glass cards held in hand don't score.
			joker.heldCardEffect({ state, score, card })
			log(score, `(${joker})`)
		}
	}

	return score
}

function scoreJoker (state: State, joker: Joker, score: Score): Score {
	// 1. Joker effect
	joker.effect({ state, score })

	// 2. +Chips
	const { plusChips: plusChipsEdition } = MODIFIER_DEFAULTS.edition[joker.edition]
	if (plusChipsEdition) {
		score.chips += plusChipsEdition
		log(score, '(+Chips from edition)')
	}

	// 3. +Mult
	const { plusMultiplier: plusMultiplierEdition } = MODIFIER_DEFAULTS.edition[joker.edition]
	if (plusMultiplierEdition) {
		score.multiplier += plusMultiplierEdition
		log(score, '(+Mult from edition)')
	}

	// 4. xMult
	const { timesMultiplier: timesMultiplierEdition } = MODIFIER_DEFAULTS.edition[joker.edition]
	if (timesMultiplierEdition) {
		score.multiplier *= timesMultiplierEdition
		log(score, '(xMult from edition)')
	}

	return score
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

		const effect = createEffect(definition.effect)
		const indirectEffect = createIndirectEffect(definition.indirectEffect)
		const cardEffect = createCardEffect(definition.cardEffect)
		const heldCardEffect = createCardEffect(definition.heldCardEffect)

		const {
			rarity,
			probability = { numerator: 1, denominator: 1 },
		} = definition

		return {
			...initialJoker,
			rarity,
			probability,
			effect,
			indirectEffect,
			cardEffect,
			heldCardEffect,
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

// When scoring Mime:
// 1. Blueprint triggers Baseball Card effect
// 2. Baseball Card effect triggers

function createEffect (effect?: Effect): Effect {
	return function (options) {
		let triggers = 1

		// Increase triggers from Blueprint
		const blueprintTargets = options.state.jokers
			.filter(({ name }) => name === 'Blueprint')
			.map(({ index }) => options.state.jokers[index + 1])
			.filter(notNullish)

		for (const { name } of blueprintTargets) {
			if (name === this.name) triggers++
		}

		// Increase triggers from Brainstorm
		const brainstormTargets = options.state.jokers
			.filter(({ name }) => name === 'Brainstorm')
			.map(() => options.state.jokers[0])
			.filter(notNullish)

		for (const { name } of brainstormTargets) {
			if (name === this.name) triggers++
		}

		for (let trigger = 0; trigger < triggers; trigger++) {
			log(`Trigger: ${trigger + 1} Score:`, options.score)
			if (effect) {
				effect.call(this, options)
				log(options.score, `(${this.name})`)
			}

			for (const blueprintTarget of blueprintTargets) {
				blueprintTarget.indirectEffect({ ...options, joker: this })
				log(options.score, `(Blueprint copying ${blueprintTarget.name})`)
			}

			// TODO: Add Brainstorm

			const baseballCards = options.state.jokers.filter(({ name }) => name === 'Baseball Card')
			for (const baseballCard of baseballCards) {
				baseballCard.indirectEffect({ ...options, joker: this })
				log(options.score, `(${baseballCard.name})`)
			}
		}
	}
}

function createIndirectEffect (effect?: IndirectEffect): IndirectEffect {
	return function (options) {
		if (effect) {
			effect.call(this, options)
		}
	}
}

function createCardEffect (effect?: CardEffect): CardEffect {
	return function (options) {
		let triggers = 1

		// Increase triggers from Blueprint
		const blueprintTargets = options.state.jokers
			.filter(({ name }) => name === 'Blueprint')
			.map(({ index }) => options.state.jokers[index + 1])
			.filter(notNullish)

		for (const { name } of blueprintTargets) {
			if (name === this.name) triggers++
		}

		// Increase triggers from Brainstorm
		const brainstormTargets = options.state.jokers
			.filter(({ name }) => name === 'Brainstorm')
			.map(() => options.state.jokers[0])
			.filter(notNullish)

		for (const { name } of brainstormTargets) {
			if (name === this.name) triggers++
		}

		for (let trigger = 0; trigger < triggers; trigger++) {
			log(`Trigger: ${trigger + 1} Score:`, options.score)
			if (effect) {
				effect.call(this, options)
				log(options.score, `(${this.name})`)
			}
		}
	}
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
