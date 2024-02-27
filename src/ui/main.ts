import { log } from '#utilities/log.js'
import { BlindName, InitialState } from '../lib/types.js'

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

	const jokerDatalist = document.querySelector('datalist#jokers') as HTMLDataListElement
	const randomJokerNameIndex = getRandomInt(0, jokerDatalist.children.length - 1)
	const randomJokerNameOption = jokerDatalist.children[randomJokerNameIndex] as HTMLOptionElement
	const nameInput = lastJoker.querySelector('[name^="joker-name-"]') as HTMLInputElement
	nameInput.value = randomJokerNameOption.value
}

function addRandomCard () {
	addCardButton.click()
	const lastCard = cardContainer.children[cardContainer.children.length - 1]!

	const rankDatalist = document.querySelector('datalist#ranks') as HTMLDataListElement
	const randomRankIndex = getRandomInt(0, rankDatalist.children.length - 1)
	const randomRankOption = rankDatalist.children[randomRankIndex] as HTMLOptionElement
	const rankInput = lastCard.querySelector('[name^="card-rank-"]') as HTMLInputElement
	rankInput.value = randomRankOption.value

	const suitDatalist = document.querySelector('datalist#suits') as HTMLDataListElement
	const randomSuitIndex = getRandomInt(0, suitDatalist.children.length - 1)
	const randomSuitOption = suitDatalist.children[randomSuitIndex] as HTMLOptionElement
	const suitInput = lastCard.querySelector('[name^="card-suit-"]') as HTMLInputElement
	suitInput.value = randomSuitOption.value

	const isPlayedInput = lastCard.querySelector('[name^="card-isPlayed-"]') as HTMLInputElement
	isPlayedInput.checked = getRandomInt(0, 1) === 1
}

function getRandomInt (min: number, max: number): number {
	min = Math.ceil(min)
	max = Math.floor(max)
	return Math.floor(Math.random() * (max - min + 1)) + min
}

function handleAddJokerClick () {
	const joker = jokerTemplate.content.cloneNode(true) as HTMLElement

	const nameInput = joker.querySelector(`input[list="jokers"]`) as HTMLInputElement
	nameInput.name = `joker-name-${jokerContainer.children.length}`

	jokerContainer.appendChild(joker)
}

function handleAddCardClick () {
	const card = cardTemplate.content.cloneNode(true) as HTMLElement

	const isPlayedInput = card.querySelector('input[type="checkbox"]') as HTMLInputElement
	isPlayedInput.name = `card-isPlayed-${cardContainer.children.length}`

	const rankInput = card.querySelector('input[list="ranks"]') as HTMLInputElement
	rankInput.name = `card-rank-${cardContainer.children.length}`

	const suitInput = card.querySelector('input[list="suits"]') as HTMLInputElement
	suitInput.name = `card-suit-${cardContainer.children.length}`

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
	// log(calculateScore(initialState))
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
