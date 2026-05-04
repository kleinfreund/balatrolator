import { html } from 'lit-html'

import { JOKER_DEFINITIONS } from '#lib/data.ts'
import type { Joker, JokerEdition, JokerName, Rank, Suit } from '#lib/types.ts'
import { DraggableCard } from './DraggableCard.ts'
import { BaseElement } from '#ui/components/BaseElement.ts'

const lightCss = /*css*/`
	joker-card {
		--c-text: var(--c-black);
		--c-border: var(--c-red-dark);
		--c-background-light: var(--c-red-light);
		--c-background-lighter: var(--c-red-lighter);

		display: block;
	}

	@media (prefers-contrast: more) {
		joker-card {
			--c-border: var(--c-black);
			--c-background-light: var(--c-grey-light);
			--c-background-lighter: var(--c-white);
		}
	}

	joker-card:where([draggable="true"]) {
		cursor: ew-resize;
	}

	.jc-name-input {
		font-weight: bold;
	}

	.jc-count-input {
		inline-size: 3.5rem;
		text-align: right;
	}

	.jc-edition-input {
		inline-size: 8.5rem;
	}

	joker-card:not(.--has-plus-chips):not(.--has-plus-multiplier):not(.--has-times-multiplier):not(.--has-is-active):not(.--has-rank):not(.--has-suit) .jc-effects {
		display: none;
	}

	joker-card:not(.--has-plus-chips) .jc-plus-chips {
		display: none;
	}

	joker-card:not(.--has-plus-multiplier) .jc-plus-multiplier {
		display: none;
	}

	joker-card:not(.--has-times-multiplier) .jc-times-multiplier {
		display: none;
	}

	joker-card:not(.--has-is-active) .jc-is-active {
		display: none;
	}

	joker-card:not(.--has-rank):not(.--has-suit) .jc-card {
		display: none;
	}

	joker-card:not(.--has-rank) .jc-rank {
		display: none;
	}

	.jc-rank-input {
		inline-size: 5rem;
	}

	.jc-card-of {
		text-align: center;
	}

	joker-card.--has-rank:not(.--has-suit) .jc-card-of,
	joker-card:not(.--has-rank).--has-suit .jc-card-of {
		display: none;
	}

	joker-card:not(.--has-suit) .jc-suit {
		display: none;
	}

	.jc-suit-input {
		inline-size: 8rem;
	}

	.jc-plus-chips-input {
		inline-size: 7rem;
		text-align: right;
	}

	.jc-plus-multiplier-input {
		inline-size: 7rem;
		text-align: right;
	}

	.jc-times-multiplier-input {
		inline-size: 7rem;
		text-align: right;
	}
`
const lightStyleSheet = await new CSSStyleSheet().replace(lightCss)

export class JokerCard extends DraggableCard {
	static {
		if (window.customElements.get('joker-card') === undefined) {
			window.customElements.define('joker-card', JokerCard)
			document.adoptedStyleSheets.push(lightStyleSheet)
		}
	}

	#jokerName: JokerName = '8 Ball'
	#count = 1
	#edition: JokerEdition = 'Base'
	#plusChips = 0
	#plusMultiplier = 0
	#timesMultiplier = 1
	#active = true
	#rank: Rank = 'Ace'
	#suit: Suit = 'Clubs'

	constructor (joker?: Omit<Joker, 'index' | 'rarity'>) {
		super()

		if (!this.id) {
			this.id = `${this.tagName.toLowerCase()}-${this.uniqueId}`
		}
		this.classList.add('card')
		this.draggable = true

		if (joker) {
			this.jokerName = joker.name
			this.count = joker.count
			this.edition = joker.edition
			this.plusChips = joker.plusChips
			this.plusMultiplier = joker.plusMultiplier
			this.timesMultiplier = joker.timesMultiplier
			this.active = joker.active
			if (joker.rank) {
				this.rank = joker.rank
			}
			if (joker.suit) {
				this.suit = joker.suit
			}
		}
	}

	get jokerName () {
		return this.#jokerName
	}

	set jokerName (jokerName) {
		this.#jokerName = jokerName

		const definition = JOKER_DEFINITIONS[this.jokerName]
		this.classList[definition.hasPlusChipsInput ? 'add' : 'remove']('--has-plus-chips')
		this.classList[definition.hasPlusMultiplierInput ? 'add' : 'remove']('--has-plus-multiplier')
		this.classList[definition.hasTimesMultiplierInput ? 'add' : 'remove']('--has-times-multiplier')
		this.classList[definition.hasIsActiveInput ? 'add' : 'remove']('--has-is-active')
		this.classList[definition.hasRankInput ? 'add' : 'remove']('--has-rank')
		this.classList[definition.hasSuitInput ? 'add' : 'remove']('--has-suit')

		this.queueRender()
	}

