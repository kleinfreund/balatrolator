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
const blindEl = form.querySelector('[data-r-blind]') as HTMLSelectElement
const deckEl = form.querySelector('[data-r-deck]') as HTMLSelectElement
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
window.addEventListener('popstate', () => {
	populateUiWithState()
})

if (import.meta.env.VITE_DEBUG === 'true') {
	let numberOfJokers = 3
	while (numberOfJokers--) addRandomJoker()

	let numberOfCards = 5
	while (numberOfCards--) addRandomCard()
} else {
	populateUiWithState()
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

function handleSubmit (event: SubmitEvent) {
	event.preventDefault()

	const initialState = readStateFromUi()
	saveState('state', initialState)
	const score = calculateScore(initialState)
	log(score)
	document.querySelector('[data-formatted-score]')!.textContent = score.formattedScore
	document.querySelector('[data-score]')!.textContent = new Intl.NumberFormat('en').format(score.score)
}

/**
 * Assembles an `InitialState` object from the various form elements in the UI.
 *
 * Inverse operation of `populateUiWithState`
 */
function readStateFromUi (): InitialState {
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
		const rankEl = joker.querySelector('[data-j-rank]') as HTMLSelectElement
		const suitEl = joker.querySelector('[data-j-suit]') as HTMLSelectElement
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
		const rankEl = card.querySelector('[data-c-rank]') as HTMLSelectElement
		const suitEl = card.querySelector('[data-c-suit]') as HTMLSelectElement
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

/**
 * Populates the UI using an `InitialState` object. Tries to retrieve this object from the URL or local storage.
 */
function populateUiWithState () {
	const initialState = fetchState('state')
	if (!initialState) {
		return
	}

	saveState('state', initialState)

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

	jokerContainer.innerHTML = ''
	for (const joker of jokers) {
		addJoker(joker)
	}

	cardContainer.innerHTML = ''
	for (const card of playedCards) {
		addCard(card, true)
	}

	for (const card of heldCards) {
		addCard(card, false)
	}
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

	nameInput.addEventListener('change', handleJokerNameChange)

	const removeButton = jokerEl.querySelector('[data-remove-button]') as HTMLButtonElement
	removeButton.addEventListener('click', handleRemoveJokerClick)

	const moveLeftButton = jokerEl.querySelector('[data-move-left-button]') as HTMLButtonElement
	moveLeftButton.addEventListener('click', handleMoveJokerLeftClick)

	const moveRightButton = jokerEl.querySelector('[data-move-right-button]') as HTMLButtonElement
	moveRightButton.addEventListener('click', handleMoveJokerRightClick)

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

	setButtonDisabledStates(jokerContainer)
	applyJokerState(jokerEl, initialJoker ? JOKER_DEFINITIONS[initialJoker.name] : undefined)
}

function setButtonDisabledStates (container: Element) {
	for (const el of container.children) {
		const moveLeftButton = el.querySelector('[data-move-left-button]') as HTMLButtonElement
		moveLeftButton.disabled = el === container.children[0]

		const moveRightButton = el.querySelector('[data-move-right-button]') as HTMLButtonElement
		moveRightButton.disabled = el === container.children[container.children.length - 1]
	}
}

function handleRemoveJokerClick (event: Event) {
	if (event.currentTarget instanceof HTMLElement) {
		event.currentTarget.closest('[data-joker]')!.remove()
	}
}

function handleMoveJokerLeftClick (event: Event) {
	if (event.currentTarget instanceof HTMLElement) {
		move(jokerContainer, event.currentTarget.closest('[data-joker]')!, -1)
	}
}

function handleMoveJokerRightClick (event: Event) {
	if (event.currentTarget instanceof HTMLElement) {
		move(jokerContainer, event.currentTarget.closest('[data-joker]')!, 1)
	}
}

function handleMoveCardLeftClick (event: Event) {
	if (event.currentTarget instanceof HTMLElement) {
		move(cardContainer, event.currentTarget.closest('[data-card]')!, -1)
	}
}

function handleMoveCardRightClick (event: Event) {
	if (event.currentTarget instanceof HTMLElement) {
		move(cardContainer, event.currentTarget.closest('[data-card]')!, 1)
	}
}

function move (container: Element, currentEl: Element, direction: 1 | -1) {
	const index = Array.from(container.children).findIndex((el) => el === currentEl)

	if (direction === -1 ? index === 0 : index === (container.children.length - 1)) {
		return
	}

	const otherEl = container.children[index + direction]!

	if (direction === -1) {
		container.insertBefore(currentEl, otherEl)
	} else {
		container.insertBefore(otherEl, currentEl)
	}

	setButtonDisabledStates(container)
}

function handleJokerNameChange (event: Event) {
	const input = event.currentTarget as HTMLInputElement
	const jokerName = input.value as JokerName
	const definition = JOKER_DEFINITIONS[jokerName]
	const jokerEl = input.closest('.joker')!

	applyJokerState(jokerEl, definition)
}

function applyJokerState (el: Element, definition?: JokerDefinition) {
	if (!definition) {
		return
	}

	el.classList.remove(
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
	].filter(notNullish).forEach((className) => el.classList.add(className))
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

	cardEl.addEventListener('click', function (event) {
		if (event.currentTarget && !isInteractive(event)) {
			isPlayedInput.click()
		}
	}, { capture: true })

	isPlayedInput.addEventListener('change', handleIsPlayedChange)

	const removeButton = cardEl.querySelector('[data-remove-button]') as HTMLButtonElement
	removeButton.addEventListener('click', handleRemoveCardClick)

	const moveLeftButton = cardEl.querySelector('[data-move-left-button]') as HTMLButtonElement
	moveLeftButton.addEventListener('click', handleMoveCardLeftClick)

	const moveRightButton = cardEl.querySelector('[data-move-right-button]') as HTMLButtonElement
	moveRightButton.addEventListener('click', handleMoveCardRightClick)

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

	setButtonDisabledStates(cardContainer)
	applyCardState(cardEl, Boolean(isPlayed))
}

function isInteractive (event: Event): boolean {
	for (const target of event.composedPath()) {
		if (target === event.currentTarget) {
			break
		}

		if (
			target instanceof HTMLLabelElement ||
			target instanceof HTMLSelectElement ||
			target instanceof HTMLInputElement ||
			target instanceof HTMLButtonElement ||
			(target instanceof HTMLAnchorElement && target.href)
		) {
			return true
		}
	}

	return false
}

function handleIsPlayedChange (event: Event) {
	const checkbox = event.currentTarget as HTMLInputElement
	const cardEl = checkbox.closest('.playing-card')!

	applyCardState(cardEl, checkbox.checked)
}

function applyCardState (el: Element, isPlayed: boolean) {
	el.classList.remove(
		'--is-played',
	)

	;[
		isPlayed ? '--is-played' : null,
	].filter(notNullish).forEach((className) => el.classList.add(className))
}

function handleRemoveCardClick (event: Event) {
	if (event.currentTarget instanceof HTMLElement) {
		event.currentTarget.closest('[data-card]')!.remove()
	}
}
