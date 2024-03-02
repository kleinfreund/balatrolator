import { calculateScore } from '#lib/balatro.js'
import { JOKER_DEFINITIONS, JOKER_NAMES, RANKS, SUITS } from '#lib/data.js'
import type { BlindName, DeckName, Edition, Enhancement, HandName, InitialCard, InitialJoker, InitialState, JokerEdition, JokerName, Rank, Seal, Suit } from '#lib/types.js'
import { getRandomInt } from '#utilities/getRandomInt.js'
import { log } from '#utilities/log.js'
import { notNullish } from '#utilities/notNullish.js'
import { fetchState, saveState } from '#utilities/Storage.js'

const form = document.querySelector('[data-form]') as HTMLFormElement

const handsEl = form.querySelector('[data-r-hands]') as HTMLInputElement
const discardsEl = form.querySelector('[data-r-discards]') as HTMLInputElement
const moneyEl = form.querySelector('[data-r-money]') as HTMLInputElement
const blindNameEl = form.querySelector('[data-r-blind-name]') as HTMLSelectElement
const blindIsActiveEl = form.querySelector('[data-r-blind-is-active]') as HTMLInputElement
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
// Quick and dirty way to update the state whenever necessary
form.addEventListener('change', function () {
	for (const cardEl of cardContainer.children) {
		updateCardState(cardEl)
	}

	for (const jokerEl of jokerContainer.children) {
		updateJokerState(jokerEl)
	}
})
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
	const blindName = blindNameEl.value as BlindName
	const blindIsActive = blindIsActiveEl.checked
	const deck = deckEl.value as DeckName
	const jokerSlots = Number(jokerSlotsEl.value)

	const initialState: Required<InitialState> = {
		hands,
		discards,
		money,
		blind: {
			name: blindName,
			isActive: blindIsActive,
		},
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
		const nameSelect = joker.querySelector('[data-j-name]') as HTMLSelectElement
		const editionSelect = joker.querySelector('[data-j-edition]') as HTMLSelectElement
		const plusChipsInput = joker.querySelector('[data-j-plus-chips]') as HTMLInputElement
		const plusMultiplierInput = joker.querySelector('[data-j-plus-multiplier]') as HTMLInputElement
		const timesMultiplierInput = joker.querySelector('[data-j-times-multiplier]') as HTMLInputElement
		const rankSelect = joker.querySelector('[data-j-rank]') as HTMLSelectElement
		const suitSelect = joker.querySelector('[data-j-suit]') as HTMLSelectElement
		const isActiveCheckbox = joker.querySelector('[data-j-is-active]') as HTMLInputElement

		const name = nameSelect.value as JokerName
		const edition = editionSelect.value as JokerEdition
		const plusChips = Number(plusChipsInput.value)
		const plusMultiplier = Number(plusMultiplierInput.value)
		const timesMultiplier = Number(timesMultiplierInput.value)
		const rank = rankSelect.value as Rank
		const suit = suitSelect.value as Suit
		const isActive = isActiveCheckbox.checked

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

	for (const cardEl of cardContainer.children) {
		const rankSelect = cardEl.querySelector('[data-c-rank]') as HTMLSelectElement
		const suitSelect = cardEl.querySelector('[data-c-suit]') as HTMLSelectElement
		const editionSelect = cardEl.querySelector('[data-c-edition]') as HTMLSelectElement
		const enhancementSelect = cardEl.querySelector('[data-c-enhancement]') as HTMLSelectElement
		const sealSelect = cardEl.querySelector('[data-c-seal]') as HTMLSelectElement
		const isPlayedCheckbox = cardEl.querySelector('[data-c-is-played]') as HTMLInputElement
		const isDebuffedCheckbox = cardEl.querySelector('[data-c-is-debuffed]') as HTMLInputElement

		const rank = rankSelect.value as Rank
		const suit = suitSelect.value as Suit
		const edition = editionSelect.value as Edition
		const enhancement = enhancementSelect.value as Enhancement
		const seal = sealSelect.value as Seal
		const isPlayed = isPlayedCheckbox.checked
		const isDebuffed = isDebuffedCheckbox.checked

		initialState[isPlayed ? 'playedCards' : 'heldCards'].push({
			rank,
			suit,
			edition,
			enhancement,
			seal,
			isDebuffed,
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
		blind: initialBlind,
		deck = 'Red Deck',
		handLevels = {},
		jokers = [],
		jokerSlots = 5,
		playedCards = [],
		heldCards = [],
	} = initialState

	const blind = {
		name: initialBlind?.name ?? 'Small Blind',
		isActive: initialBlind?.isActive ?? true,
	}

	handsEl.value = String(hands)
	discardsEl.value = String(discards)
	moneyEl.value = String(money)
	blindNameEl.value = blind.name
	blindIsActiveEl.checked = blind.isActive
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
	updateJokerState(jokerEl)
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
		move(cardContainer, event.currentTarget.closest('[data-playing-card]')!, -1)
	}
}

function handleMoveCardRightClick (event: Event) {
	if (event.currentTarget instanceof HTMLElement) {
		move(cardContainer, event.currentTarget.closest('[data-playing-card]')!, 1)
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

function updateJokerState (el: Element) {
	const jokerNameEl = el.querySelector('[data-j-name]') as HTMLInputElement
	const jokerName = jokerNameEl.value as JokerName
	const definition = JOKER_DEFINITIONS[jokerName]
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
	const cardEl = template.querySelector('[data-playing-card]') as HTMLElement
	const index = cardContainer.children.length

	const isPlayedCheckbox = cardEl.querySelector('.c-is-played-input') as HTMLInputElement
	const isDebuffedCheckbox = cardEl.querySelector('.c-is-debuffed-input') as HTMLInputElement
	const rankInput = cardEl.querySelector('.c-rank-input') as HTMLInputElement
	const suitInput = cardEl.querySelector('.c-suit-input') as HTMLInputElement
	const editionSelect = cardEl.querySelector('.c-edition-input') as HTMLSelectElement
	const enhancementSelect = cardEl.querySelector('.c-enhancement-input') as HTMLSelectElement
	const sealSelect = cardEl.querySelector('.c-seal-input') as HTMLSelectElement

	isPlayedCheckbox.name = `card-is-played-${index}`
	isDebuffedCheckbox.name = `card-is-debuffed-${index}`
	rankInput.name = `card-rank-${index}`
	suitInput.name = `card-suit-${index}`
	editionSelect.name = `card-edition-${index}`
	enhancementSelect.name = `card-enhancement-${index}`
	sealSelect.name = `card-seal-${index}`

	cardEl.addEventListener('click', function (event) {
		if (event.currentTarget && !isInteractive(event)) {
			isPlayedCheckbox.click()
		}
	}, { capture: true })

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
			isDebuffed,
		} = initialCard

		isPlayedCheckbox.checked = Boolean(isPlayed)
		isDebuffedCheckbox.checked = Boolean(isDebuffed)
		rankInput.value = rank
		suitInput.value = suit
		editionSelect.value = edition ?? 'base'
		enhancementSelect.value = enhancement ?? 'none'
		sealSelect.value = seal ?? 'none'
	}

	cardContainer.appendChild(template)

	setButtonDisabledStates(cardContainer)
	updateCardState(cardEl)
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

function updateCardState (el: Element) {
	const isPlayedCheckbox = el.querySelector('[data-c-is-played]') as HTMLInputElement
	const isDebuffedCheckbox = el.querySelector('[data-c-is-debuffed]') as HTMLInputElement

	el.classList.remove(
		'--is-played',
		'--is-debuffed',
		'--is-blind-the-pillar'
	)

	;[
		isPlayedCheckbox.checked ? '--is-played' : null,
		isDebuffedCheckbox.checked ? '--is-debuffed' : null,
		blindNameEl.value === 'The Pillar' && blindIsActiveEl.checked ? '--is-blind-the-pillar' : undefined,
	].filter(notNullish).forEach((className) => el.classList.add(className))
}

function handleRemoveCardClick (event: Event) {
	if (event.currentTarget instanceof HTMLElement) {
		event.currentTarget.closest('[data-playing-card]')!.remove()
	}
}
