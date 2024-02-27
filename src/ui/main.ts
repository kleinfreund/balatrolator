import { calculateScore } from '#lib/balatro.js'
import { JOKER_DEFINITIONS } from '#lib/data.js'
import type { BlindName, InitialState, JokerName } from '#lib/types.js'
import { getRandomInt } from '#utilities/getRandomInt.js'
import { log } from '#utilities/log.js'
import { notNullish } from '#utilities/notNullish.js'

const form = document.querySelector('.form') as HTMLFormElement

const jokerContainer = document.querySelector('.joker-container') as HTMLElement
const addJokerButton = document.querySelector('.add-joker-button') as HTMLButtonElement
const jokerTemplate = document.querySelector('template#joker') as HTMLTemplateElement

const cardContainer = document.querySelector('.card-container') as HTMLElement
const addCardButton = document.querySelector('.add-card-button') as HTMLButtonElement
const cardTemplate = document.querySelector('template#card') as HTMLTemplateElement

form.addEventListener('submit', handleSubmit)
addJokerButton.addEventListener('click', handleAddJokerClick)
addCardButton.addEventListener('click', handleAddCardClick)

start()

function start () {
	let numberOfJokers = 3
	while (numberOfJokers--) addRandomJoker()

	let numberOfCards = 5
	while (numberOfCards--) addRandomCard()
}

function addRandomJoker () {
	addJokerButton.click()
	const lastJoker = jokerContainer.children[jokerContainer.children.length - 1]!
	const jokerSelect = lastJoker.querySelector('.j-name-input') as HTMLSelectElement
	const randomJokerNameIndex = getRandomInt(0, jokerSelect.children.length - 1)
	const randomJokerNameOption = jokerSelect.children[randomJokerNameIndex] as HTMLOptionElement
	jokerSelect.value = randomJokerNameOption.value
}

function addRandomCard () {
	addCardButton.click()
	const lastCard = cardContainer.children[cardContainer.children.length - 1]!

	const rankDatalist = document.querySelector('datalist#ranks') as HTMLDataListElement
	const randomRankIndex = getRandomInt(0, rankDatalist.children.length - 1)
	const randomRankOption = rankDatalist.children[randomRankIndex] as HTMLOptionElement
	const rankInput = lastCard.querySelector('.c-rank-input') as HTMLInputElement
	rankInput.value = randomRankOption.value

	const suitDatalist = document.querySelector('datalist#suits') as HTMLDataListElement
	const randomSuitIndex = getRandomInt(0, suitDatalist.children.length - 1)
	const randomSuitOption = suitDatalist.children[randomSuitIndex] as HTMLOptionElement
	const suitInput = lastCard.querySelector('.c-suit-input') as HTMLInputElement
	suitInput.value = randomSuitOption.value

	const isPlayedInput = lastCard.querySelector('.c-is-played-input') as HTMLInputElement
	isPlayedInput.checked = getRandomInt(0, 1) === 1
}

function handleAddJokerClick () {
	const joker = jokerTemplate.content.cloneNode(true) as HTMLElement
	const index = jokerContainer.children.length

	const nameInput = joker.querySelector('.j-name-input') as HTMLInputElement
	const editionInput = joker.querySelector('.j-edition-input') as HTMLSelectElement
	const plusChipsInput = joker.querySelector('.j-plus-chips-input') as HTMLInputElement
	const plusMultiplierInput = joker.querySelector('.j-plus-multiplier-input') as HTMLInputElement
	const timesMultiplierInput = joker.querySelector('.j-times-multiplier-input') as HTMLInputElement
	const isActiveInput = joker.querySelector('.j-is-active-input') as HTMLInputElement
	const rankInput = joker.querySelector('.j-rank-input') as HTMLInputElement
	const suitInput = joker.querySelector('.j-suit-input') as HTMLInputElement

	nameInput.name = `joker-name-${index}`
	editionInput.name = `joker-edition-${index}`
	plusChipsInput.name = `joker-plusChips-${index}`
	plusMultiplierInput.name = `joker-plusMultiplier-${index}`
	timesMultiplierInput.name = `joker-timesMultiplier-${index}`
	isActiveInput.name = `joker-isActive-${index}`
	rankInput.name = `joker-rank-${index}`
	suitInput.name = `joker-suit-${index}`

	joker.addEventListener('click', handleJokerClick)
	nameInput.addEventListener('change', handleJokerNameChange)

	jokerContainer.appendChild(joker)
}

