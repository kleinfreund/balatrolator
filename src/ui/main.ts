import { calculateScore } from '#lib/balatro.js'
import { JOKER_DEFINITIONS, JOKER_NAMES, RANKS, SUITS } from '#lib/data.js'
import type { BlindName, DeckName, Edition, Enhancement, HandName, InitialCard, InitialJoker, InitialState, JokerDefinition, JokerEdition, JokerName, Rank, Seal, Suit } from '#lib/types.js'
import { getRandomInt } from '#utilities/getRandomInt.js'
import { log } from '#utilities/log.js'
import { notNullish } from '#utilities/notNullish.js'
import { fetchState, saveState } from '#utilities/Storage.js'

const form = document.querySelector('[data-form]') as HTMLFormElement

const handsEl = form.querySelector('[data-r-hands]') as HTMLInputElement
const discardsEl = form.querySelector('[data-r-discards]') as HTMLInputElement
const moneyEl = form.querySelector('[data-r-money]') as HTMLInputElement
const blindEl = form.querySelector('[data-r-blind]') as HTMLInputElement
const deckEl = form.querySelector('[data-r-deck]') as HTMLInputElement
const jokerSlotsEl = form.querySelector('[data-r-joker-slots]') as HTMLInputElement

const handsContainer = form.querySelector('[data-h-container]') as HTMLElement

const jokerContainer = form.querySelector('[data-j-container]') as HTMLElement
const addJokerButton = document.querySelector('[data-j-add-button]') as HTMLButtonElement
const jokerTemplate = document.querySelector('template#joker') as HTMLTemplateElement

const cardContainer = form.querySelector('[data-c-container]') as HTMLElement
const addCardButton = document.querySelector('[data-c-add-button]') as HTMLButtonElement
const cardTemplate = document.querySelector('template#card') as HTMLTemplateElement

form.addEventListener('submit', handleSubmit)
addJokerButton.addEventListener('click', () => addJoker())
addCardButton.addEventListener('click', () => addCard())

start()

