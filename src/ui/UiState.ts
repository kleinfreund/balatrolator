import { HandLevel } from './components/HandLevel.js'
import { JokerCard } from './components/JokerCard.js'
import { PlayingCard } from './components/PlayingCard.js'
import { getState } from '#utilities/getState.js'
import { log } from '#utilities/log.js'
import { calculateScore } from '#lib/balatro.js'
import type { BlindName, Card, DeckName, HandName, InitialState, Joker, State, ResultScore, PlanetName } from '#lib/types.js'
import { PLANET_TO_HAND_MAP } from '#/lib/data.js'
import { readStateFromUrl, saveStateToUrl } from '#/utilities/Storage.js'
import { SaveManager } from './SaveManager.js'

const dateTimeFormat = new Intl.DateTimeFormat(document.documentElement.lang, {
	year: 'numeric',
	month: 'short',
	day: 'numeric',
	hour: 'numeric',
	hour12: false,
	minute: 'numeric',
	second: 'numeric',
})

export class UiState {
	#saveManager = new SaveManager()

	#form: HTMLFormElement

	#handsInput: HTMLInputElement
	#discardsInput: HTMLInputElement
	#moneyInput: HTMLInputElement
	#blindNameSelect: HTMLSelectElement
	#blindIsActiveCheckbox: HTMLInputElement
	#deckSelect: HTMLSelectElement
	#observatoryCheckboxes: NodeListOf<HTMLInputElement>
	#jokerSlotsInput: HTMLInputElement

	#handLevelContainer: HTMLElement

	#jokerContainer: HTMLElement
	#addJokerButton: HTMLButtonElement
	#duplicateJokerButton: HTMLButtonElement

	#playingCardContainer: HTMLElement
	#addCardButton: HTMLButtonElement
	#duplicateCardButton: HTMLButtonElement

	#scoreCardContainer: HTMLElement
	#playedHandEl: HTMLElement

	#savesContainer: HTMLElement
	#saveRowTemplate: HTMLTemplateElement
	#saveForm: HTMLFormElement
	#importForm: HTMLFormElement

	constructor () {
		const form = document.querySelector<HTMLFormElement>('[data-form]')!
		this.#form = form
		form.addEventListener('submit', (event) => this.#handleSubmit(event))

		this.#handsInput = form.querySelector<HTMLInputElement>('[data-r-hands]')!
		this.#discardsInput = form.querySelector<HTMLInputElement>('[data-r-discards]')!
		this.#moneyInput = form.querySelector<HTMLInputElement>('[data-r-money]')!
		this.#blindNameSelect = form.querySelector<HTMLSelectElement>('[data-r-blind-name]')!
		this.#blindIsActiveCheckbox = form.querySelector<HTMLInputElement>('[data-r-blind-is-active]')!
		this.#deckSelect = form.querySelector<HTMLSelectElement>('[data-r-deck]')!
		this.#observatoryCheckboxes = form.querySelectorAll<HTMLInputElement>('[data-r-observatory-checkbox]')
		this.#jokerSlotsInput = form.querySelector<HTMLInputElement>('[data-r-joker-slots]')!

		this.#handLevelContainer = form.querySelector<HTMLElement>('[data-h-container]')!

		this.#jokerContainer = form.querySelector<HTMLElement>('[data-j-container]')!
		this.#addJokerButton = form.querySelector<HTMLButtonElement>('[data-j-add-button]')!
		this.#addJokerButton.addEventListener('click', () => this.#addJoker())
		this.#duplicateJokerButton = document.querySelector<HTMLButtonElement>('[data-j-duplicate-button]')!
		this.#duplicateJokerButton.addEventListener('click', (event) => this.#duplicate(event))

		this.#playingCardContainer = form.querySelector<HTMLElement>('[data-c-container]')!
		this.#addCardButton = form.querySelector<HTMLButtonElement>('[data-c-add-button]')!
		this.#addCardButton.addEventListener('click', () => this.#addCard())
		this.#duplicateCardButton = document.querySelector<HTMLButtonElement>('[data-c-duplicate-button]')!
		this.#duplicateCardButton.addEventListener('click', (event) => this.#duplicate(event))

		this.#scoreCardContainer = form.querySelector<HTMLElement>('[data-sc-container]')!
		this.#playedHandEl = form.querySelector<HTMLElement>('[data-sc-played-hand]')!

		this.#savesContainer = document.querySelector<HTMLElement>('[data-s-saves]')!
		this.#saveRowTemplate = document.querySelector<HTMLTemplateElement>('template#save-row')!
		this.#saveForm = document.querySelector<HTMLFormElement>('[data-s-form]')!
		this.#saveForm.addEventListener('submit', (event) => this.#handleSaveSubmit(event))
		this.#importForm = document.querySelector<HTMLFormElement>('[data-s-import-form]')!
		this.#importForm.addEventListener('submit', (event) => this.#handleImportSubmit(event))
		this.#populateSavesUiFromStorage()

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

		// Quick and dirty way to update the state whenever necessary
		form.addEventListener('change', () => this.#calculate())
	}

	init () {
		// Read the state from the URL first, then read it from web storage, and finally, fall back to the default/initial state.
		const state = readStateFromUrl() ?? this.#getAutoSaveState() ?? getState({})
		this.#populateUiWithState(state)
	}

	#handleSubmit (event: SubmitEvent) {
		event.preventDefault()
		const state = this.#readStateFromUi()
		this.#applyState(state)
	}

	#calculate () {
		this.#form.requestSubmit()
		for (const el of this.#playingCardContainer.children) {
			if (el instanceof PlayingCard) {
				el.updateState()
			}
		}

		for (const el of this.#jokerContainer.children) {
			if (el instanceof JokerCard) {
				el.updateState()
			}
		}
	}

