import { DraggableCard } from './DraggableCard.js'
import { uniqueId } from '#utilities/uniqueId.js'
import { notNullish } from '#utilities/notNullish.js'
import type { Card, Edition, Enhancement, Rank, Seal, Suit } from '#lib/types.js'

export class PlayingCard extends DraggableCard {
	static {
		if (window.customElements.get('playing-card') === undefined) {
			window.customElements.define('playing-card', PlayingCard)
		}
	}

	#card: Card | undefined
	hasRendered = false
	fragment: Element
	showDuplicateModalButton: HTMLButtonElement
	removeButton: HTMLButtonElement
	playedCheckbox: HTMLInputElement
	debuffedCheckbox: HTMLInputElement
	rankSelect: HTMLSelectElement
	suitSelect: HTMLSelectElement
	editionSelect: HTMLSelectElement
	enhancementSelect: HTMLSelectElement
	sealSelect: HTMLSelectElement

	constructor () {
		super()

		const template = document.querySelector<HTMLTemplateElement>('template#playing-card')!
		this.fragment = template.content.cloneNode(true) as Element
		const id = uniqueId()
		this.id = `playing-card-${id}`
		this.classList.add('card', 'playing-card')
		this.draggable = true

		this.removeButton = this.fragment.querySelector<HTMLButtonElement>('[data-remove-button]')!
		this.removeButton.addEventListener('click', () => this.remove())

		this.showDuplicateModalButton = this.fragment.querySelector<HTMLButtonElement>('[popovertarget="c-duplicate-modal"]')!
		this.showDuplicateModalButton.addEventListener('click', this.showDuplicateModal)

		this.playedCheckbox = this.fragment.querySelector<HTMLInputElement>('[data-c-is-played]')!
		this.playedCheckbox.name = `card-is-played-${id}`

		this.debuffedCheckbox = this.fragment.querySelector<HTMLInputElement>('[data-c-is-debuffed]')!
		this.debuffedCheckbox.name = `card-is-debuffed-${id}`

		this.rankSelect = this.fragment.querySelector<HTMLSelectElement>('[data-c-rank]')!
		this.rankSelect.name = `card-rank-${id}`

		this.suitSelect = this.fragment.querySelector<HTMLSelectElement>('[data-c-suit]')!
		this.suitSelect.name = `card-suit-${id}`

		this.editionSelect = this.fragment.querySelector<HTMLSelectElement>('[data-c-edition]')!
		this.editionSelect.name = `card-edition-${id}`

		this.enhancementSelect = this.fragment.querySelector<HTMLSelectElement>('[data-c-enhancement]')!
		this.enhancementSelect.name = `card-enhancement-${id}`

		this.sealSelect = this.fragment.querySelector<HTMLSelectElement>('[data-c-seal]')!
		this.sealSelect.name = `card-seal-${id}`

		this.addEventListener('click', (event) => {
			if (event.currentTarget && !isInteractive(event)) {
				this.playedCheckbox.click()
			}
		}, { capture: true })
	}

	get [Symbol.toStringTag] () {
		return this.tagName
	}

	get rank () {
		return this.rankSelect.value as Rank
	}

	get suit () {
		return this.suitSelect.value as Suit
	}

	get edition () {
		return this.editionSelect.value as Edition
	}

	get enhancement () {
		return this.enhancementSelect.value as Enhancement
	}

	get seal () {
		return this.sealSelect.value as Seal
	}

	get played () {
		return this.playedCheckbox.checked
	}

	get debuffed () {
		return this.debuffedCheckbox.checked
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

	setCard (card: Card) {
		this.#card = card

		const {
			rank,
			suit,
			edition,
			enhancement,
			seal,
			debuffed,
			played,
		} = card

		this.playedCheckbox.checked = Boolean(played)
		this.debuffedCheckbox.checked = debuffed
		this.rankSelect.value = rank
		this.suitSelect.value = suit
		this.editionSelect.value = edition
		this.enhancementSelect.value = enhancement
		this.sealSelect.value = seal
	}

	updateState () {
		this.classList.remove(
			'--is-played',
			'--is-debuffed',
			'--is-blind-the-pillar',
		)

		// This is shitty. Make it better. I shouldn't be querying unrelated DOM elements here.
		const blindNameSelect = this.ownerDocument.querySelector('[data-r-blind-name]') as HTMLSelectElement
		const blindIsActiveCheckbox = this.ownerDocument.querySelector('[data-r-blind-is-active]') as HTMLInputElement

		;[
			this.playedCheckbox.checked ? '--is-played' : null,
			this.debuffedCheckbox.checked ? '--is-debuffed' : null,
			blindNameSelect.value === 'The Pillar' && blindIsActiveCheckbox.checked ? '--is-blind-the-pillar' : undefined,
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
		if (this.#card === undefined) {
			throw new Error(`<${this.tagName.toLowerCase()} id="${this.id}">: is missing internal data!`)
		}

		const clone = this.cloneNode(true) as PlayingCard
		clone.setCard(this.#card)

		clone.playedCheckbox.checked = this.playedCheckbox.checked
		clone.debuffedCheckbox.checked = this.debuffedCheckbox.checked
		clone.rankSelect.value = this.rankSelect.value
		clone.suitSelect.value = this.suitSelect.value
		clone.editionSelect.value = this.editionSelect.value
		clone.enhancementSelect.value = this.enhancementSelect.value
		clone.sealSelect.value = this.sealSelect.value

		return clone
	}
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
