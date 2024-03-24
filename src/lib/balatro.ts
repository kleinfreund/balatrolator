import { RANK_TO_CHIP_MAP, PLAYED_CARD_RETRIGGER_JOKER_NAMES, HELD_CARD_RETRIGGER_JOKER_NAMES } from '#lib/data.js'
import type { Card, Joker, JokerCardEffect, JokerEffect, Result, Score, State } from '#lib/types.js'
import { formatScore } from '#utilities/formatScore.js'
import { log, logGroup, logGroupEnd } from '#utilities/log.js'
import { isFaceCard } from '#utilities/isFaceCard.js'
import { isRank } from '#utilities/isRank.js'
import { notNullish } from '#utilities/notNullish.js'
import { resolveJoker } from '#utilities/resolveJokers.js'

export function calculateScore (state: State): Result {
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
	const baseFactor = (state.blind.name === 'The Flint' && state.blind.isActive ? 0.5 : 1)
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

			// 1. Rank
			if (card.enhancement !== 'stone') {
				score.chips += RANK_TO_CHIP_MAP[card.rank]
				log(score, '(+Chips from rank)')
			}

			// 2. Enhancement
			switch (card.enhancement) {
				case 'stone': {
					score.chips += 50
					log(score, '(+Chips from stone enhancement)')
					break
				}
				case 'bonus': {
					score.chips += 30
					log(score, '(+Chips from bonus enhancement)')
					break
				}
				case 'mult': {
					score.multiplier += 4
					log(score, '(+Mult from mult enhancement)')
					break
				}
				case 'glass': {
					score.multiplier *= 2
					log(score, '(xMult from glass enhancement)')
					break
				}
			}

			// 3. Edition
			switch (card.edition) {
				case 'foil': {
					score.chips += 50
					log(score, '(+Chips from foil edition)')
					break
				}
				case 'holographic': {
					score.multiplier += 10
					log(score, '(+Mult from holographic edition)')
					break
				}
				case 'polychrome': {
					score.multiplier *= 1.5
					log(score, '(xMult from polychrome edition)')
					break
				}
			}

			// 4. Joker effects for played cards
			for (const joker of state.jokers) {
				scoreJokerCardEffect(joker.playedCardEffect, { state, score, joker, card })
			}
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

			// 1. Enhancement
			switch (card.enhancement) {
				case 'steel': {
					score.multiplier *= 1.5
					log(score, '(xMult from steel enhancement)')
					break
				}
			}

			// 2. Joker effects for held cards
			for (const joker of state.jokers) {
				scoreJokerCardEffect(joker.heldCardEffect, { state, score, joker, card })
				log(score, `(${joker})`)
			}
		}

		logGroupEnd(`← ${card}`, score)
	}
	log('\n2. HELD CARD SCORE =>', score)

	log('\n3. Scoring jokers …')
	for (const joker of state.jokers) {
		logGroup(`\n→ ${joker}`, score)

		// 1. EDITION
		switch (joker.edition) {
			case 'foil': {
				score.chips += 50
				log(score, '(+Chips from foil edition)')
				break
			}
			case 'holographic': {
				score.multiplier += 10
				log(score, '(+Mult from holographic edition)')
				break
			}
			case 'polychrome': {
				score.multiplier *= 1.5
				log(score, '(xMult from polychrome edition)')
				break
			}
		}

		// 2. JOKER EFFECTS
		scoreJokerEffect(joker.effect, { state, score, joker })

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
				if (isRank(card, ['2', '3', '4', '5'])) triggers.push(name)
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
				if (isFaceCard(card, state.jokerSet.has('Pareidolia'))) triggers.push(name)
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
				if (isFaceCard(card, state.jokerSet.has('Pareidolia'))) triggers.push(name)
				break
			}
		}
	}

	if (card.seal === 'red') {
		triggers.push('Red Seal')
	}

	return triggers
}

function scoreJokerEffect (effect: JokerEffect | undefined, { state, score, joker }: { state: State, score: Score, joker: Joker }) {
	const triggers = ['Regular']

	// Increase triggers from Blueprint/Brainstorm
	const targets = state.jokers
		.filter(({ name }) => ['Blueprint', 'Brainstorm'].includes(name))
		.map((joker) => resolveJoker(state, joker))
		.filter(notNullish)

	for (const { name } of targets) {
		if (name === joker.name) triggers.push(name)
	}

	const jokersWithIndirectEffects = state.jokers.filter((joker) => joker.indirectEffect)

	for (const [index, trigger] of triggers.entries()) {
		log(`Trigger: ${index + 1} (${trigger})`)
		if (effect) {
			effect.call(joker, { state, score })
			log(score, `(${joker.name})`)
		}

		for (const target of targets) {
			if (target.indirectEffect) {
				target.indirectEffect({ state, score, joker })
				log(score, trigger)
			}
		}

		for (const jokersWithIndirectEffect of jokersWithIndirectEffects) {
			if (jokersWithIndirectEffect.indirectEffect) {
				jokersWithIndirectEffect.indirectEffect({ state, score, joker })
				log(score, `(${jokersWithIndirectEffect.name})`)
			}
		}
	}
}

function scoreJokerCardEffect (effect: JokerCardEffect | undefined, { state, score, joker, card }: { state: State, score: Score, joker: Joker, card: Card }) {
	if (!effect) {
		return
	}

	logGroup(`→ ${joker}`)
	const triggers = ['Regular']

	// Increase triggers from Blueprint
	const blueprintTargets = state.jokers
		.filter(({ name }) => name === 'Blueprint')
		.map(({ index }) => state.jokers[index + 1])
		.filter(notNullish)

	for (const { name } of blueprintTargets) {
		if (name === joker.name) triggers.push(`Blueprint copying ${joker.name}`)
	}

	// Increase triggers from Brainstorm
	const brainstormTargets = state.jokers
		.filter(({ name }) => name === 'Brainstorm')
		.map(() => state.jokers[0])
		.filter(notNullish)

	for (const { name } of brainstormTargets) {
		if (name === joker.name) triggers.push(`Brainstorm copying ${joker.name}`)
	}

	for (let trigger = 0; trigger < triggers.length; trigger++) {
		log(`Trigger: ${trigger + 1} (${triggers[trigger]})`)
		effect.call(joker, { state, score, joker, card })
		log(score, `(${joker.name})`)
	}
	logGroupEnd('←', score)
}