	/**
	 * Read saved hands from web storage and populate them in the UI.
	 */
	#populateSavesUiFromStorage () {
		this.#saveManager.retrieveStoredSaves()

		this.#savesContainer.innerHTML = ''
		for (const save of this.#saveManager.saves) {
			const fragment = this.#saveRowTemplate.content.cloneNode(true) as Element

			const nameCell = fragment.querySelector<HTMLTableCellElement>('[data-s-name]')!
			nameCell.innerHTML = `<b>${save.name}</b>${save.autoSave ? ' <i>(autosave)</>' : ''}`

			const timeCell = fragment.querySelector<HTMLTableCellElement>('[data-s-time]')!
			timeCell.innerText = dateTimeFormat.format(new Date(save.time))

			const loadButton = fragment.querySelector<HTMLButtonElement>('[data-s-load-button]')!
			loadButton.setAttribute('data-save-name', save.name)
			loadButton.addEventListener('click', (event) => this.#loadSave(event))

			const deleteButton = fragment.querySelector<HTMLButtonElement>('[data-s-delete-button]')!
			deleteButton.setAttribute('data-save-name', save.name)
			deleteButton.addEventListener('click', (event) => this.#deleteSave(event))

			const exportButton = fragment.querySelector<HTMLButtonElement>('[data-s-export-button]')!
			exportButton.setAttribute('data-save-name', save.name)
			exportButton.addEventListener('click', (event) => this.#exportSave(event))

			this.#savesContainer.appendChild(fragment)
		}
	}

	#loadSave (event: Event) {
		const button = event.currentTarget as HTMLButtonElement
		const name = button.getAttribute('data-save-name')!

		const { state } = this.#saveManager.getSave(name)!
		this.#populateUiWithState(state)
	}

	#handleSaveSubmit (event: SubmitEvent) {
		event.preventDefault()

		const state = this.#readStateFromUi()
		const form = event.currentTarget as HTMLFormElement
		const formData = new FormData(form)
		const name = formData.get('name') as Exclude<FormDataEntryValue, File> | null ?? `Save ${this.#saveManager.saves.length - 1}`

		this.#saveManager.save(name, state)
		this.#storeSaves()
	}

