import { uniqueId } from '#ui/uniqueId.ts'
import { notNullish } from '#utilities/notNullish.ts'
import { DraggableCard } from './DraggableCard.ts'
import type { Card, Edition, Enhancement, Rank, Seal, Suit } from '#lib/types.ts'

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
	countInput: HTMLInputElement
	debuffedCheckbox: HTMLInputElement
	rankInput: HTMLInputElement
	suitInput: HTMLInputElement
	editionInput: HTMLInputElement
	enhancementInput: HTMLInputElement
	sealInput: HTMLInputElement

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

		this.countInput = this.fragment.querySelector<HTMLInputElement>('[data-c-count]')!
		this.countInput.name = `card-count-${id}`

		this.debuffedCheckbox = this.fragment.querySelector<HTMLInputElement>('[data-c-is-debuffed]')!
		this.debuffedCheckbox.name = `card-is-debuffed-${id}`

		this.rankInput = this.fragment.querySelector<HTMLInputElement>('[data-c-rank]')!
		this.rankInput.name = `card-rank-${id}`
		this.rankInput.addEventListener('change', () => {
			const rankOption = document.querySelector(`datalist#rank-options option[value="${this.rank}"]`)
			this.rankInput.setCustomValidity(rankOption ? '' : `“${this.rank}” is not a rank.`)
			this.rankInput.reportValidity()
		})

		this.suitInput = this.fragment.querySelector<HTMLInputElement>('[data-c-suit]')!
		this.suitInput.name = `card-suit-${id}`
		this.suitInput.addEventListener('change', () => {
			const suitOption = document.querySelector(`datalist#suit-options option[value="${this.suit}"]`)
			this.suitInput.setCustomValidity(suitOption ? '' : `“${this.suit}” is not a suit.`)
			this.suitInput.reportValidity()
		})

		this.editionInput = this.fragment.querySelector<HTMLInputElement>('[data-c-edition]')!
		this.editionInput.name = `card-edition-${id}`
		this.editionInput.addEventListener('change', () => {
			const editionOption = document.querySelector(`datalist#playing-card-edition-options option[value="${this.edition}"]`)
			this.editionInput.setCustomValidity(editionOption ? '' : `“${this.edition}” is not an edition.`)
			this.editionInput.reportValidity()
		})

		this.enhancementInput = this.fragment.querySelector<HTMLInputElement>('[data-c-enhancement]')!
		this.enhancementInput.name = `card-enhancement-${id}`
		this.enhancementInput.addEventListener('change', () => {
			const editionOption = document.querySelector(`datalist#enhancement-options option[value="${this.edition}"]`)
			this.enhancementInput.setCustomValidity(editionOption ? '' : `“${this.edition}” is not an enhancement.`)
			this.enhancementInput.reportValidity()
		})

		this.sealInput = this.fragment.querySelector<HTMLInputElement>('[data-c-seal]')!
		this.sealInput.name = `card-seal-${id}`
		this.sealInput.addEventListener('change', () => {
			const editionOption = document.querySelector(`datalist#seal-options option[value="${this.edition}"]`)
			this.sealInput.setCustomValidity(editionOption ? '' : `“${this.edition}” is not a seal.`)
			this.sealInput.reportValidity()
		})

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
		return this.rankInput.value as Rank
	}

	get suit () {
		return this.suitInput.value as Suit
	}

	get edition () {
		return this.editionInput.value as Edition
	}

	get enhancement () {
		return this.enhancementInput.value as Enhancement
	}

	get seal () {
		return this.sealInput.value as Seal
	}

	get played () {
		return this.playedCheckbox.checked
	}

	get debuffed () {
		return this.debuffedCheckbox.checked
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

	get card (): Card {
		if (this.#card) {
			return this.#card
		}

		const index = this.parentElement!.children.length
		const rank = this.rank
		const suit = this.suit
		const edition = this.edition
		const enhancement = this.enhancement
		const seal = this.seal
		const debuffed = this.debuffed
		const played = this.played
		const count = this.count

		return {
			index,
			rank,
			suit,
			edition,
			enhancement,
			seal,
			debuffed,
			played,
			count,
		}
	}

	setCard (card?: Card) {
		this.#card = card ?? this.card

		const {
			rank,
			suit,
			edition,
			enhancement,
			seal,
			debuffed,
			played,
			count,
		} = this.#card

		this.playedCheckbox.checked = played
		this.countInput.value = String(count)
		this.debuffedCheckbox.checked = debuffed
		this.rankInput.value = rank
		this.suitInput.value = suit
		this.editionInput.value = edition
		this.enhancementInput.value = enhancement
		this.sealInput.value = seal
	}

	updateState () {
		this.classList.remove(
			'--is-played',
			'--is-debuffed',
			'--is-blind-the-pillar',
		)

		// This is shitty. Make it better. I shouldn't be querying unrelated DOM elements here.
		const blindNameInput = this.ownerDocument.querySelector('[data-r-blind-name]') as HTMLInputElement
		const blindIsActiveCheckbox = this.ownerDocument.querySelector('[data-r-blind-is-active]') as HTMLInputElement

		;[
			this.playedCheckbox.checked ? '--is-played' : null,
			this.debuffedCheckbox.checked ? '--is-debuffed' : null,
			blindNameInput.value === 'The Pillar' && blindIsActiveCheckbox.checked ? '--is-blind-the-pillar' : undefined,
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
		clone.countInput.value = this.countInput.value
		clone.debuffedCheckbox.checked = this.debuffedCheckbox.checked
		clone.rankInput.value = this.rankInput.value
		clone.suitInput.value = this.suitInput.value
		clone.editionInput.value = this.editionInput.value
		clone.enhancementInput.value = this.enhancementInput.value
		clone.sealInput.value = this.sealInput.value

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
