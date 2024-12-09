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

	hasRendered = false
	fragment: Element
	removeButton: HTMLButtonElement
	isPlayedCheckbox: HTMLInputElement
	isDebuffedCheckbox: HTMLInputElement
	rankSelect: HTMLSelectElement
	suitSelect: HTMLSelectElement
	editionSelect: HTMLSelectElement
	enhancementSelect: HTMLSelectElement
	sealSelect: HTMLSelectElement

	constructor () {
		super()

		const template = document.querySelector('template#playing-card') as HTMLTemplateElement
		this.fragment = template.content.cloneNode(true) as Element
		const id = uniqueId()
		this.id = `playing-card-${id}`
		this.classList.add('card', 'playing-card')
		this.draggable = true

		this.removeButton = this.fragment.querySelector('[data-remove-button]') as HTMLButtonElement
		this.removeButton.addEventListener('click', () => this.remove())

		this.isPlayedCheckbox = this.fragment.querySelector('[data-c-is-played]') as HTMLInputElement
		this.isPlayedCheckbox.name = `card-is-played-${id}`

		this.isDebuffedCheckbox = this.fragment.querySelector('[data-c-is-debuffed]') as HTMLInputElement
		this.isDebuffedCheckbox.name = `card-is-debuffed-${id}`

		this.rankSelect = this.fragment.querySelector('[data-c-rank]') as HTMLSelectElement
		this.rankSelect.name = `card-rank-${id}`

		this.suitSelect = this.fragment.querySelector('[data-c-suit]') as HTMLSelectElement
		this.suitSelect.name = `card-suit-${id}`

		this.editionSelect = this.fragment.querySelector('[data-c-edition]') as HTMLSelectElement
		this.editionSelect.name = `card-edition-${id}`

		this.enhancementSelect = this.fragment.querySelector('[data-c-enhancement]') as HTMLSelectElement
		this.enhancementSelect.name = `card-enhancement-${id}`

		this.sealSelect = this.fragment.querySelector('[data-c-seal]') as HTMLSelectElement
		this.sealSelect.name = `card-seal-${id}`

		this.addEventListener('click', (event) => {
			if (event.currentTarget && !isInteractive(event)) {
				this.isPlayedCheckbox.click()
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

	get isPlayed () {
		return this.isPlayedCheckbox.checked
	}

	get isDebuffed () {
		return this.isDebuffedCheckbox.checked
	}

	connectedCallback () {
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

	setCard (card: Card, isPlayed?: boolean) {
		const {
			rank,
			suit,
			edition,
			enhancement,
			seal,
			isDebuffed,
		} = card

		this.isPlayedCheckbox.checked = Boolean(isPlayed)
		this.isDebuffedCheckbox.checked = isDebuffed
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
			'--is-blind-the-pillar'
		)

		// This is shitty. Make it better. I shouldn't be querying unrelated DOM elements here.
		const blindNameSelect = this.ownerDocument.querySelector('[data-r-blind-name]') as HTMLSelectElement
		const blindIsActiveCheckbox = this.ownerDocument.querySelector('[data-r-blind-is-active]') as HTMLInputElement

		;[
			this.isPlayedCheckbox.checked ? '--is-played' : null,
			this.isDebuffedCheckbox.checked ? '--is-debuffed' : null,
			blindNameSelect.value === 'The Pillar' && blindIsActiveCheckbox.checked ? '--is-blind-the-pillar' : undefined,
		].filter(notNullish).forEach((className) => this.classList.add(className))
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