function handleJokerClick () {}

function handleJokerNameChange (event: Event) {
	const input = event.currentTarget as HTMLInputElement
	const jokerName = input.value as JokerName
	const definition = JOKER_DEFINITIONS[jokerName]
	const jokerEl = input.closest('.joker') as HTMLElement

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

function handleAddCardClick () {
	const card = cardTemplate.content.cloneNode(true) as HTMLElement
	const index = cardContainer.children.length

	const isPlayedInput = card.querySelector('.c-is-played-input') as HTMLInputElement
	const rankInput = card.querySelector('.c-rank-input') as HTMLInputElement
	const suitInput = card.querySelector('.c-suit-input') as HTMLInputElement
	const editionInput = card.querySelector('.c-edition-input') as HTMLSelectElement
	const enhancementInput = card.querySelector('.c-enhancement-input') as HTMLSelectElement
	const sealInput = card.querySelector('.c-seal-input') as HTMLSelectElement

	isPlayedInput.name = `card-isPlayed-${index}`
	rankInput.name = `card-rank-${index}`
	suitInput.name = `card-suit-${index}`
	editionInput.name = `card-edition-${index}`
	enhancementInput.name = `card-enhancement-${index}`
	sealInput.name = `card-seal-${index}`

	cardContainer.appendChild(card)
}

function handleSubmit (event: SubmitEvent) {
	event.preventDefault()

	const initialState: Required<InitialState> = {
		hands: 0,
		discards: 0,
		money: 0,
		blind: 'Small Blind',
		handLevels: {},
		jokers: [],
		jokerSlots: 5,
		playedCards: [],
		heldCards: [],
	}

	const formEntries = Array.from(new FormData(form).entries()) as [string, string][]
	log(JSON.stringify(formEntries))

	for (const [name, value] of formEntries) {
		switch (name) {
			case 'hands':
			case 'discards':
			case 'money':
			case 'jokerSlots': {
				initialState[name] = Number(value)
				break
			}
			case 'blind': {
				initialState[name] = value as BlindName
			}
		}
	}

	const jokerEntries = formEntries.filter(([name]) => name.startsWith('joker-'))
	const jokers = parseListEntries(jokerEntries)
	initialState.jokers.push(...jokers)

	const cardEntries = formEntries.filter(([name]) => name.startsWith('card-'))
	const cards = parseListEntries(cardEntries)

	const playedCards = cards.filter((card) => card.isPlayed).map(({ isPlayed, ...rest }) => ({ ...rest }))
	initialState.playedCards.push(...playedCards)

	const heldCards = cards.filter((card) => !card.isPlayed).map(({ isPlayed, ...rest }) => ({ ...rest }))
	initialState.heldCards.push(...heldCards)

	log(JSON.stringify(initialState, null, 2))
	log(calculateScore(initialState))
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseListEntries (entries: [string, string][]): any[] {
	const map = new Map<number, Record<string, unknown>>()

	for (const [name, value] of entries) {
		const input = form.querySelector(`[name="${name}"]`) as HTMLInputElement
		const [, field, index] = name.split('-')
		const key = Number(index)

		if (!map.has(key)) map.set(key, {})
		const entry = map.get(key)!

		let parsedValue
		if (input.type === 'number') {
			parsedValue = Number(value)
		} else if (input.type === 'checkbox') {
			parsedValue = input.checked
		} else {
			parsedValue = value
		}

		entry[field!] = parsedValue
	}

	return Array.from(map.values())
}
