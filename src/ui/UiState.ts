import type { BlindName, Card, DeckName, Edition, Enhancement, HandName, InitialState, Joker, JokerEdition, JokerName, Rank, Seal, State, Suit } from '#lib/types.js'
import { notNullish } from '#utilities/notNullish.js'
import { JOKER_DEFINITIONS } from '#lib/data.js'
import { log } from '#utilities/log.js'
import { calculateScore } from '#lib/balatro.js'

export class UiState {
	handsInput: HTMLInputElement
	discardsInput: HTMLInputElement
	moneyInput: HTMLInputElement
	blindNameSelect: HTMLSelectElement
	blindIsActiveCheckbox: HTMLInputElement
	deckSelect: HTMLSelectElement
	jokerSlotsInput: HTMLInputElement

	handsContainer: HTMLElement

	jokerContainer: HTMLElement
	addJokerButton: HTMLButtonElement
	jokerTemplate: HTMLTemplateElement

	cardContainer: HTMLElement
	addCardButton: HTMLButtonElement
	cardTemplate: HTMLTemplateElement

	formattedScoreEl: HTMLElement
	scoreEl: HTMLElement

	constructor (form: HTMLFormElement) {
		this.handsInput = form.querySelector('[data-r-hands]') as HTMLInputElement
		this.discardsInput = form.querySelector('[data-r-discards]') as HTMLInputElement
		this.moneyInput = form.querySelector('[data-r-money]') as HTMLInputElement
		this.blindNameSelect = form.querySelector('[data-r-blind-name]') as HTMLSelectElement
		this.blindIsActiveCheckbox = form.querySelector('[data-r-blind-is-active]') as HTMLInputElement
		this.deckSelect = form.querySelector('[data-r-deck]') as HTMLSelectElement
		this.jokerSlotsInput = form.querySelector('[data-r-joker-slots]') as HTMLInputElement

		this.handsContainer = form.querySelector('[data-h-container]') as HTMLElement

		this.jokerContainer = form.querySelector('[data-j-container]') as HTMLElement
		this.jokerContainer.addEventListener('dragenter', handleDragOver)
		this.jokerContainer.addEventListener('dragover', handleDragOver)
		this.addJokerButton = form.querySelector('[data-j-add-button]') as HTMLButtonElement
		this.addJokerButton.addEventListener('click', () => this.addJoker())
		this.jokerTemplate = document.querySelector('template#joker') as HTMLTemplateElement

		this.cardContainer = form.querySelector('[data-c-container]') as HTMLElement
		this.cardContainer.addEventListener('dragenter', handleDragOver)
		this.cardContainer.addEventListener('dragover', handleDragOver)
		this.addCardButton = form.querySelector('[data-c-add-button]') as HTMLButtonElement
		this.addCardButton.addEventListener('click', () => this.addCard())
		this.cardTemplate = document.querySelector('template#card') as HTMLTemplateElement

		this.formattedScoreEl = form.querySelector('[data-formatted-score]') as HTMLElement
		this.scoreEl = form.querySelector('[data-score]') as HTMLElement

		// Quick and dirty way to update the state whenever necessary
		form.addEventListener('change', () => {
			for (const cardEl of this.cardContainer.children) {
				this.updateCardState(cardEl)
			}

			for (const jokerEl of this.jokerContainer.children) {
				this.updateJokerState(jokerEl)
			}
		})
	}

	updateScore (initialState: InitialState) {
		const score = calculateScore(initialState)
		log(score)

		this.formattedScoreEl.textContent = score.formattedScore
		this.scoreEl.textContent = new Intl.NumberFormat('en').format(score.score)
	}

