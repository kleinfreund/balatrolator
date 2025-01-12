import { BLINDS, DECKS, EDITIONS, ENHANCEMENTS, HANDS, JOKER_DEFINITIONS, JOKER_EDITIONS, JOKER_NAMES, RANKS, SEALS, SUITS } from '#lib/data.js'
import { getState } from '#utilities/getState.js'
import type { Card, Edition, Enhancement, HandLevel, HandName, InitialCard, InitialJoker, Joker, JokerName, Rank, Seal, State, Suit } from '#lib/types.js'

/*
I'm sorry for the code in this file; it's an abomination. Its job is compressing a `State` object into a minimal (as in size) string for the use of persisting it in the browser's URL or client-side storage (e.g. local storage). This is not context-unaware plain text compression as provided by libraries like lz-string but context-aware data compression “hand-crafted” for this application.
*/

/**
 * Used in place of a default value in the minified output to save on overall string length (e.g. instead of storing “0”, we store the empty string).
 */
const MINIFIED_DEFAULT_VALUE = ''

const BLIND_INDEXES = invertMap(BLINDS)
const DECK_INDEXES = invertMap(DECKS)
const HAND_INDEXES = invertMap(HANDS)
const EDITION_INDEXES = invertMap(EDITIONS)
const ENHANCEMENT_INDEXES = invertMap(ENHANCEMENTS)
const JOKER_EDITION_INDEXES = invertMap(JOKER_EDITIONS)
const JOKER_INDEXES = invertMap(Object.keys(JOKER_DEFINITIONS))
const RANK_INDEXES = invertMap(RANKS)
const SEAL_INDEXES = invertMap(SEALS)
const SUIT_INDEXES = invertMap(SUITS)

function invertMap<T extends string> (array: T[]): Record<T, number> {
	return Object.fromEntries(array.map((value, index) => [value, index])) as Record<T, number>
}

/**
 * Takes a `State` object and minifies it into a string of (relatively) minimal size for the purpose of storing in the client's browser (in the URL and/or local storage).
 */
export function minify (state: State): string {
	const {
		hands,
		discards,
		money,
		blind,
		deck,
		observatoryHands,
		jokerSlots,
		handLevels,
		jokers,
		cards,
	} = state

	const observatoryHandCodes = observatoryHands.map((hand) => toObservatoryHandCode(hand))
	const handLevelCodes = Object.values(handLevels).map((handLevel) => toHandLevelCode(handLevel))
	const jokerCodes = jokers.map((joker) => toJokerCode(joker))
	const cardCodes = cards.map((card) => toCardCode(card))

	return [
		hands !== 0 ? hands : MINIFIED_DEFAULT_VALUE,
		discards !== 0 ? discards : MINIFIED_DEFAULT_VALUE,
		money !== 0 ? money : MINIFIED_DEFAULT_VALUE,
		blind.name !== 'Small Blind' ? BLIND_INDEXES[blind.name] : MINIFIED_DEFAULT_VALUE,
		blind.active ? '1' : MINIFIED_DEFAULT_VALUE,
		deck !== 'Red Deck' ? DECK_INDEXES[deck] : MINIFIED_DEFAULT_VALUE,
		jokerSlots !== 0 ? jokerSlots : MINIFIED_DEFAULT_VALUE,
		observatoryHandCodes.join(';'),
		handLevelCodes.join(';'),
		jokerCodes.join(';'),
		cardCodes.join(';'),
	].join('|')
}

/**
 * Inverse of `minify`.
 */
export function deminify (str: string): State {
	const [
		hands,
		discards,
		money,
		blindNameIndex,
		blindIsActive,
		deckIndex,
		jokerSlots,
		observatoryHandCodes,
		handLevelCodes,
		jokerCodes,
		cardCodes,
	] = str.split('|')

	const observatoryHands = !observatoryHandCodes ? [] : observatoryHandCodes.split(';')
		.map((code) => fromObservatoryHandCode(code))
	const handLevels = Object.fromEntries(!handLevelCodes ? [] : handLevelCodes.split(';')
		.map((code) => fromHandLevelCode(code))
		.map((handLevel, index) => [HANDS[index], handLevel]))
	const jokers = !jokerCodes ? [] : jokerCodes.split(';')
		.map((code) => fromJokerCode(code))
	const cards = !cardCodes ? [] : cardCodes.split(';')
		.map((code) => fromCardCode(code))

	return getState({
		hands: hands !== MINIFIED_DEFAULT_VALUE ? Number(hands) : 0,
		discards: discards !== MINIFIED_DEFAULT_VALUE ? Number(discards) : 0,
		money: money !== MINIFIED_DEFAULT_VALUE ? Number(money) : 0,
		blind: {
			name: BLINDS[Number(blindNameIndex || '0')],
			active: blindIsActive === '1',
		},
		deck: DECKS[Number(deckIndex || '0')],
		observatoryHands,
		jokerSlots: jokerSlots !== MINIFIED_DEFAULT_VALUE ? Number(jokerSlots) : 0,
		handLevels,
		jokers,
		cards,
	})
}