function start () {
	if (import.meta.env.VITE_DEBUG === 'true') {
		let numberOfJokers = 3
		while (numberOfJokers--) addRandomJoker()

		let numberOfCards = 5
		while (numberOfCards--) addRandomCard()
	} else {
		const initialState = fetchState('initialState')
		if (initialState) {
			// setInitialState(JSON.parse(initialState))
			// For testing
			setInitialState({
				blind: 'Big Blind',
				playedCards: [
					{ rank: 'Ace', suit: 'Diamonds', seal: 'red' },
					{ rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
					{ rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
					{ rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
					{ rank: 'Ace', suit: 'Diamonds', enhancement: 'glass', seal: 'red' },
				],
				heldCards: [
					{ rank: 'Ace', suit: 'Diamonds', enhancement: 'mult' },
					{ rank: 'Ace', suit: 'Diamonds', enhancement: 'steel', seal: 'red' },
					{ rank: 'Ace', suit: 'Diamonds', enhancement: 'steel', seal: 'red' },
					{ rank: 'Ace', suit: 'Diamonds', seal: 'red' },
				],
				jokers: [
					{ name: 'DNA' },
					{ name: 'Blueprint' },
					{ name: 'The Idol', rank: 'Ace', suit: 'Diamonds' },
					{ name: 'Hologram', timesMultiplier: 12.25 },
					{ name: 'The Family' },
					{ name: 'Glass Joker', timesMultiplier: 5.5 },
				],
				handLevels: {
					'Flush Five': {
						level: 11,
						plays: 0,
					},
				},
			})
		}
	}
}

function addRandomJoker () {
	const name = JOKER_NAMES[getRandomInt(0, JOKER_NAMES.length - 1)]!

	addJoker({
		name,
	})
}

function addRandomCard () {
	const rank = RANKS[getRandomInt(0, RANKS.length - 1)]!
	const suit = SUITS[getRandomInt(0, SUITS.length - 1)]!
	const isPlayed = getRandomInt(0, 1) === 1

	addCard({
		rank,
		suit,
	}, isPlayed)
}

function addJoker (initialJoker?: InitialJoker) {
	const template = jokerTemplate.content.cloneNode(true) as HTMLElement
	const jokerEl = template.querySelector('[data-joker]') as HTMLElement
	const index = jokerContainer.children.length

	const nameInput = jokerEl.querySelector('.j-name-input') as HTMLInputElement
	const editionInput = jokerEl.querySelector('.j-edition-input') as HTMLSelectElement
	const plusChipsInput = jokerEl.querySelector('.j-plus-chips-input') as HTMLInputElement
	const plusMultiplierInput = jokerEl.querySelector('.j-plus-multiplier-input') as HTMLInputElement
	const timesMultiplierInput = jokerEl.querySelector('.j-times-multiplier-input') as HTMLInputElement
	const isActiveInput = jokerEl.querySelector('.j-is-active-input') as HTMLInputElement
	const rankInput = jokerEl.querySelector('.j-rank-input') as HTMLInputElement
	const suitInput = jokerEl.querySelector('.j-suit-input') as HTMLInputElement

	nameInput.name = `joker-name-${index}`
	editionInput.name = `joker-edition-${index}`
	plusChipsInput.name = `joker-plusChips-${index}`
	plusMultiplierInput.name = `joker-plusMultiplier-${index}`
	timesMultiplierInput.name = `joker-timesMultiplier-${index}`
	isActiveInput.name = `joker-isActive-${index}`
	rankInput.name = `joker-rank-${index}`
	suitInput.name = `joker-suit-${index}`

	jokerEl.addEventListener('click', handleJokerClick)
	nameInput.addEventListener('change', handleJokerNameChange)
	const removeButton = jokerEl.querySelector('[data-j-remove-button]') as HTMLButtonElement
	removeButton.addEventListener('click', handleRemoveJokerClick)

	if (initialJoker) {
		const {
			name,
			edition,
			plusChips,
			plusMultiplier,
			timesMultiplier,
			isActive,
			rank,
			suit,
		} = initialJoker
		const definition = JOKER_DEFINITIONS[name]

		nameInput.value = name
		editionInput.value = edition ?? 'base'
		if (definition.hasPlusChipsInput) plusChipsInput.value = String(plusChips)
		if (definition.hasPlusMultiplierInput) plusMultiplierInput.value = String(plusMultiplier)
		if (definition.hasTimesMultiplierInput) timesMultiplierInput.value = String(timesMultiplier)
		if (definition.hasIsActiveInput) isActiveInput.checked = Boolean(isActive)
		if (definition.hasRankInput) rankInput.value = String(rank)
		if (definition.hasSuitInput) suitInput.value = String(suit)
	}

	jokerContainer.appendChild(template)

	if (initialJoker) {
		const definition = JOKER_DEFINITIONS[initialJoker.name]
		applyJokerState(jokerEl, definition)
	}
}

function handleJokerClick () {}

function handleRemoveJokerClick (event: Event) {
	if (event.currentTarget instanceof HTMLElement) {
		event.currentTarget.closest('[data-joker]')!.remove()
	}
}

function handleJokerNameChange (event: Event) {
	const input = event.currentTarget as HTMLInputElement
	const jokerName = input.value as JokerName
	const definition = JOKER_DEFINITIONS[jokerName]
	const jokerEl = input.closest('.joker') as HTMLElement

	applyJokerState(jokerEl, definition)
}

function applyJokerState (jokerEl: HTMLElement, definition: JokerDefinition) {
	jokerEl.classList.remove(
		'--has-plus-chips',
		'--has-plus-multiplier',
		'--has-times-multiplier',
		'--has-is-active',
		'--has-rank',
		'--has-suit',
	)
	;[
		definition.hasPlusChipsInput ? '--has-plus-chips' : null,
		definition.hasPlusMultiplierInput ? '--has-plus-multiplier': null,
		definition.hasTimesMultiplierInput ? '--has-times-multiplier': null,
		definition.hasIsActiveInput ? '--has-is-active': null,
		definition.hasRankInput ? '--has-rank': null,
		definition.hasSuitInput ? '--has-suit': null,
	].filter(notNullish).forEach((className) => jokerEl.classList.add(className))
}

function addCard (initialCard?: InitialCard, isPlayed?: boolean) {
	const template = cardTemplate.content.cloneNode(true) as HTMLElement
	const cardEl = template.querySelector('[data-card]') as HTMLElement
	const index = cardContainer.children.length

	const isPlayedInput = cardEl.querySelector('.c-is-played-input') as HTMLInputElement
	const rankInput = cardEl.querySelector('.c-rank-input') as HTMLInputElement
	const suitInput = cardEl.querySelector('.c-suit-input') as HTMLInputElement
	const editionInput = cardEl.querySelector('.c-edition-input') as HTMLSelectElement
	const enhancementInput = cardEl.querySelector('.c-enhancement-input') as HTMLSelectElement
	const sealInput = cardEl.querySelector('.c-seal-input') as HTMLSelectElement

	isPlayedInput.name = `card-isPlayed-${index}`
	rankInput.name = `card-rank-${index}`
	suitInput.name = `card-suit-${index}`
	editionInput.name = `card-edition-${index}`
	enhancementInput.name = `card-enhancement-${index}`
	sealInput.name = `card-seal-${index}`

	const removeButton = cardEl.querySelector('[data-c-remove-button]') as HTMLButtonElement
	removeButton.addEventListener('click', handleRemoveCardClick)

	if (initialCard) {
		const {
			rank,
			suit,
			edition,
			enhancement,
			seal,
		} = initialCard

		isPlayedInput.checked = Boolean(isPlayed)
		rankInput.value = rank
		suitInput.value = suit
		editionInput.value = edition ?? 'base'
		enhancementInput.value = enhancement ?? 'none'
		sealInput.value = seal ?? 'none'
	}

	cardContainer.appendChild(template)
}

function handleRemoveCardClick (event: Event) {
	if (event.currentTarget instanceof HTMLElement) {
		event.currentTarget.closest('[data-card]')!.remove()
	}
}

function handleSubmit (event: SubmitEvent) {
	event.preventDefault()

	const initialState = getInitialState()
	saveState('initialState', initialState)

	const score = calculateScore(initialState)
	log(score)
	document.querySelector('textarea')!.textContent = JSON.stringify(score, null, 2)
}

function getInitialState (): InitialState {
	const hands = Number(handsEl.value)
	const discards = Number(discardsEl.value)
	const money = Number(moneyEl.value)
	const blind = blindEl.value as BlindName
	const deck = deckEl.value as DeckName
	const jokerSlots = Number(jokerSlotsEl.value)

	const initialState: Required<InitialState> = {
		hands,
		discards,
		money,
		blind,
		deck,
		handLevels: {},
		jokers: [],
		jokerSlots,
		playedCards: [],
		heldCards: [],
	}

	for (const hand of handsContainer.children) {
		const nameEl = hand.querySelector('[data-h-name]') as HTMLElement
		const levelEl = hand.querySelector('[data-h-level]') as HTMLInputElement
		const playsEl = hand.querySelector('[data-h-plays]') as HTMLInputElement

		const name = nameEl.textContent as HandName
		const level = Number(levelEl.value)
		const plays = Number(playsEl.value)

		initialState.handLevels[name] = { level, plays }
	}

	for (const joker of jokerContainer.children) {
		const nameEl = joker.querySelector('[data-j-name]') as HTMLSelectElement
		const editionEl = joker.querySelector('[data-j-edition]') as HTMLSelectElement
		const plusChipsEl = joker.querySelector('[data-j-plus-chips]') as HTMLInputElement
		const plusMultiplierEl = joker.querySelector('[data-j-plus-multiplier]') as HTMLInputElement
		const timesMultiplierEl = joker.querySelector('[data-j-times-multiplier]') as HTMLInputElement
		const rankEl = joker.querySelector('[data-j-rank]') as HTMLInputElement
		const suitEl = joker.querySelector('[data-j-suit]') as HTMLInputElement
		const isActiveEl = joker.querySelector('[data-j-is-active]') as HTMLInputElement

		const name = nameEl.value as JokerName
		const edition = editionEl.value as JokerEdition
		const plusChips = Number(plusChipsEl.value)
		const plusMultiplier = Number(plusMultiplierEl.value)
		const timesMultiplier = Number(timesMultiplierEl.value)
		const rank = rankEl.value as Rank
		const suit = suitEl.value as Suit
		const isActive = isActiveEl.checked

		initialState.jokers.push({
			name,
			edition,
			plusChips,
			plusMultiplier,
			timesMultiplier,
			rank,
			suit,
			isActive,
		})
	}

	for (const card of cardContainer.children) {
		const rankEl = card.querySelector('[data-c-rank]') as HTMLInputElement
		const suitEl = card.querySelector('[data-c-suit]') as HTMLInputElement
		const editionEl = card.querySelector('[data-c-edition]') as HTMLSelectElement
		const enhancementEl = card.querySelector('[data-c-enhancement]') as HTMLSelectElement
		const sealEl = card.querySelector('[data-c-seal]') as HTMLSelectElement
		const isPlayedEl = card.querySelector('[data-c-is-played]') as HTMLInputElement

		const rank = rankEl.value as Rank
		const suit = suitEl.value as Suit
		const edition = editionEl.value as Edition
		const enhancement = enhancementEl.value as Enhancement
		const seal = sealEl.value as Seal
		const isPlayed = isPlayedEl.checked

		initialState[isPlayed ? 'playedCards' : 'heldCards'].push({
			rank,
			suit,
			edition,
			enhancement,
			seal,
		})
	}

	return initialState
}

function setInitialState (initialState: InitialState) {
	const {
		hands = 0,
		discards = 0,
		money = 0,
		blind = 'Small Blind',
		deck = 'Red Deck',
		handLevels = {},
		jokers = [],
		jokerSlots = 5,
		playedCards = [],
		heldCards = [],
	} = initialState

	handsEl.value = String(hands)
	discardsEl.value = String(discards)
	moneyEl.value = String(money)
	blindEl.value = blind
	deckEl.value = deck
	jokerSlotsEl.value = String(jokerSlots)

	for (const hand of handsContainer.children) {
		const nameEl = hand.querySelector('[data-h-name]') as HTMLElement
		const levelEl = hand.querySelector('[data-h-level]') as HTMLInputElement
		const playsEl = hand.querySelector('[data-h-plays]') as HTMLInputElement

		const name = nameEl.textContent as HandName
		const { level, plays } = handLevels[name] ?? { level: 1, plays: 0 }

		levelEl.value = String(level)
		playsEl.value = String(plays)
	}

	for (const joker of jokers) {
		addJoker(joker)
	}

	for (const card of playedCards) {
		addCard(card, true)
	}

	for (const card of heldCards) {
		addCard(card, false)
	}
}
