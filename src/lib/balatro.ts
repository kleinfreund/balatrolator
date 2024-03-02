import { RANK_TO_CHIP_MAP, DEFAULT_HAND_SCORE_SETS, PLANET_SCORE_SETS, JOKER_DEFINITIONS, MODIFIER_DEFAULTS, PLAYED_CARD_RETRIGGER_JOKER_NAMES, HELD_CARD_RETRIGGER_JOKER_NAMES } from '#lib/data.js'
import { getHand } from '#lib/getHand.js'
import type { Card, HandLevel, HandLevels, HandName, HandScore, InitialCard, InitialHandLevels, InitialJoker, InitialState, Joker, JokerCardEffect, JokerEffect, Modifier, Result, Score, State } from '#lib/types.js'
import { formatScore } from '#utilities/formatScore.js'
import { log, logGroup, logGroupEnd } from '#utilities/log.js'
import { isFaceCard } from '#utilities/isFaceCard.js'
import { isRank } from '#utilities/isRank.js'
import { notNullish } from '#utilities/notNullish.js'
import { resolveJoker } from '#utilities/resolveJokers.js'

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

		// Debuffed cards don't participate in scoring at all.
		if (card.isDebuffed) {
			logGroupEnd('!!! Debuffed !!!')
			continue
		}

		const triggers = getPlayedCardTriggers({ state, card })
		for (const [index, trigger] of triggers.entries()) {
			log(`Trigger: ${index + 1} (${trigger})`)
			scorePlayedCard({ state, score, card })
		}

		logGroupEnd(`← ${card}`, score)
	}
	log('\n1. PLAYED CARD SCORE =>', score)

	log('\n2. Scoring held cards …')
	for (const card of state.heldCards) {
		logGroup(`\n→ ${card}`, score)

		// Debuffed cards don't participate in scoring at all.
		if (card.isDebuffed) {
			logGroupEnd('!!! Debuffed !!!')
			continue
		}

		const triggers = getHeldCardTriggers({ state, card })
		for (const [index, trigger] of triggers.entries()) {
			log(`Trigger: ${index + 1} (${trigger})`)
			scoreHeldCard({ state, score, card })
		}

		logGroupEnd(`← ${card}`, score)
	}
	log('\n2. HELD CARD SCORE =>', score)

	log('\n3. Scoring jokers …')
	for (const joker of state.jokers) {
		logGroup(`\n→ ${joker}`, score)
		scoreJoker({ state, score, joker })
		logGroupEnd(`← ${joker}`, score)
	}
	log('\n3. JOKER SCORE =>', score)

	return score
}

function getPlayedCardTriggers ({ state, card }: { state: State, card: Card }): string[] {
	const triggers = ['Regular']
	const retriggerJokerNames = state.jokers
		.map((joker) => resolveJoker(state, joker))
		.filter(notNullish)
		.map(({ name }) => name)
		.filter((name) => PLAYED_CARD_RETRIGGER_JOKER_NAMES.includes(name))

	for (const name of retriggerJokerNames) {
		switch (name) {
			case 'Dusk': {
				if (state.hands === 1) triggers.push(name)
				break
			}
			case 'Hack': {
				if (isRank({ card }, ['2', '3', '4', '5'])) triggers.push(name)
				break
			}
			case 'Hanging Chad': {
				if (card.index === 0) triggers.push(name)
				break
			}
			case 'Seltzer': {
				triggers.push(name)
				break
			}
			case 'Sock and Buskin': {
				if (isFaceCard({ state, card })) triggers.push(name)
				break
			}
		}
	}

	if (card.seal === 'red') {
		triggers.push('Red Seal')
	}

	return triggers
}

function getHeldCardTriggers ({ state, card }: { state: State, card: Card }): string[] {
	const triggers = ['Regular']
	const retriggerJokerNames = state.jokers
		.map((joker) => resolveJoker(state, joker))
		.filter(notNullish)
		.map(({ name }) => name)
		.filter((name) => HELD_CARD_RETRIGGER_JOKER_NAMES.includes(name))

	for (const name of retriggerJokerNames) {
		switch (name) {
			case 'Mime': {
				triggers.push(name)
				break
			}
			case 'Seltzer': {
				triggers.push(name)
				break
			}
			case 'Sock and Buskin': {
				if (isFaceCard({ state, card })) triggers.push(name)
				break
			}
		}
	}

	if (card.seal === 'red') {
		triggers.push('Red Seal')
	}

	return triggers
}