function toObservatoryHandCode (hand: HandName): string {
	return String(HAND_INDEXES[hand])
}

function fromObservatoryHandCode (code: string): HandName {
	return HANDS[Number(code || '0')] as HandName
}

function toHandLevelCode ({ level, plays }: HandLevel): string {
	return [
		level !== 1 ? level : MINIFIED_DEFAULT_VALUE,
		plays !== 0 ? plays : MINIFIED_DEFAULT_VALUE,
	].join(',')
}

function fromHandLevelCode (code: string): HandLevel {
	const [
		level,
		plays,
	] = code.split(',')

	return {
		level: level !== MINIFIED_DEFAULT_VALUE ? Number(level) : 1,
		plays: plays !== MINIFIED_DEFAULT_VALUE ? Number(plays) : 0,
	}
}

function toJokerCode (joker: Joker): string {
	const {
		name,
		edition,
		plusChips,
		plusMultiplier,
		timesMultiplier,
		rank,
		suit,
		active,
	} = joker

	return [
		JOKER_INDEXES[name],
		edition !== 'base' ? JOKER_EDITION_INDEXES[edition] : MINIFIED_DEFAULT_VALUE,
		plusChips !== 0 ? plusChips : MINIFIED_DEFAULT_VALUE,
		plusMultiplier !== 0 ? plusMultiplier : MINIFIED_DEFAULT_VALUE,
		timesMultiplier !== 1 ? timesMultiplier : MINIFIED_DEFAULT_VALUE,
		rank ? RANK_INDEXES[rank] : MINIFIED_DEFAULT_VALUE,
		suit ? SUIT_INDEXES[suit] : MINIFIED_DEFAULT_VALUE,
		active ? 1 : MINIFIED_DEFAULT_VALUE,
	].join(',')
}

function fromJokerCode (code: string): InitialJoker {
	const [
		nameIndex,
		editionIndex,
		plusChips,
		plusMultiplier,
		timesMultiplier,
		rankIndex,
		suitIndex,
		active,
	] = code.split(',')

	return {
		name: JOKER_NAMES[Number(nameIndex || '0')] as JokerName,
		edition: JOKER_EDITIONS[Number(editionIndex || '0')] as Edition,
		plusChips: Number(plusChips || '0'),
		plusMultiplier: Number(plusMultiplier || '0'),
		timesMultiplier: Number(timesMultiplier || '1'),
		rank: rankIndex !== '' ? RANKS[Number(rankIndex)] as Rank : undefined,
		suit: suitIndex !== '' ? SUITS[Number(suitIndex)] as Suit : undefined,
		active: active === '1',
	}
}

function toCardCode (card: Card): string {
	const {
		rank,
		suit,
		edition,
		enhancement,
		seal,
		debuffed,
		played,
	} = card

	return [
		RANK_INDEXES[rank],
		SUIT_INDEXES[suit],
		edition !== 'base' ? EDITION_INDEXES[edition] : MINIFIED_DEFAULT_VALUE,
		enhancement !== 'none' ? ENHANCEMENT_INDEXES[enhancement] : MINIFIED_DEFAULT_VALUE,
		seal !== 'none' ? SEAL_INDEXES[seal] : MINIFIED_DEFAULT_VALUE,
		debuffed ? 1 : MINIFIED_DEFAULT_VALUE,
		played ? 1 : MINIFIED_DEFAULT_VALUE,
	].join(',')
}

function fromCardCode (code: string): InitialCard {
	const [
		rankIndex,
		suitIndex,
		editionIndex,
		enhancementIndex,
		sealIndex,
		debuffed,
		played,
	] = code.split(',')

	return {
		rank: RANKS[Number(rankIndex || '0')] as Rank,
		suit: SUITS[Number(suitIndex || '0')] as Suit,
		edition: EDITIONS[Number(editionIndex || '0')] as Edition,
		enhancement: ENHANCEMENTS[Number(enhancementIndex || '0')] as Enhancement,
		seal: SEALS[Number(sealIndex || '0')] as Seal,
		debuffed: debuffed === '1',
		played: played === '1',
	}
}