	/**
	 * Save the current state as a special auto save overwriting the previous auto save.
	 */
	#autoSave (state: State) {
		this.#saveManager.autoSave(state)
		this.#storeSaves()
	}

	/**
	 * Delete a save.
	 */
	#deleteSave (event: Event) {
		const button = event.currentTarget as HTMLButtonElement
		const name = button.getAttribute('data-save-name')!
		this.#saveManager.deleteSave(name)
		this.#storeSaves()
	}

	#exportSave (event: Event) {
		const button = event.currentTarget as HTMLButtonElement
		const name = button.getAttribute('data-save-name')!
		const save = this.#saveManager.getSave(name)!

		const link = document.createElement('a')
		link.download = `${save.name}.json`
		const blob = new Blob([JSON.stringify(save.state)], { type: 'application/json' })
		link.href = window.URL.createObjectURL(blob)

		link.click()
		link.remove()
	}

	/**
	 * Stores all saves in web storage and populates saves UI.
	 */
	#storeSaves () {
		this.#saveManager.storeSaves()
		this.#populateSavesUiFromStorage()
	}

	#getAutoSaveState () {
		return this.#saveManager.getAutoSave()?.state ?? null
	}

	#handleImportSubmit (event: SubmitEvent) {
		event.preventDefault()

		const form = event.currentTarget as HTMLFormElement
		const formData = new FormData(form)
		const file = formData.get('import') as File
		const fileReader = new FileReader()
		fileReader.addEventListener('load', () => {
			if (typeof fileReader.result === 'string') {
				const name = file.name.replace('.json', '')
				const state = JSON.parse(fileReader.result) as State
				this.#saveManager.save(name, state)
				this.#storeSaves()
			}
		})
		fileReader.readAsText(file)
	}

	#applyState (state: State) {
		this.#updateScore(state)
		saveStateToUrl(state)
		this.#autoSave(state)
	}

	#updateScore (state: State) {
		const { hand, scoringCards, scores } = calculateScore(state)
		log({ hand, scoringCards, scores })

		const distinctScores = new Map<number, ResultScore>()
		for (const score of scores) {
			if (!distinctScores.has(score.score)) {
				distinctScores.set(score.score, score)
			}
		}

		this.#playedHandEl.textContent = hand

		this.#scoreCardContainer.innerHTML = ''
		for (const score of distinctScores.values()) {
			const template = document.querySelector<HTMLTemplateElement>('template#score-card')!
			const fragment = template.content.cloneNode(true) as Element

			const luckEl = fragment.querySelector<HTMLElement>('[data-sc-luck]')!
			luckEl.textContent = score.luck

			const formattedScoreEl = fragment.querySelector<HTMLElement>('[data-sc-formatted-score]')!
			formattedScoreEl.textContent = score.formattedScore

			const scoreEl = fragment.querySelector<HTMLElement>('[data-sc-score]')!
			scoreEl.textContent = new Intl.NumberFormat('en').format(score.score)

			this.#scoreCardContainer.appendChild(fragment)
		}
	}

	/**
	 * Assembles a `State` object from the various form elements in the UI.
	 *
	 * Inverse operation of `populateUiWithState`.
	 */
	#readStateFromUi (): State {
		const formData = new FormData(this.#form)

		const hands = Number(formData.get('hands'))
		const discards = Number(formData.get('discards'))
		const money = Number(formData.get('money'))
		const blindName = formData.get('blindName') as BlindName
		const blindIsActive = formData.get('blindIsActive') === 'is-active'
		const deck = formData.get('deck') as DeckName
		const jokerSlots = Number(formData.get('jokerSlots'))
		const observatoryHands: Required<InitialState>['observatoryHands'] = formData
			.getAll('observatory')
			.map((planet) => PLANET_TO_HAND_MAP[planet as PlanetName])

		const initialState: Required<InitialState> = {
			hands,
			discards,
			money,
			blind: {
				name: blindName,
				active: blindIsActive,
			},
			deck,
			observatoryHands,
			handLevels: {},
			jokers: [],
			jokerSlots,
			cards: [],
		}

		for (const handLevel of this.#handLevelContainer.children) {
			if (!(handLevel instanceof HandLevel)) continue

			initialState.handLevels[handLevel.handName] = {
				level: handLevel.level,
				plays: handLevel.plays,
			}
		}

		for (const jokerCard of this.#jokerContainer.children) {
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
			})
		}

		for (const cardEl of this.#playingCardContainer.children) {
			if (!(cardEl instanceof PlayingCard)) continue

			initialState.cards.push({
				rank: cardEl.rank,
				suit: cardEl.suit,
				edition: cardEl.edition,
				enhancement: cardEl.enhancement,
				seal: cardEl.seal,
				debuffed: cardEl.debuffed,
				played: cardEl.played,
			})
		}

		return getState(initialState)
	}

	/**
	 * Populates the UI using a `State` object. Tries to retrieve this object from the URL or local storage.
	 */
	#populateUiWithState (state: State) {
		this.#handsInput.value = String(state.hands)
		this.#discardsInput.value = String(state.discards)
		this.#moneyInput.value = String(state.money)
		this.#blindNameSelect.value = state.blind.name
		this.#blindIsActiveCheckbox.checked = state.blind.active
		this.#deckSelect.value = state.deck
		this.#jokerSlotsInput.value = String(state.jokerSlots)

		for (const checkbox of this.#observatoryCheckboxes) {
			if (state.observatoryHands.includes(PLANET_TO_HAND_MAP[checkbox.value as PlanetName])) {
				checkbox.checked = true
			}
		}

		this.#handLevelContainer.innerHTML = ''
		for (const [handName, handLevel] of Object.entries(state.handLevels)) {
			this.#addHandLevel(handName as HandName, handLevel)
		}

		this.#jokerContainer.innerHTML = ''
		for (const joker of state.jokers) {
			this.#addJoker(joker)
		}

		this.#playingCardContainer.innerHTML = ''
		for (const card of state.cards) {
			this.#addCard(card)
		}

		this.#applyState(state)
	}

	#addJoker (joker?: Joker) {
		this.#jokerContainer.insertAdjacentHTML('beforeend', '<joker-card></joker-card>')
		const jokerEl = this.#jokerContainer.lastElementChild
		if (jokerEl instanceof JokerCard) {
			if (joker) {
				jokerEl.setJoker(joker)
			}

			jokerEl.updateState()
		}
	}

	#addCard (card?: Card) {
		this.#playingCardContainer.insertAdjacentHTML('beforeend', '<playing-card></playing-card>')
		const el = this.#playingCardContainer.lastElementChild
		if (el instanceof PlayingCard) {
			if (card) {
				el.setCard(card)
			}

			el.updateState()
		}
	}

	#duplicate (event: Event) {
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
				copy.updateState()
			}
		}

		dialog.close()
		this.#calculate()
	}

	#addHandLevel (handName: HandName, handLevel: { level: number, plays: number }) {
		this.#handLevelContainer.insertAdjacentHTML('beforeend', '<hand-level></hand-level>')
		const el = this.#handLevelContainer.lastElementChild
		if (el instanceof HandLevel) {
			el.setHandLevel(handName, handLevel)
		}
	}
}
