import { log } from '#utilities/log.js'
import { notNullish } from '#utilities/notNullish.js'
import { RANK_TO_CHIP_MAP, PLAYED_CARD_RETRIGGER_JOKER_NAMES, HELD_CARD_RETRIGGER_JOKER_NAMES, LUCKS } from './data.js'
import { balanceMultWithLuck } from './balanceMultWithLuck.js'
import { formatScore } from './formatScore.js'
import { isFaceCard, isRank } from './cards.js'
import { resolveJoker } from './resolveJokers.js'
import { doBigMath } from './doBigMath.js'
import type { Card, Joker, JokerCardEffect, JokerEffect, Luck, Result, ResultScore, ScoreValue, State } from './types.js'

export function calculateScore (state: State): Result {
	const scores = LUCKS.map<ResultScore>((luck) => {
		const initialScore = getScore(state, luck)
		const score = doBigMath(initialScore, state.deck)

		return {
			score,
			formattedScore: formatScore(score),
			luck,
		}
	})

	return {
		hand: state.playedHand,
		scoringCards: state.scoringCards,
		scores,
	}
}

function getScore (state: State, luck: Luck): ScoreValue[] {
	const baseScore = state.handBaseScores[state.playedHand]

	// Determine base chips and multiplier.
	// The Flint halves the base chips and multiplier.
	const baseFactor = (state.blind.name === 'The Flint' && state.blind.active ? 0.5 : 1)
	// The base score seems to be rounded here.
	const score = createScoreProxy<ScoreValue[]>([])
	score.push({
		chips: ['+', Math.round(baseScore.chips * baseFactor)],
		phase: 'base',
	})
	score.push({
		multiplier: ['+', Math.round(baseScore.multiplier * baseFactor)],
		phase: 'base',
	})

	for (const [index, card] of state.scoringCards.entries()) {

		// Debuffed cards don't participate in scoring at all.
		if (card.debuffed) {
			continue
		}

		for (const trigger of getPlayedCardTriggers({ state, card, index })) {
			// 1. Rank
			if (card.enhancement !== 'stone') {
				score.push({
					chips: ['+', RANK_TO_CHIP_MAP[card.rank]],
					phase: 'played-cards',
					card,
					type: 'rank',
					trigger,
				})
			}

			// 2. Enhancement
			switch (card.enhancement) {
				case 'stone': {
					score.push({
						chips: ['+', 50],
						phase: 'played-cards',
						card,
						type: 'enhancement',
						trigger,
					})
					break
				}
				case 'bonus': {
					score.push({
						chips: ['+', 30],
						phase: 'played-cards',
						card,
						type: 'enhancement',
						trigger,
					})
					break
				}
				case 'mult': {
					score.push({
						multiplier: ['+', 4],
						phase: 'played-cards',
						card,
						type: 'enhancement',
						trigger,
					})
					break
				}
				case 'lucky': {
					const denominator = 5
					const plusMult = 20
					const oopses = state.jokers.filter(({ name }) => name === 'Oops! All 6s')
					const mult = balanceMultWithLuck(plusMult, oopses.length, denominator, luck, 'plus')

					score.push({
						multiplier: ['+', mult],
						phase: 'played-cards',
						card,
						type: 'enhancement',
						trigger,
					})
					break
				}
				case 'glass': {
					score.push({
						multiplier: ['*', 2],
						phase: 'played-cards',
						card,
						type: 'enhancement',
						trigger,
					})
					break
				}
			}

			// 3. Edition
			switch (card.edition) {
				case 'foil': {
					score.push({
						chips: ['+', 50],
						phase: 'played-cards',
						card,
						type: 'edition',
						trigger,
					})
					break
				}
				case 'holographic': {
					score.push({
						multiplier: ['+', 10],
						phase: 'played-cards',
						card,
						type: 'edition',
						trigger,
					})
					break
				}
				case 'polychrome': {
					score.push({
						multiplier: ['*', 1.5],
						phase: 'played-cards',
						card,
						type: 'edition',
						trigger,
					})
					break
				}
			}

			// 4. Joker effects for played cards
			for (const joker of state.jokers) {
				scoreJokerCardEffect(joker.playedCardEffect, { state, score, joker, card, luck })
			}
		}

	}

	for (const card of state.cards.filter(({ played }) => !played)) {

		// Debuffed cards don't participate in scoring at all.
		if (card.debuffed) {
			continue
		}

		for (const trigger of getHeldCardTriggers({ state, card })) {
			// 1. Enhancement
			switch (card.enhancement) {
				case 'steel': {
					score.push({
						multiplier: ['*', 1.5],
						phase: 'held-cards', card,
						type: 'enhancement',
						trigger,
					})
					break
				}
			}

			// 2. Joker effects for held cards
			for (const joker of state.jokers) {
				scoreJokerCardEffect(joker.heldCardEffect, { state, score, joker, card, luck })
			}
		}

	}

	for (const joker of state.jokers) {

		// 1. EDITION
		switch (joker.edition) {
			case 'foil': {
				score.push({
					chips: ['+', 50],
					phase: 'jokers',
					joker,
					type: 'edition',
				})
				break
			}
			case 'holographic': {
				score.push({
					multiplier: ['+', 10],
					phase: 'jokers', joker,
					type: 'edition',
				})
				break
			}
			case 'polychrome': {
				score.push({
					multiplier: ['*', 1.5],
					phase: 'jokers', joker,
					type: 'edition',
				})
				break
			}
		}

		// 2. JOKER EFFECTS
		scoreJokerEffect(joker.effect, { state, score, joker, luck })

	}

	const planetCount = state.observatory[state.playedHand] ?? 0
	if (planetCount > 0) {
		score.push({
			multiplier: ['*', planetCount * 1.5],
			phase: 'consumables',
		})
	}

	return score
}

