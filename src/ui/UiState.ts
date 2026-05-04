import './components/ComboBox.ts'

import { getState } from '#lib/getState.ts'
import { calculateScore } from '#lib/calculateScore.ts'
import type { ComboBox } from './components/ComboBox.ts'
import { HandLevelCard } from './components/HandLevelCard.ts'
import { JokerCard } from './components/JokerCard.ts'
import { PlayingCard } from './components/PlayingCard.ts'
import { debounce } from './debounce.ts'
import { readStateFromUrl, saveStateToUrl } from './Storage.ts'
import { SaveManager } from './SaveManager.ts'
import type { BlindName, Card, DeckName, HandName, InitialState, Joker, State, Result, InitialJoker, InitialCard } from '#lib/types.ts'

const dateTimeFormat = new Intl.DateTimeFormat(document.documentElement.lang, {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	hour: 'numeric',
	hour12: false,
	minute: 'numeric',
	second: 'numeric',
})

const saveManager = new SaveManager()

const form = document.querySelector<HTMLFormElement>('[data-form]')!
form.addEventListener('submit', (event) => {
	event.preventDefault()
	const state = readStateFromUi()
	applyState(state)
})
form.addEventListener('change', () => calculate())

const liveRegion = document.querySelector<HTMLElement>('[aria-live="polite"]')!
function ariaNotify (message: string) {
	liveRegion.innerText = message
}

const debouncedAriaNotify = debounce(ariaNotify, 1_000)

const handsInput = form.querySelector<HTMLInputElement>('[name="hands"]')!
const discardsInput = form.querySelector<HTMLInputElement>('[name="discards"]')!
const moneyInput = form.querySelector<HTMLInputElement>('[name="money"]')!

const blindNameInput = form.querySelector<ComboBox>('[name="blindName"]')!
const blindIsActiveCheckbox = form.querySelector<HTMLInputElement>('[name="blindIsActive"]')!

const deckInput = form.querySelector<ComboBox>('[name="deck"]')!

const observatoryInputs = form.querySelectorAll<HTMLInputElement>('[data-r-observatory-hand]')
const jokerSlotsInput = form.querySelector<HTMLInputElement>('[name="jokerSlots"]')!

const handLevelContainer = form.querySelector<HTMLElement>('[data-h-container]')!

const jokerContainer = form.querySelector<HTMLElement>('[data-j-container]')!
const addJokerButton = form.querySelector<HTMLButtonElement>('[data-j-add-button]')!
addJokerButton.addEventListener('click', () => addJoker())
const duplicateJokerButton = document.querySelector<HTMLButtonElement>('[data-j-duplicate-button]')!
duplicateJokerButton.addEventListener('click', (event) => duplicate(event))

const playingCardContainer = form.querySelector<HTMLElement>('[data-c-container]')!
const addCardButton = form.querySelector<HTMLButtonElement>('[data-c-add-button]')!
addCardButton.addEventListener('click', () => addPlayingCard())
const duplicateCardButton = document.querySelector<HTMLButtonElement>('[data-c-duplicate-button]')!
duplicateCardButton.addEventListener('click', (event) => duplicate(event))

const scoreCardContainer = form.querySelector<HTMLElement>('[data-sc-container]')!
const playedHandEl = form.querySelector<HTMLElement>('[data-sc-played-hand]')!
form.querySelector<HTMLButtonElement>('[data-sc-reset-button]')!.addEventListener('click', () => {
	populateUiWithState(getState({}))
})

const saveRowTemplate = document.querySelector<HTMLTemplateElement>('template#save-row')!
const saveForm = document.querySelector<HTMLFormElement>('[data-s-form]')!
saveForm.addEventListener('submit', (event) => handleSaveSubmit(event))
const importForm = document.querySelector<HTMLFormElement>('[data-s-import-form]')!
importForm.addEventListener('submit', (event) => handleImportSubmit(event))