	/**
	 * Assembles an `InitialState` object from the various form elements in the UI.
	 *
	 * Inverse operation of `populateUiWithState`
	 */
	readStateFromUi (): InitialState {
		const hands = Number(this.handsInput.value)
		const discards = Number(this.discardsInput.value)
		const money = Number(this.moneyInput.value)
		const blindName = this.blindNameSelect.value as BlindName
		const blindIsActive = this.blindIsActiveCheckbox.checked
		const deck = this.deckSelect.value as DeckName
		const jokerSlots = Number(this.jokerSlotsInput.value)

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

		for (const hand of this.handsContainer.children) {
			const nameEl = hand.querySelector('[data-h-name]') as HTMLElement
			const levelEl = hand.querySelector('[data-h-level]') as HTMLInputElement
			const playsEl = hand.querySelector('[data-h-plays]') as HTMLInputElement

			const name = nameEl.textContent as HandName
			const level = Number(levelEl.value)
			const plays = Number(playsEl.value)

			initialState.handLevels[name] = { level, plays }
		}

		for (const joker of this.jokerContainer.children) {
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

		for (const cardEl of this.cardContainer.children) {
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
	populateUiWithState (state: State) {
		this.handsInput.value = String(state.hands)
		this.discardsInput.value = String(state.discards)
		this.moneyInput.value = String(state.money)
		this.blindNameSelect.value = state.blind.name
		this.blindIsActiveCheckbox.checked = state.blind.isActive
		this.deckSelect.value = state.deck
		this.jokerSlotsInput.value = String(state.jokerSlots)

		for (const hand of this.handsContainer.children) {
			const nameEl = hand.querySelector('[data-h-name]') as HTMLElement
			const levelEl = hand.querySelector('[data-h-level]') as HTMLInputElement
			const playsEl = hand.querySelector('[data-h-plays]') as HTMLInputElement

			const name = nameEl.textContent as HandName
			const { level, plays } = state.handLevels[name]

			levelEl.value = String(level)
			playsEl.value = String(plays)
		}

		this.jokerContainer.innerHTML = ''
		for (const joker of state.jokers) {
			this.addJoker(joker)
		}

		this.cardContainer.innerHTML = ''
		for (const card of state.playedCards) {
			this.addCard(card, true)
		}

		for (const card of state.heldCards) {
			this.addCard(card, false)
		}
	}

	addJoker (joker?: Joker) {
		const template = this.jokerTemplate.content.cloneNode(true) as HTMLElement
		const jokerEl = template.querySelector('[data-joker]') as HTMLElement
		const index = this.jokerContainer.children.length

		const nameSelect = jokerEl.querySelector('[data-j-name]') as HTMLSelectElement
		const editionSelect = jokerEl.querySelector('[data-j-edition]') as HTMLSelectElement
		const plusChipsInput = jokerEl.querySelector('[data-j-plus-chips]') as HTMLInputElement
		const plusMultiplierInput = jokerEl.querySelector('[data-j-plus-multiplier]') as HTMLInputElement
		const timesMultiplierInput = jokerEl.querySelector('[data-j-times-multiplier]') as HTMLInputElement
		const isActiveCheckbox = jokerEl.querySelector('[data-j-is-active]') as HTMLInputElement
		const rankSelect = jokerEl.querySelector('[data-j-rank]') as HTMLSelectElement
		const suitSelect = jokerEl.querySelector('[data-j-suit]') as HTMLSelectElement

		nameSelect.name = `joker-name-${index}`
		editionSelect.name = `joker-edition-${index}`
		plusChipsInput.name = `joker-plusChips-${index}`
		plusMultiplierInput.name = `joker-plusMultiplier-${index}`
		timesMultiplierInput.name = `joker-timesMultiplier-${index}`
		isActiveCheckbox.name = `joker-isActive-${index}`
		rankSelect.name = `joker-rank-${index}`
		suitSelect.name = `joker-suit-${index}`

		jokerEl.addEventListener('dragstart', handleDragStart)
		jokerEl.addEventListener('dragend', handleDragEnd)

		const removeButton = jokerEl.querySelector('[data-remove-button]') as HTMLButtonElement
		removeButton.addEventListener('click', this.handleRemoveJokerClick)

		const moveLeftButton = jokerEl.querySelector('[data-move-left-button]') as HTMLButtonElement
		moveLeftButton.addEventListener('click', this.handleMoveJokerLeftClick)

		const moveRightButton = jokerEl.querySelector('[data-move-right-button]') as HTMLButtonElement
		moveRightButton.addEventListener('click', this.handleMoveJokerRightClick)

		if (joker) {
			const {
				name,
				edition,
				plusChips,
				plusMultiplier,
				timesMultiplier,
				isActive,
				rank,
				suit,
			} = joker
			const definition = JOKER_DEFINITIONS[name]

			nameSelect.value = name
			editionSelect.value = edition
			if (definition.hasPlusChipsInput) plusChipsInput.value = String(plusChips)
			if (definition.hasPlusMultiplierInput) plusMultiplierInput.value = String(plusMultiplier)
			if (definition.hasTimesMultiplierInput) timesMultiplierInput.value = String(timesMultiplier)
			if (definition.hasIsActiveInput) isActiveCheckbox.checked = Boolean(isActive)
			if (definition.hasRankInput) rankSelect.value = String(rank)
			if (definition.hasSuitInput) suitSelect.value = String(suit)
		}

		this.jokerContainer.appendChild(template)

		setButtonDisabledStates(this.jokerContainer)
		this.updateJokerState(jokerEl)
	}

	updateJokerState (el: Element) {
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

	addCard (card?: Card, isPlayed?: boolean) {
		const template = this.cardTemplate.content.cloneNode(true) as HTMLElement
		const cardEl = template.querySelector('[data-playing-card]') as HTMLElement
		const index = this.cardContainer.children.length

		const isPlayedCheckbox = cardEl.querySelector('[data-c-is-played]') as HTMLInputElement
		const isDebuffedCheckbox = cardEl.querySelector('[data-c-is-debuffed]') as HTMLInputElement
		const rankSelect = cardEl.querySelector('[data-c-rank]') as HTMLSelectElement
		const suitSelect = cardEl.querySelector('[data-c-suit]') as HTMLSelectElement
		const editionSelect = cardEl.querySelector('[data-c-edition]') as HTMLSelectElement
		const enhancementSelect = cardEl.querySelector('[data-c-enhancement]') as HTMLSelectElement
		const sealSelect = cardEl.querySelector('[data-c-seal]') as HTMLSelectElement

		isPlayedCheckbox.name = `card-is-played-${index}`
		isDebuffedCheckbox.name = `card-is-debuffed-${index}`
		rankSelect.name = `card-rank-${index}`
		suitSelect.name = `card-suit-${index}`
		editionSelect.name = `card-edition-${index}`
		enhancementSelect.name = `card-enhancement-${index}`
		sealSelect.name = `card-seal-${index}`

		cardEl.addEventListener('click', function (event) {
			if (event.currentTarget && !isInteractive(event)) {
				isPlayedCheckbox.click()
			}
		}, { capture: true })
		cardEl.addEventListener('dragstart', handleDragStart)
		cardEl.addEventListener('dragend', handleDragEnd)

		const removeButton = cardEl.querySelector('[data-remove-button]') as HTMLButtonElement
		removeButton.addEventListener('click', this.handleRemoveCardClick)

		const moveLeftButton = cardEl.querySelector('[data-move-left-button]') as HTMLButtonElement
		moveLeftButton.addEventListener('click', this.handleMoveCardLeftClick)

		const moveRightButton = cardEl.querySelector('[data-move-right-button]') as HTMLButtonElement
		moveRightButton.addEventListener('click', this.handleMoveCardRightClick)

		if (card) {
			const {
				rank,
				suit,
				edition,
				enhancement,
				seal,
				isDebuffed,
			} = card

			isPlayedCheckbox.checked = Boolean(isPlayed)
			isDebuffedCheckbox.checked = isDebuffed
			rankSelect.value = rank
			suitSelect.value = suit
			editionSelect.value = edition
			enhancementSelect.value = enhancement
			sealSelect.value = seal
		}

		this.cardContainer.appendChild(template)

		setButtonDisabledStates(this.cardContainer)
		this.updateCardState(cardEl)
	}

	updateCardState (el: Element) {
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
			this.blindNameSelect.value === 'The Pillar' && this.blindIsActiveCheckbox.checked ? '--is-blind-the-pillar' : undefined,
		].filter(notNullish).forEach((className) => el.classList.add(className))
	}

	handleRemoveJokerClick = (event: Event) => {
		if (event.currentTarget instanceof HTMLElement) {
			event.currentTarget.closest('[data-joker]')!.remove()
		}
	}

	handleMoveJokerLeftClick = (event: Event) => {
		if (event.currentTarget instanceof HTMLElement) {
			move(this.jokerContainer, event.currentTarget.closest('[data-joker]')!, -1)
		}
	}

	handleMoveJokerRightClick = (event: Event) => {
		if (event.currentTarget instanceof HTMLElement) {
			move(this.jokerContainer, event.currentTarget.closest('[data-joker]')!, 1)
		}
	}

	handleRemoveCardClick = (event: Event) => {
		if (event.currentTarget instanceof HTMLElement) {
			event.currentTarget.closest('[data-playing-card]')!.remove()
		}
	}

	handleMoveCardLeftClick = (event: Event) => {
		if (event.currentTarget instanceof HTMLElement) {
			move(this.cardContainer, event.currentTarget.closest('[data-playing-card]')!, -1)
		}
	}

	handleMoveCardRightClick = (event: Event) => {
		if (event.currentTarget instanceof HTMLElement) {
			move(this.cardContainer, event.currentTarget.closest('[data-playing-card]')!, 1)
		}
	}
}

function move (container: Element, currentEl: Element, direction: 1 | -1) {
	const index = Array.from(container.children).findIndex((el) => el === currentEl)

	if (direction === -1 ? index === 0 : index === (container.children.length - 1)) {
		return
	}

	const otherEl = container.children[index + direction]!

	if (direction === -1) {
		otherEl.insertAdjacentElement('beforebegin', currentEl)
	} else {
		currentEl.insertAdjacentElement('beforebegin', otherEl)
	}

	setButtonDisabledStates(container)
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

function setButtonDisabledStates (container: Element) {
	for (const el of container.children) {
		const moveLeftButton = el.querySelector('[data-move-left-button]') as HTMLButtonElement
		moveLeftButton.disabled = el === container.children[0]

		const moveRightButton = el.querySelector('[data-move-right-button]') as HTMLButtonElement
		moveRightButton.disabled = el === container.children[container.children.length - 1]
	}
}

function handleDragStart (event: DragEvent) {
	if (event.dataTransfer === null || !(event.target instanceof Element)) {
		return
	}

	const container = event.target.closest('[data-drop-zone]')
	if (container) {
		const draggedElIndex = Array.from(container.children).findIndex((el) => el === event.target)
		if (draggedElIndex !== -1) {
			event.dataTransfer.effectAllowed = 'move'
			event.dataTransfer.dropEffect = 'move'
			event.dataTransfer.setData('text/plain', String(draggedElIndex))
		}
	}
}

function handleDragEnd (event: DragEvent) {
	const data = getDragEventData(event)
	if (data) {
		drop(data.container, data.draggedEl, event.clientX)
	}
}

function handleDragOver (event: DragEvent) {
	if (getDragEventData(event)) {
		event.preventDefault()
	}
}

function getDragEventData (event: DragEvent): { container: Element, draggedEl: Element } | null {
	if (event.dataTransfer === null || !(event.target instanceof Element)) {
		return null
	}

	const container = event.target.closest('[data-drop-zone]')
	if (container) {
		const draggedElIndex = Number(event.dataTransfer.getData('text/plain'))
		if (!Number.isNaN(draggedElIndex)) {
			const draggedEl = container.children[draggedElIndex]

			if (draggedEl) {
				return { container, draggedEl }
			}
		}
	}

	return null
}

function drop (container: Element, draggedEl: Element, dragClientX: number) {
	// Determining the insertion coordinate for the element …
	const containerRect = container.getBoundingClientRect()
	// The drop target X coordinate relative to the container.
	const dropTargetX = dragClientX - containerRect.left

	for (const el of container.children) {
		const { left, width } = el.getBoundingClientRect()
		// The element's X coordinate relative to the container.
		const elStartX = left - containerRect.left
		// The element's halfway point X coordinate relative the container.
		const halfwayPointX = elStartX + width / 2

		if (dropTargetX < halfwayPointX) {
			el.insertAdjacentElement('beforebegin', draggedEl)
			return
		}
	}

	container.insertAdjacentElement('beforeend', draggedEl)
}