	get count () {
		return this.#count
	}

	set count (count) {
		this.#count = count

		this.queueRender()
	}

	get edition () {
		return this.#edition
	}

	set edition (edition) {
		this.#edition = edition

		this.queueRender()
	}

	get plusChips () {
		return this.#plusChips
	}

	set plusChips (plusChips) {
		this.#plusChips = plusChips

		this.queueRender()
	}

	get plusMultiplier () {
		return this.#plusMultiplier
	}

	set plusMultiplier (plusMultiplier) {
		this.#plusMultiplier = plusMultiplier

		this.queueRender()
	}

	get timesMultiplier () {
		return this.#timesMultiplier
	}

	set timesMultiplier (timesMultiplier) {
		this.#timesMultiplier = timesMultiplier

		this.queueRender()
	}

	get rank () {
		return this.#rank
	}

	set rank (rank) {
		this.#rank = rank

		this.queueRender()
	}

	get suit () {
		return this.#suit
	}

	set suit (suit) {
		this.#suit = suit

		this.queueRender()
	}

	get active () {
		return this.#active
	}

	set active (active) {
		this.#active = active

		this.queueRender()
	}

	connectedCallback () {
		super.connectedCallback()

		if (!this.isConnected) {
			return
		}

		this.render()
	}

	template () {
		return html`
			<div class="stack">
				<div class="action-list">
					<button
						class="button --icon"
						?disabled="${this.previousElementSibling === null}"
						type="button"
						@click="${() => this.#swap(this, this.previousElementSibling)}"
					>
						<span class="visually-hidden">Move joker left</span>

						<svg class="icon">
							<use xlink:href="#arrow-left-icon"></use>
						</svg>
					</button>

					<button
						class="button --icon push-inline-start"
						type="button"
						@click="${() => this.remove()}"
					>
						<span class="visually-hidden">Remove joker</span>

						<svg class="icon">
							<use xlink:href="#trash-icon"></use>
						</svg>
					</button>

					<button
						class="button --icon"
						?disabled="${this.nextElementSibling === null}"
						type="button"
						@click="${() => this.#swap(this.nextElementSibling, this)}"
					>
						<span class="visually-hidden">Move joker right</span>

						<svg class="icon">
							<use xlink:href="#arrow-right-icon"></use>
						</svg>
					</button>
				</div>

				<label>
					<span class="visually-hidden">Joker name</span>

					<combo-box
						id="joker-name-${this.uniqueId}"
						name="joker-name-${this.uniqueId}"
						class="jc-name-input"
						value="8 Ball"
						.value="${this.jokerName}"
						options-json="jokersJson"
						button-label="Show joker options"
						input-label="Filter jokers"
						listbox-label="Jokers"
						@change="${(event: Event) => {
							const input = event.target as HTMLInputElement
							this.jokerName = input.value as JokerName
						}}"
					></combo-box>
				</label>

				<div class="action-list">
					<label class="control-box --flat --grow">
						<span class="label truncate">Count</span>
						<input
							id="joker-count-${this.uniqueId}"
							class="jc-count-input text-input"
							type="number"
							value="1"
							.value="${this.count}"
							min="0"
							@change="${(event: Event) => {
								const input = event.target as HTMLInputElement
								this.count = Number(input.value)
							}}"
						>
						<span class="label truncate" aria-hidden="true">×</span>
					</label>

					<button
						class="button --icon"
						type="button"
						popovertarget="jc-duplicate-modal"
						@click="${(event: Event) => this.showDuplicateModal(event)}"
					>
						<span class="visually-hidden">Duplicate joker</span>

						<svg class="icon">
							<use xlink:href="#copy-icon"></use>
						</svg>
					</button>
				</div>

				<label class="control-box --flat --grow">
					<span class="label truncate">Edition</span>

					<select
						id="joker-edition-${this.uniqueId}"
						name="joker-edition-${this.uniqueId}"
						.value="${this.edition}"
						class="jc-edition-input select"
						@change="${(event: Event) => {
							const input = event.target as HTMLInputElement
							this.edition = input.value as JokerEdition
						}}"
					>
						<option value="Base" selected>Base</option>
						<option value="Foil">Foil</option>
						<option value="Holographic">Holographic</option>
						<option value="Polychrome">Polychrome</option>
						<option value="Negative">Negative</option>
					</select>
				</label>

				<div class="jc-effects stack">
					<label class="jc-plus-chips control-box --flat --grow">
						<span class="label truncate">+Chips</span>

						<input
							name="joker-plusChips-${this.uniqueId}"
							class="jc-plus-chips-input text-input"
							type="number"
							value="0"
							.value="${this.plusChips}"
							min="0"
							@change="${(event: Event) => {
								const input = event.target as HTMLInputElement
								this.plusChips = Number(input.value)
							}}"
						>
					</label>

					<label class="jc-plus-multiplier control-box --flat --grow">
						<span class="label truncate">+Mult</span>

						<input
							name="joker-plusMultiplier-${this.uniqueId}"
							class="jc-plus-multiplier-input text-input"
							type="number"
							value="0"
							.value="${this.plusMultiplier}"
							min="0"
							@change="${(event: Event) => {
								const input = event.target as HTMLInputElement
								this.plusMultiplier = Number(input.value)
							}}"
						>
					</label>

					<label class="jc-times-multiplier control-box --flat --grow">
						<span class="label truncate">xMult</span>

						<input
							name="joker-timesMultiplier-${this.uniqueId}"
							class="jc-times-multiplier-input text-input"
							type="number"
							value="1"
							.value="${this.timesMultiplier}"
							min="1"
							step="0.05"
							@change="${(event: Event) => {
								const input = event.target as HTMLInputElement
								this.timesMultiplier = Number(input.value)
							}}"
						>
					</label>

					<label class="jc-is-active checkbox-control">
						<input
							name="joker-active-${this.uniqueId}"
							class="jc-is-active-input"
							type="checkbox"
							value="is-active"
							checked
							.checked="${this.active}"
							@change="${(event: Event) => {
								const input = event.target as HTMLInputElement
								this.active = input.checked
							}}"
						>

						<span class="label">Active?</span>
					</label>

					<div class="jc-card input-list">
						<label class="jc-rank">
							<span class="visually-hidden">Rank</span>

							<select
								id="joker-rank-${this.uniqueId}"
								name="joker-rank-${this.uniqueId}"
								class="jc-rank-input select"
								.value="${this.rank}"
								@change="${(event: Event) => {
									const input = event.target as HTMLInputElement
									this.rank = input.value as Rank
								}}"
							>
								<option value="Ace" selected>Ace</option>
								<option value="King">King</option>
								<option value="Queen">Queen</option>
								<option value="Jack">Jack</option>
								<option value="10">10</option>
								<option value="9">9</option>
								<option value="8">8</option>
								<option value="7">7</option>
								<option value="6">6</option>
								<option value="5">5</option>
								<option value="4">4</option>
								<option value="3">3</option>
								<option value="2">2</option>
							</select>
						</label>

						<span class="jc-card-of">of</span>

						<label class="jc-suit">
							<span class="visually-hidden">Suit</span>

							<select
								id="joker-suit-${this.uniqueId}"
								name="joker-suit-${this.uniqueId}"
								class="jc-suit-input select"
								.value="${this.suit}"
								@change="${(event: Event) => {
									const input = event.target as HTMLInputElement
									this.suit = input.value as Suit
								}}"
							>
								<button><selectedcontent></selectedcontent></button>
								<option value="Clubs" selected>
									<svg aria-hidden="true" class="icon --small">
										<use xlink:href="#clubs-icon"></use>
									</svg>
									Clubs
								</option>
								<option value="Spades">
									<svg aria-hidden="true" class="icon --small">
										<use xlink:href="#spades-icon"></use>
									</svg>
									Spades
								</option>
								<option value="Hearts">
									<svg aria-hidden="true" class="icon --small">
										<use xlink:href="#hearts-icon"></use>
									</svg>
									Hearts
								</option>
								<option value="Diamonds">
									<svg aria-hidden="true" class="icon --small">
										<use xlink:href="#diamonds-icon"></use>
									</svg>
									Diamonds
								</option>
							</select>
						</label>
					</div>
				</div>
			</div>
		`
	}

	#swap = (previousElement: Element | null, nextElement: Element | null) => {
		if (
			this.parentElement &&
			previousElement instanceof BaseElement &&
			nextElement instanceof BaseElement
		) {
			this.parentElement.insertBefore(previousElement, nextElement)
			// Trigger a re-render to update the “disabled” state of the “Move left”/“Move right” buttons.
			previousElement.queueRender()
			nextElement.queueRender()
		}
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
		return new JokerCard({
			name: this.jokerName,
			edition: this.edition,
			plusChips: this.plusChips,
			plusMultiplier: this.plusMultiplier,
			timesMultiplier: this.timesMultiplier,
			active: this.active,
			count: this.count,
			rank: this.rank,
			suit: this.suit,
		})
	}
}
