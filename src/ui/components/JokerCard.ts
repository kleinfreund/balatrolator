import { uniqueId } from '#ui/uniqueId.ts'
import { JOKER_DEFINITIONS } from '#lib/data.ts'
import { notNullish } from '#utilities/notNullish.ts'
import { DraggableCard } from './DraggableCard.ts'
import type { Joker, JokerEdition, JokerName, Rank, Suit } from '#lib/types.ts'

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
	nameInput: HTMLInputElement
	countInput: HTMLInputElement
	editionInput: HTMLInputElement
	plusChipsInput: HTMLInputElement
	plusMultiplierInput: HTMLInputElement
	timesMultiplierInput: HTMLInputElement
	activeCheckbox: HTMLInputElement
	rankInput: HTMLInputElement
	suitInput: HTMLInputElement

	constructor () {
		super()

		const template = document.querySelector<HTMLTemplateElement>('template#joker-card')!
		this.fragment = template.content.cloneNode(true) as Element
		const id = uniqueId()
		this.id = `joker-card-${id}`
		this.classList.add('card', 'joker-card')
		this.draggable = true

		this.removeButton = this.fragment.querySelector<HTMLButtonElement>('[data-remove-button]')!
		this.removeButton.addEventListener('click', () => this.remove())

		this.showDuplicateModalButton = this.fragment.querySelector<HTMLButtonElement>('[popovertarget="j-duplicate-modal"]')!
		this.showDuplicateModalButton.addEventListener('click', this.showDuplicateModal)

		this.nameInput = this.fragment.querySelector<HTMLInputElement>('[data-j-name]')!
		this.nameInput.name = `joker-name-${id}`
		this.nameInput.addEventListener('change', () => {
			const nameOption = document.querySelector(`datalist#joker-options option[value="${this.jokerName}"]`)
			this.nameInput.setCustomValidity(nameOption ? '' : `“${this.jokerName}” is not a Joker.`)
			this.nameInput.reportValidity()
		})

		this.countInput = this.fragment.querySelector<HTMLInputElement>('[data-j-count]')!
		this.countInput.name = `joker-count-${id}`

		this.editionInput = this.fragment.querySelector<HTMLInputElement>('[data-j-edition]')!
		this.editionInput.name = `joker-edition-${id}`
		this.editionInput.addEventListener('change', () => {
			const editionOption = document.querySelector(`datalist#joker-edition-options option[value="${this.edition}"]`)
			this.editionInput.setCustomValidity(editionOption ? '' : `“${this.edition}” is not an edition.`)
			this.editionInput.reportValidity()
		})

		this.plusChipsInput = this.fragment.querySelector<HTMLInputElement>('[data-j-plus-chips]')!
		this.plusChipsInput.name = `joker-plusChips-${id}`

		this.plusMultiplierInput = this.fragment.querySelector<HTMLInputElement>('[data-j-plus-multiplier]')!
		this.plusMultiplierInput.name = `joker-plusMultiplier-${id}`

		this.timesMultiplierInput = this.fragment.querySelector<HTMLInputElement>('[data-j-times-multiplier]')!
		this.timesMultiplierInput.name = `joker-timesMultiplier-${id}`

		this.activeCheckbox = this.fragment.querySelector<HTMLInputElement>('[data-j-is-active]')!
		this.activeCheckbox.name = `joker-active-${id}`

		this.rankInput = this.fragment.querySelector<HTMLInputElement>('[data-j-rank]')!
		this.rankInput.name = `joker-rank-${id}`
		this.rankInput.addEventListener('change', () => {
			const rankOption = document.querySelector(`datalist#rank-options option[value="${this.rank}"]`)
			this.rankInput.setCustomValidity(rankOption ? '' : `“${this.rank}” is not a rank.`)
			this.rankInput.reportValidity()
		})

		this.suitInput = this.fragment.querySelector<HTMLInputElement>('[data-j-suit]')!
		this.suitInput.name = `joker-suit-${id}`
		this.suitInput.addEventListener('change', () => {
			const suitOption = document.querySelector(`datalist#suit-options option[value="${this.suit}"]`)
			this.suitInput.setCustomValidity(suitOption ? '' : `“${this.suit}” is not a suit.`)
			this.suitInput.reportValidity()
		})
	}

	get [Symbol.toStringTag] () {
		return this.tagName
	}

	get #definition () {
		return JOKER_DEFINITIONS[this.jokerName]
	}

	get jokerName () {
		return this.nameInput.value as JokerName
	}

	get rarity () {
		return this.#definition.rarity
	}

	get edition () {
		return this.editionInput.value as JokerEdition
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
		return this.rankInput.value as Rank
	}

	get suit () {
		return this.suitInput.value as Suit
	}

	get active () {
		return this.activeCheckbox.checked
	}

	get count () {
		return Number(this.countInput.value)
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

	get joker (): Joker {
		if (this.#joker) {
			return this.#joker
		}

		const index = this.parentElement!.children.length
		const rarity = this.rarity
		const name = this.jokerName
		const edition = this.edition
		const plusChips = this.plusChips
		const plusMultiplier = this.plusMultiplier
		const timesMultiplier = this.timesMultiplier
		const active = this.active
		const count = this.count
		const rank = this.rank
		const suit = this.suit

		return {
			index,
			rarity,
			name,
			edition,
			plusChips,
			plusMultiplier,
			timesMultiplier,
			active,
			count,
			rank,
			suit,
		}
	}

	setJoker (joker?: Joker) {
		this.#joker = joker ?? this.joker

		const {
			name,
			edition,
			plusChips,
			plusMultiplier,
			timesMultiplier,
			active,
			rank,
			suit,
			count,
		} = this.#joker

		this.nameInput.value = name
		this.countInput.value = String(count)
		this.editionInput.value = edition
		if (this.#definition.hasPlusChipsInput) this.plusChipsInput.value = String(plusChips)
		if (this.#definition.hasPlusMultiplierInput) this.plusMultiplierInput.value = String(plusMultiplier)
		if (this.#definition.hasTimesMultiplierInput) this.timesMultiplierInput.value = String(timesMultiplier)
		if (this.#definition.hasIsActiveInput) this.activeCheckbox.checked = Boolean(active)
		if (this.#definition.hasRankInput && rank) this.rankInput.value = String(rank)
		if (this.#definition.hasSuitInput && suit) this.suitInput.value = String(suit)
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

		clone.nameInput.value = this.nameInput.value
		clone.countInput.value = this.countInput.value
		clone.editionInput.value = this.editionInput.value
		clone.plusChipsInput.value = this.plusChipsInput.value
		clone.plusMultiplierInput.value = this.plusMultiplierInput.value
		clone.timesMultiplierInput.value = this.timesMultiplierInput.value
		clone.activeCheckbox.checked = this.activeCheckbox.checked
		clone.rankInput.value = this.rankInput.value
		clone.suitInput.value = this.suitInput.value

		return clone
	}
}