for (const dialog of document.querySelectorAll('dialog')) {
	for (const button of dialog.querySelectorAll('button[data-modal-close-button]')) {
		if (button instanceof HTMLButtonElement) {
			button.addEventListener('click', () => {
				dialog.removeAttribute('data-duplicate-target-id')
				dialog.close()
			})
		}
	}
}

// Re-calculate score after re-ordering cards
const handleMutation: MutationCallback = (mutationList) => {
	if (mutationList.some(({ type }) => type === 'childList')) {
		calculate()
	}
}

const mutationObserver = new MutationObserver(handleMutation)
mutationObserver.observe(jokerContainer, { childList: true })
mutationObserver.observe(playingCardContainer, { childList: true })

export function init () {
	saveManager.retrieveStoredSaves()

	// Read the state from the URL first, then read it from web storage, and finally, fall back to the default/initial state.
	const state = readStateFromUrl() ?? saveManager.getAutoSave()?.state ?? getState({})
	populateUiWithState(state)

	populateSavesUi()
}

function calculate () {
	form.requestSubmit()
	if (form.checkValidity()) {
		for (const el of playingCardContainer.children) {
			if (el instanceof PlayingCard) {
				el.toggleBlindEffects(blindNameInput.value as BlindName, blindIsActiveCheckbox.checked)
			}
		}
	}
}

/**
 * Read saved hands from web storage and populate them in the UI.
 */
function populateSavesUi () {
	saveManager.retrieveStoredSaves()

	const savesContainer = document.querySelector<HTMLElement>('[data-s-saves]')!
	savesContainer.innerHTML = ''
	for (const save of saveManager.saves) {
		const fragment = saveRowTemplate.content.cloneNode(true) as Element

		const nameCell = fragment.querySelector<HTMLTableCellElement>('[data-s-name]')!
		nameCell.innerHTML = `<b>${save.name}</b>${save.autoSave ? ' <i>(autosave)</>' : ''}`

		const handCell = fragment.querySelector<HTMLTableCellElement>('[data-s-hand]')!
		handCell.innerHTML = save.hand

		const scoreCell = fragment.querySelector<HTMLTableCellElement>('[data-s-score]')!
		const averageResult = save.results.find(({ luck }) => luck === 'average')
		scoreCell.innerHTML = averageResult!.formattedScore

		const timeCell = fragment.querySelector<HTMLTableCellElement>('[data-s-time]')!
		timeCell.innerText = dateTimeFormat.format(new Date(save.time))

		const loadButton = fragment.querySelector<HTMLButtonElement>('[data-s-load-button]')!
		loadButton.setAttribute('data-save-name', save.name)
		loadButton.addEventListener('click', (event) => loadSave(event))

		const deleteButton = fragment.querySelector<HTMLButtonElement>('[data-s-delete-button]')!
		deleteButton.setAttribute('data-save-name', save.name)
		deleteButton.addEventListener('click', (event) => deleteSave(event))

		const exportButton = fragment.querySelector<HTMLButtonElement>('[data-s-export-button]')!
		exportButton.setAttribute('data-save-name', save.name)
		exportButton.addEventListener('click', (event) => exportSave(event))

		savesContainer.appendChild(fragment)
	}
}

function loadSave (event: Event) {
	const button = event.currentTarget as HTMLButtonElement
	const name = button.getAttribute('data-save-name')!

	const { state } = saveManager.getSave(name)!
	populateUiWithState(state)
}

function handleSaveSubmit (event: SubmitEvent) {
	event.preventDefault()

	const state = readStateFromUi()
	const form = event.currentTarget as HTMLFormElement
	const formData = new FormData(form)
	const name = formData.get('name') as Exclude<FormDataEntryValue, File> | null ?? `Save ${saveManager.saves.length - 1}`

	const { hand, results } = calculateScore(state)
	saveManager.save(name, state, hand, results)
	storeSaves()
}

/**
 * Delete a save.
 */
function deleteSave (event: Event) {
	const button = event.currentTarget as HTMLButtonElement
	const name = button.getAttribute('data-save-name')!
	saveManager.deleteSave(name)
	storeSaves()
}