/**
 * Create a proxy for the array holding the individual score values that also prints logs for each score-affecting change.
 */
function createScoreProxy<T extends ScoreValue[]> (value: T) {
	return new Proxy<T>(value, {
		get (target, prop) {
			if (prop === 'push') {
				return (...scoreValues: Parameters<typeof target.push>) => {
					for (const scoreValue of scoreValues) {
						log(scoreValue)
					}
					return target.push(...scoreValues)
				}
			}
			return Reflect.get(target, prop)
		},
	})
}

function getPlayedCardTriggers ({ state, card, index }: { state: State, card: Card, index: number }): string[] {
	const triggers = ['Regular']

	if (card.seal === 'red') {
		triggers.push('Red Seal')
	}

	const retriggerJokerNames = state.jokers
		.map((joker) => resolveJoker(state.jokers, joker))
		.filter(notNullish)
		.filter(({ name }) => PLAYED_CARD_RETRIGGER_JOKER_NAMES.includes(name))
		.map(({ name }) => name)

	for (const name of retriggerJokerNames) {
		switch (name) {
			case 'Dusk': {
				if (state.hands === 1) triggers.push(name)
				break
			}
			case 'Hack': {
				if (isRank(card, ['2', '3', '4', '5'])) triggers.push(name)
				break
			}
			case 'Hanging Chad': {
				if (index === 0) {
					triggers.push(name, name)
				}
				break
			}
			case 'Seltzer': {
				triggers.push(name)
				break
			}
			case 'Sock and Buskin': {
				if (isFaceCard(card, state.jokerSet.has('Pareidolia'))) triggers.push(name)
				break
			}
		}
	}

	return triggers
}

function getHeldCardTriggers ({ state, card }: { state: State, card: Card }): string[] {
	const triggers = ['Regular']

	if (card.seal === 'red') {
		triggers.push('Red Seal')
	}

	const retriggerJokerNames = state.jokers
		.map((joker) => resolveJoker(state.jokers, joker))
		.filter(notNullish)
		.filter(({ name }) => HELD_CARD_RETRIGGER_JOKER_NAMES.includes(name))
		.map(({ name }) => name)

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
				if (isFaceCard(card, state.jokerSet.has('Pareidolia'))) triggers.push(name)
				break
			}
		}
	}

	return triggers
}

function scoreJokerEffect (effect: JokerEffect | undefined, { state, score, joker, luck }: { state: State, score: ScoreValue[], joker: Joker, luck: Luck }) {
	const triggers = ['Regular']

	// Increase triggers from Blueprint/Brainstorm
	const targets = state.jokers
		.filter(({ name }) => ['Blueprint', 'Brainstorm'].includes(name))
		.map((joker) => resolveJoker(state.jokers, joker))
		.filter(notNullish)

	for (const { index, name } of targets) {
		if (index === joker.index) triggers.push(`copied ${name}`)
	}

	const jokersWithIndirectEffects = state.jokers.filter((joker) => joker.indirectEffect)

	for (const trigger of triggers) {
		if (effect) {
			effect.call(joker, { state, score, luck, trigger })
		}

		for (const target of targets) {
			if (target.indirectEffect) {
				target.indirectEffect({ state, score, joker, luck, trigger })
			}
		}

		for (const jokersWithIndirectEffect of jokersWithIndirectEffects) {
			if (jokersWithIndirectEffect.indirectEffect) {
				jokersWithIndirectEffect.indirectEffect({ state, score, joker, luck, trigger })
			}
		}
	}
}

function scoreJokerCardEffect (effect: JokerCardEffect | undefined, { state, score, joker, card, luck }: { state: State, score: ScoreValue[], joker: Joker, card: Card, luck: Luck }) {
	if (!effect) {
		return
	}

	const triggers = ['Regular']

	// Increase triggers from Blueprint/Brainstorm
	const targets = state.jokers
		.filter(({ name }) => ['Blueprint', 'Brainstorm'].includes(name))
		.map((joker) => resolveJoker(state.jokers, joker))
		.filter(notNullish)

	for (const { index, name } of targets) {
		if (index === joker.index) triggers.push(`copied ${name}`)
	}

	for (const trigger of triggers) {
		effect.call(joker, { state, score, joker, card, luck, trigger })
	}
}
