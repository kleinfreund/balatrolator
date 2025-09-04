import { notNullish } from '#utilities/notNullish.ts'
import { RANK_TO_CHIP_MAP, PLAYED_CARD_RETRIGGER_JOKER_NAMES, HELD_CARD_RETRIGGER_JOKER_NAMES, LUCKS } from './data.ts'
import { balanceMultWithLuck } from './balanceMultWithLuck.ts'
import { formatScore } from './formatScore.ts'
import { isFaceCard, isRank } from './cards.ts'
import { resolveJoker } from './resolveJokers.ts'
import { doBigMath } from './doBigMath.ts'
import { getHand } from './getHand.ts'
import type { Card, HandName, Joker, JokerCardEffect, JokerEffect, Luck, Result, ResultScore, ScoreValue, State } from './types.ts'

export function calculateScore (unresolvedState: State): Result {
	const state = resolveState(unresolvedState)

	const playedCards = state.cards.filter((card) => card.played)
	const { playedHand, scoringCards: preliminaryScoringCards } = getHand(playedCards, state.jokerSet)
	const scoringCards = state.jokerSet.has('Splash') ? playedCards : preliminaryScoringCards

	const scores = LUCKS.map<ResultScore>((luck) => {
		const initialScore = getScore(state, playedHand, scoringCards, luck)
		const score = doBigMath(initialScore, state.deck)

		return {
			score,
			formattedScore: formatScore(score),
			luck,
		}
	})

	return {
		hand: playedHand,
		scoringCards,
		scores,
	}
}

function resolveState (state: State): State {
	return {
		...state,
		// Create copies of cokers based on their count.
		jokers: state.jokers
			.map((joker) => {
				return Array.from({ length: joker.count ?? 1 })
					.map(() => joker)
			})
			.flat(),
		// Create copies of cards based on their count.
		cards: state.cards
			.map((card) => {
				return Array.from({ length: card.count ?? 1 })
					.map(() => card)
			})
			.flat(),
	}
}

function getScore (state: State, playedHand: HandName, scoringCards: Card[], luck: Luck): ScoreValue[] {
	const baseScore = state.handBaseScores[playedHand]

	// Determine base chips and multiplier.
	// The Flint halves the base chips and multiplier.
	const baseFactor = (state.blind.name === 'The Flint' && state.blind.active ? 0.5 : 1)
	// The base score seems to be rounded here.
	const score: ScoreValue[] = []
	score.push({
		chips: ['+', Math.round(baseScore.chips * baseFactor)],
		phase: 'base',
	})
	score.push({
		multiplier: ['+', Math.round(baseScore.multiplier * baseFactor)],
		phase: 'base',
	})

	for (const [index, card] of scoringCards.entries()) {
		for (const trigger of getPlayedCardTriggers({ state, card, index })) {
			// Debuffed cards don't participate in scoring for played cards except that they still apply stone enhancement.
			if (card.debuffed) {
				if (card.enhancement === 'stone') {
					score.push({
						chips: ['+', 50],
						phase: 'played-cards',
						card,
						type: 'enhancement',
						trigger,
					})
				}
				continue
			}

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
				scoreJokerCardEffect(joker.playedCardEffect, { state, playedHand, scoringCards, score, joker, card, luck })
			}
		}
	}

	for (const card of state.cards.filter(({ played }) => !played)) {
		for (const trigger of getHeldCardTriggers({ state, card })) {
			// Debuffed cards don't participate in scoring for held cards at all.
			if (card.debuffed) {
				continue
			}

			// 1. Enhancement
			switch (card.enhancement) {
				case 'steel': {
					score.push({
						multiplier: ['*', 1.5],
						phase: 'held-cards',
						card,
						type: 'enhancement',
						trigger,
					})
					break
				}
			}
		}

		// TODO: Yeah, so this looks wrong. The separate for loop for held card effects ensures that cards are scored in order of the cards first. So a steel card with Mime is counted twice before a next card with Raised Fist is counted. Without doing this, the second steel scoring happens hafter the next card. Concerningly, the same logic applied to played card effects breaks a couple of tests I'm confident are correct.
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		for (const _trigger of getHeldCardTriggers({ state, card })) {
			// Debuffed cards don't participate in scoring for held cards at all.
			if (card.debuffed) {
				continue
			}

			// 2. Joker effects for held cards
			for (const joker of state.jokers) {
				scoreJokerCardEffect(joker.heldCardEffect, { state, playedHand, scoringCards, score, joker, card, luck })
			}
		}
	}

	for (const joker of state.jokers) {
		// 1. Edition
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

		// 2. Joker effects
		scoreJokerEffect(joker.effect, { state, playedHand, scoringCards, score, joker, luck })
	}

	const planetCount = state.observatory[playedHand] ?? 0
	if (planetCount > 0) {
		score.push({
			multiplier: ['*', Math.pow(1.5, planetCount)],
			phase: 'consumables',
		})
	}

	return score
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
				if (isFaceCard(card, state.jokerSet)) triggers.push(name)
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
		}
	}

	return triggers
}

function scoreJokerEffect (effect: JokerEffect | undefined, options: { state: State, playedHand: HandName, scoringCards: Card[], score: ScoreValue[], joker: Joker, luck: Luck }) {
	const triggers = ['Regular']

	// Increase triggers from Blueprint/Brainstorm
	const targets = options.state.jokers
		.filter(({ name }) => ['Blueprint', 'Brainstorm'].includes(name))
		.map((joker) => resolveJoker(options.state.jokers, joker))
		.filter(notNullish)

	for (const { index, name } of targets) {
		if (index === options.joker.index) triggers.push(`copied ${name}`)
	}

	for (const trigger of triggers) {
		if (effect) {
			effect.call(options.joker, { ...options, trigger })
		}

		for (const target of targets) {
			if (target.indirectEffect) {
				target.indirectEffect({ ...options, trigger })
			}
		}
	}

	for (const joker of options.state.jokers) {
		if (joker.indirectEffect) {
			joker.indirectEffect({ ...options, trigger: `indirect for ${options.joker.name}` })
		}
	}
}

function scoreJokerCardEffect (effect: JokerCardEffect | undefined, options: { state: State, playedHand: HandName, scoringCards: Card[], score: ScoreValue[], joker: Joker, card: Card, luck: Luck }) {
	if (!effect) {
		return
	}

	const triggers = ['Regular']

	// Increase triggers from Blueprint/Brainstorm
	const targets = options.state.jokers
		.filter(({ name }) => ['Blueprint', 'Brainstorm'].includes(name))
		.map((joker) => resolveJoker(options.state.jokers, joker))
		.filter(notNullish)

	for (const { index, name } of targets) {
		if (index === options.joker.index) triggers.push(`copied ${name}`)
	}

	for (const trigger of triggers) {
		effect.call(options.joker, { ...options, trigger })
	}
}