function exportSave (event: Event) {
	const button = event.currentTarget as HTMLButtonElement
	const name = button.getAttribute('data-save-name')!
	const save = saveManager.getSave(name)!

	const blob = new Blob([JSON.stringify(save.state)], { type: 'application/json' })
	const objectUrl = window.URL.createObjectURL(blob)
	const link = Object.assign(document.createElement('a'), {
		download: `${save.name}.json`,
		href: objectUrl,
	})
	link.click()
	link.remove()
	window.URL.revokeObjectURL(objectUrl)
}

/**
 * Stores all saves in web storage and populates saves UI.
 */
function storeSaves () {
	saveManager.storeSaves()
	populateSavesUi()
}

function handleImportSubmit (event: SubmitEvent) {
	event.preventDefault()

	const form = event.currentTarget as HTMLFormElement
	const formData = new FormData(form)
	const file = formData.get('import') as File
	const fileReader = new FileReader()
	fileReader.addEventListener('load', () => {
		if (typeof fileReader.result === 'string') {
			const name = file.name.replace('.json', '')
			const state = JSON.parse(fileReader.result) as State
			const { hand, results } = calculateScore(state)
			saveManager.save(name, state, hand, results)
			storeSaves()
		}
	})
	fileReader.readAsText(file)
}

function applyState (state: State) {
	const { hand, results } = calculateScore(state)
	updateScore(hand, results)
	saveStateToUrl(state)

	// Save the current state as a special auto save overwriting the previous auto save.
	saveManager.autoSave(state, hand, results)
	storeSaves()
}

function updateScore (hand: HandName, results: Result[]) {
	const resultsByScore = new Map<string, Result>()
	for (const result of results) {
		if (!resultsByScore.has(result.score)) {
			resultsByScore.set(result.score, result)
		}
	}

	playedHandEl.textContent = hand

	scoreCardContainer.innerHTML = ''
	for (const result of resultsByScore.values()) {
		const template = document.querySelector<HTMLTemplateElement>('template#score-card')!
		const fragment = template.content.cloneNode(true) as Element

		const luckEl = fragment.querySelector<HTMLElement>('[data-sc-luck]')!
		luckEl.textContent = result.luck

		const formattedScoreEl = fragment.querySelector<HTMLElement>('[data-sc-formatted-score]')!
		formattedScoreEl.textContent = result.formattedScore

		const scoreEl = fragment.querySelector<HTMLElement>('[data-sc-score]')!
		const equation = `${result.chips}×${result.multiplier}`
		scoreEl.textContent = equation + '\n= ' + result.score

		scoreCardContainer.appendChild(fragment)
	}

	const resultArray = Array.from(resultsByScore.values())

	let scoreAnnouncement
	if (resultArray.length === 3) {
		const scoreLuckNone = resultArray.at(0)!.formattedScore
		const scoreLuckAverage = resultArray.at(1)!.formattedScore
		const scoreLuckAll = resultArray.at(2)!.formattedScore
		scoreAnnouncement = `${hand} scoring ${scoreLuckAverage} on average, ${scoreLuckAll} in the best case, and ${scoreLuckNone} in the worst case.`
	} else {
		scoreAnnouncement = `${hand} scoring ${resultArray.at(0)!.formattedScore}.`
	}
	debouncedAriaNotify(scoreAnnouncement)

	const scoreLog = form.querySelector<HTMLPreElement>('[data-sc-log]')!
	scoreLog.innerHTML = resultArray.map((result) => result.log.join('\n')).join('\n')
}

/**
 * Assembles a `State` object from the various form elements in the UI.
 *
 * Inverse operation of `populateUiWithState`.
 */