function scorePlayedCard ({ state, score, card }: { state: State, score: Score, card: Card }) {
	if (card.enhancement !== 'stone') {
		score.chips += RANK_TO_CHIP_MAP[card.rank]
		log(score, '(+Chips from rank)')
	}

	scoreModifiers(score, MODIFIER_DEFAULTS.playedEnhancement[card.enhancement])
	scoreModifiers(score, MODIFIER_DEFAULTS.edition[card.edition])

	for (const joker of state.jokers) {
		joker.playedCardEffect({ state, score, card })
	}
}

function scoreHeldCard ({ state, score, card }: { state: State, score: Score, card: Card }) {
	scoreModifiers(score, MODIFIER_DEFAULTS.heldEnhancement[card.enhancement])

	for (const joker of state.jokers) {
		joker.heldCardEffect({ state, score, card })
		log(score, `(${joker})`)
	}
}

function scoreJoker ({ state, score, joker }: { state: State, score: Score, joker: Joker }) {
	joker.effect({ state, score })

	scoreModifiers(score, MODIFIER_DEFAULTS.edition[joker.edition])
}

function scoreModifiers (score: Score, modifier: Modifier) {
	const {
		plusChips,
		plusMultiplier,
		timesMultiplier,
	} = modifier

	// 1. +Chips
	if (plusChips !== undefined) {
		score.chips += plusChips
		log(score, '(+Chips from edition)')
	}

	// 2. +Mult
	if (plusMultiplier !== undefined) {
		score.multiplier += plusMultiplier
		log(score, '(+Mult from edition)')
	}

	// 3. xMult
	if (timesMultiplier !== undefined) {
		score.multiplier *= timesMultiplier
		log(score, '(xMult from edition)')
	}
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

		const effect = createJokerEffect(definition.effect)
		const indirectEffect = definition.indirectEffect
		const playedCardEffect = createPlayedCardEffect(definition.playedCardEffect)
		const heldCardEffect = createPlayedCardEffect(definition.heldCardEffect)

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
			playedCardEffect,
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

function createJokerEffect (effect?: JokerEffect): JokerEffect {
	return function (options) {
		const triggers = ['Regular']

		// Increase triggers from Blueprint/Brainstorm
		const targets = options.state.jokers
			.filter(({ name }) => ['Blueprint', 'Brainstorm'].includes(name))
			.map((joker) => resolveJoker(options.state, joker))
			.filter(notNullish)

		for (const { name } of targets) {
			if (name === this.name) triggers.push(name)
		}

		const jokersWithIndirectEffects = options.state.jokers.filter((joker) => joker.indirectEffect)

		for (const [index, trigger] of triggers.entries()) {
			log(`Trigger: ${index + 1} (${trigger})`)
			if (effect) {
				effect.call(this, options)
				log(options.score, `(${this.name})`)
			}

			for (const target of targets) {
				if (target.indirectEffect) {
					target.indirectEffect({ ...options, joker: this })
					log(options.score, trigger)
				}
			}

			for (const joker of jokersWithIndirectEffects) {
				if (joker.indirectEffect) {
					joker.indirectEffect({ ...options, joker: this })
					log(options.score, `(${joker.name})`)
				}
			}
		}
	}
}

function createPlayedCardEffect (effect?: JokerCardEffect): JokerCardEffect {
	return function (options) {
		if (!effect) {
			return
		}

		logGroup(`→ ${this}`)
		const triggers = ['Regular']

		// Increase triggers from Blueprint
		const blueprintTargets = options.state.jokers
			.filter(({ name }) => name === 'Blueprint')
			.map(({ index }) => options.state.jokers[index + 1])
			.filter(notNullish)

		for (const { name } of blueprintTargets) {
			if (name === this.name) triggers.push(`Blueprint copying ${this.name}`)
		}

		// Increase triggers from Brainstorm
		const brainstormTargets = options.state.jokers
			.filter(({ name }) => name === 'Brainstorm')
			.map(() => options.state.jokers[0])
			.filter(notNullish)

		for (const { name } of brainstormTargets) {
			if (name === this.name) triggers.push(`Brainstorm copying ${this.name}`)
		}

		for (let trigger = 0; trigger < triggers.length; trigger++) {
			log(`Trigger: ${trigger + 1} (${triggers[trigger]})`)
			effect.call(this, options)
			log(options.score, `(${this.name})`)
		}
		logGroupEnd('←', options.score)
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
