import { DraggableCard } from './DraggableCard.js'
import { uniqueId } from '#utilities/uniqueId.js'
import { JOKER_DEFINITIONS } from '#lib/data.js'
import { notNullish } from '#utilities/notNullish.js'
import type { Joker, JokerEdition, JokerName, Rank, Suit } from '#lib/types.js'

export class JokerCard extends DraggableCard {
	static {
		if (window.customElements.get('joker-card') === undefined) {
			window.customElements.define('joker-card', JokerCard)
		}
	}

	#joker: Joker | undefined
	hasRendered = false
	fragment: Element
	showDuplicateModalButton: HTMLButtonElement
	removeButton: HTMLButtonElement
	nameSelect: HTMLSelectElement
	editionSelect: HTMLSelectElement
	plusChipsInput: HTMLInputElement
	plusMultiplierInput: HTMLInputElement
	timesMultiplierInput: HTMLInputElement
	isActiveCheckbox: HTMLInputElement
	rankSelect: HTMLSelectElement
	suitSelect: HTMLSelectElement

	constructor () {
		super()

		const template = document.querySelector('template#joker-card') as HTMLTemplateElement
		this.fragment = template.content.cloneNode(true) as Element
		const id = uniqueId()
		this.id = `joker-card-${id}`
		this.classList.add('card', 'joker-card')
		this.draggable = true

		this.removeButton = this.fragment.querySelector('[data-remove-button]') as HTMLButtonElement
		this.removeButton.addEventListener('click', () => this.remove())

		this.showDuplicateModalButton = this.fragment.querySelector('[popovertarget="j-duplicate-modal"]') as HTMLButtonElement
		this.showDuplicateModalButton.addEventListener('click', this.showDuplicateModal)

		this.nameSelect = this.fragment.querySelector('[data-j-name]') as HTMLSelectElement
		this.nameSelect.name = `joker-name-${id}`

		this.editionSelect = this.fragment.querySelector('[data-j-edition]') as HTMLSelectElement
		this.editionSelect.name = `joker-edition-${id}`

		this.plusChipsInput = this.fragment.querySelector('[data-j-plus-chips]') as HTMLInputElement
		this.plusChipsInput.name = `joker-plusChips-${id}`

		this.plusMultiplierInput = this.fragment.querySelector('[data-j-plus-multiplier]') as HTMLInputElement
		this.plusMultiplierInput.name = `joker-plusMultiplier-${id}`

		this.timesMultiplierInput = this.fragment.querySelector('[data-j-times-multiplier]') as HTMLInputElement
		this.timesMultiplierInput.name = `joker-timesMultiplier-${id}`

		this.isActiveCheckbox = this.fragment.querySelector('[data-j-is-active]') as HTMLInputElement
		this.isActiveCheckbox.name = `joker-isActive-${id}`

		this.rankSelect = this.fragment.querySelector('[data-j-rank]') as HTMLSelectElement
		this.rankSelect.name = `joker-rank-${id}`

		this.suitSelect = this.fragment.querySelector('[data-j-suit]') as HTMLSelectElement
		this.suitSelect.name = `joker-suit-${id}`
	}

	get [Symbol.toStringTag] () {
		return this.tagName
	}

	get #definition () {
		return JOKER_DEFINITIONS[this.jokerName]
	}

	get jokerName () {
		return this.nameSelect.value as JokerName
	}

	get edition () {
		return this.editionSelect.value as JokerEdition
	}

	get plusChips () {
		return Number(this.plusChipsInput.value)
	}

	get plusMultiplier () {
		return Number(this.plusMultiplierInput.value)
	}

	get timesMultiplier () {
		return Number(this.timesMultiplierInput.value)
	}

	get rank () {
		return this.#definition.hasRankInput ? this.rankSelect.value as Rank : undefined
	}

	get suit () {
		return this.#definition.hasSuitInput ? this.suitSelect.value as Suit : undefined
	}

	get isActive () {
		return this.isActiveCheckbox.checked
	}

	connectedCallback () {
		super.connectedCallback()

		if (!this.isConnected) {
			return
		}

		// Prevent re-rendering when moving the element around with the drag'n'drop API
		if (!this.hasRendered) {
			this.render()
		}
	}

	render () {
		this.innerHTML = ''
		this.appendChild(this.fragment)
		this.hasRendered = true
	}

	setJoker (joker: Joker) {
		this.#joker = joker

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

		this.nameSelect.value = name
		this.editionSelect.value = edition
		if (this.#definition.hasPlusChipsInput) this.plusChipsInput.value = String(plusChips)
		if (this.#definition.hasPlusMultiplierInput) this.plusMultiplierInput.value = String(plusMultiplier)
		if (this.#definition.hasTimesMultiplierInput) this.timesMultiplierInput.value = String(timesMultiplier)
		if (this.#definition.hasIsActiveInput) this.isActiveCheckbox.checked = Boolean(isActive)
		if (this.#definition.hasRankInput && rank) this.rankSelect.value = String(rank)
		if (this.#definition.hasSuitInput && suit) this.suitSelect.value = String(suit)
	}

	updateState () {
		this.classList.remove(
			'--has-plus-chips',
			'--has-plus-multiplier',
			'--has-times-multiplier',
			'--has-is-active',
			'--has-rank',
			'--has-suit',
		)

		;[
			this.#definition.hasPlusChipsInput ? '--has-plus-chips' : null,
			this.#definition.hasPlusMultiplierInput ? '--has-plus-multiplier': null,
			this.#definition.hasTimesMultiplierInput ? '--has-times-multiplier': null,
			this.#definition.hasIsActiveInput ? '--has-is-active': null,
			this.#definition.hasRankInput ? '--has-rank': null,
			this.#definition.hasSuitInput ? '--has-suit': null,
		].filter(notNullish).forEach((className) => this.classList.add(className))
	}

	showDuplicateModal = (event: Event) => {
		const button = event.currentTarget as HTMLButtonElement
		const dialog = document.querySelector(`dialog[id="${button.getAttribute('popovertarget')}"]`)
		if (dialog instanceof HTMLDialogElement) {
			dialog.setAttribute('data-duplicate-target-id', this.id)
			dialog.showModal()
		}
	}

	clone () {
		if (this.#joker === undefined) {
			throw new Error(`<${this.tagName.toLowerCase()} id="${this.id}">: is missing internal data!`)
		}

		const clone = this.cloneNode(true) as JokerCard
		clone.setJoker(this.#joker)

		clone.nameSelect.value = this.nameSelect.value
		clone.editionSelect.value = this.editionSelect.value
		clone.plusChipsInput.value = this.plusChipsInput.value
		clone.plusMultiplierInput.value = this.plusMultiplierInput.value
		clone.timesMultiplierInput.value = this.timesMultiplierInput.value
		clone.isActiveCheckbox.checked = this.isActiveCheckbox.checked
		clone.rankSelect.value = this.rankSelect.value
		clone.suitSelect.value = this.suitSelect.value

		return clone
	}
}