function readStateFromUi (): State {
	const formData = new FormData(form)

	const hands = Number(formData.get('hands'))
	const discards = Number(formData.get('discards'))
	const money = Number(formData.get('money'))
	const blindName = formData.get('blindName') as BlindName
	const blindIsActive = formData.get('blindIsActive') === 'is-active'
	const deck = formData.get('deck') as DeckName
	const jokerSlots = Number(formData.get('jokerSlots'))

	const initialState: Required<InitialState> = {
		hands,
		discards,
		money,
		blind: {
			name: blindName,
			active: blindIsActive,
		},
		deck,
		observatory: {},
		handLevels: {},
		jokers: [],
		jokerSlots,
		cards: [],
	}

	for (const observatoryInput of observatoryInputs) {
		const handName = observatoryInput.getAttribute('data-r-observatory-hand') as HandName
		initialState.observatory[handName] = Number(observatoryInput.value)
	}

	for (const handLevel of handLevelContainer.children) {
		if (!(handLevel instanceof HandLevelCard)) continue

		initialState.handLevels[handLevel.handName] = {
			level: handLevel.level,
			plays: handLevel.plays,
		}
	}

	for (const jokerCard of jokerContainer.children) {
		if (!(jokerCard instanceof JokerCard)) continue

		initialState.jokers.push({
			name: jokerCard.jokerName,
			edition: jokerCard.edition,
			plusChips: jokerCard.plusChips,
			plusMultiplier: jokerCard.plusMultiplier,
			timesMultiplier: jokerCard.timesMultiplier,
			rank: jokerCard.rank,
			suit: jokerCard.suit,
			active: jokerCard.active,
			count: jokerCard.count,
		} satisfies Omit<Required<InitialJoker>, 'index'>)
	}

	for (const playingCard of playingCardContainer.children) {
		if (!(playingCard instanceof PlayingCard)) continue

		initialState.cards.push({
			rank: playingCard.rank,
			suit: playingCard.suit,
			edition: playingCard.edition,
			enhancement: playingCard.enhancement,
			seal: playingCard.seal,
			debuffed: playingCard.debuffed,
			played: playingCard.played,
			count: playingCard.count,
		} satisfies Omit<Required<InitialCard>, 'index'>)
	}

	return getState(initialState)
}

/**
 * Populates the UI using a `State` object. Tries to retrieve this object from the URL or local storage.
 */
function populateUiWithState (state: State) {
	handsInput.value = String(state.hands)
	discardsInput.value = String(state.discards)
	moneyInput.value = String(state.money)
	blindNameInput.value = state.blind.name
	blindIsActiveCheckbox.checked = state.blind.active
	deckInput.value = state.deck
	jokerSlotsInput.value = String(state.jokerSlots)

	for (const observatoryInput of observatoryInputs) {
		const handName = observatoryInput.getAttribute('data-r-observatory-hand') as HandName
		observatoryInput.value = String(state.observatory[handName] ?? 0)
	}

	handLevelContainer.innerHTML = ''
	for (const [handName, handLevel] of Object.entries(state.handLevels)) {
		handLevelContainer.append(
			new HandLevelCard(handName as HandName, handLevel),
		)
	}

	jokerContainer.innerHTML = ''
	for (const joker of state.jokers) {
		addJoker(joker)
	}

	playingCardContainer.innerHTML = ''
	for (const card of state.cards) {
		addPlayingCard(card)
	}

	applyState(state)
}

function addJoker (joker?: Joker) {
	const el = new JokerCard(joker)
	jokerContainer.append(el)
}

function addPlayingCard (card?: Card) {
	const el = new PlayingCard(card)
	playingCardContainer.append(el)
	el.toggleBlindEffects(blindNameInput.value as BlindName, blindIsActiveCheckbox.checked)
}

function duplicate (event: Event) {
	const button = event.currentTarget as HTMLButtonElement
	const dialog = button.closest('dialog')!
	const id = dialog.getAttribute('data-duplicate-target-id') ?? ''
	const card = document.getElementById(id)

	if (card instanceof JokerCard || card instanceof PlayingCard) {
		const input = dialog.querySelector('input')!
		let numberOfCopies = Number(input.value)
		while (numberOfCopies--) {
			const copy = card.clone()
			card.insertAdjacentElement('afterend', copy)
			if (copy instanceof PlayingCard) {
				copy.toggleBlindEffects(blindNameInput.value as BlindName, blindIsActiveCheckbox.checked)
			}
		}
	}

	dialog.close()
	calculate()
}
