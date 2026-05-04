import { html } from 'lit-html'

import type { BlindName, Card, Edition, Enhancement, Rank, Seal, Suit } from '#lib/types.ts'
import { DraggableCard } from './DraggableCard.ts'
import { BaseElement } from '#ui/components/BaseElement.ts'

const lightCss = /*css*/`
	playing-card {
		--c-text: var(--c-black);
		--c-border: var(--c-yellow-dark);
		--c-background-light: var(--c-yellow-light);
		--c-background-lighter: var(--c-yellow-lighter);

		display: block;
	}

	@media (prefers-contrast: more) {
		playing-card {
			--c-border: var(--c-black);
			--c-background-light: var(--c-grey-light);
			--c-background-lighter: var(--c-white);
		}
	}

	playing-card:where([draggable="true"]) {
		cursor: ew-resize;
	}

	playing-card:where(.--is-played) {
		margin-block-end: 1.5rem;
	}

	playing-card:not(:where(.--is-played)) {
		margin-block-start: 1.5rem;
	}

	playing-card:not(.--is-blind-the-pillar) .pc-is-debuffed {
		display: none;
	}

	.pc-rank-input {
		inline-size: 5rem;
		font-weight: bold;
	}

	.pc-suit-input {
		inline-size: 8rem;
		font-weight: bold;
	}

	.pc-card-of {
		text-align: center;
	}

	.pc-count-input {
		inline-size: 3.5rem;
		text-align: end;
	}

	.pc-edition-input {
		inline-size: 8.5rem;
	}

	.pc-enhancement-input {
		inline-size: 5.5rem;
	}

	.pc-seal-input {
		inline-size: 5.5rem;
	}

	.pc-seal-orb {
		background-color: var(--seal-color, transparent);
		border: 1px solid #000;
		border-radius: 50%;
		display: block;
		block-size: 1rem;
		inline-size: 1rem;
	}
`
const lightStyleSheet = await new CSSStyleSheet().replace(lightCss)

export class PlayingCard extends DraggableCard {
	static {
		if (window.customElements.get('playing-card') === undefined) {
			window.customElements.define('playing-card', PlayingCard)
			document.adoptedStyleSheets.push(lightStyleSheet)
		}
	}

	#played = true
	#count = 1
	#debuffed = false
	#rank: Rank = 'Ace'
	#suit: Suit = 'Clubs'
	#edition: Edition = 'Base'
	#enhancement: Enhancement = 'None'
	#seal: Seal = 'None'

	constructor (card?: Omit<Card, 'index'>) {
		super()

		if (!this.id) {
			this.id = `${this.tagName.toLowerCase()}-${this.uniqueId}`
		}
		this.classList.add('card', '--is-played')
		this.draggable = true

		if (card) {
			this.played = card.played
			this.count = card.count
			this.debuffed = card.debuffed
			this.rank = card.rank
			this.suit = card.suit
			this.edition = card.edition
			this.enhancement = card.enhancement
			this.seal = card.seal
		}

		// Allow clicking the card to toggle its played state.
		this.addEventListener('click', (event) => {
			if (event.isTrusted && !isInteractive(event)) {
				this.played = !this.played
			}
		}, { capture: true })
	}

	get card () {
		return {
			index: this.parentElement!.children.length,
			rank: this.rank,
			suit: this.suit,
			edition: this.edition,
			enhancement: this.enhancement,
			seal: this.seal,
			debuffed: this.debuffed,
			played: this.played,
			count: this.count,
		}
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

	get edition () {
		return this.#edition
	}

	set edition (edition) {
		this.#edition = edition

		this.queueRender()
	}

	get enhancement () {
		return this.#enhancement
	}

	set enhancement (enhancement) {
		this.#enhancement = enhancement

		this.queueRender()
	}

	get seal () {
		return this.#seal
	}

	set seal (seal) {
		this.#seal = seal

		this.queueRender()
	}

	get played () {
		return this.#played
	}

	set played (played) {
		this.#played = played

		this.classList[this.played ? 'add' : 'remove']('--is-played')

		this.queueRender()
	}

	get debuffed () {
		return this.#debuffed
	}

	set debuffed (debuffed) {
		this.#debuffed = debuffed

		this.classList[this.debuffed ? 'add' : 'remove']('--is-debuffed')

		this.queueRender()
	}

	get count () {
		return this.#count
	}

	set count (count) {
		this.#count = count

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
						<span class="visually-hidden">Move card left</span>

						<svg class="icon">
							<use xlink:href="#arrow-left-icon"></use>
						</svg>
					</button>

					<label class="checkbox-control">
						<input
							name="card-is-played-${this.uniqueId}"
							type="checkbox"
							value="is-played"
							checked
							.checked="${this.played}"
							@change="${(event: Event) => {
								const input = event.target as HTMLInputElement
								this.played = input.checked
							}}"
						>

						<span class="label">Play?</span>
					</label>

					<button
						class="button --icon push-inline-start"
						type="button"
						@click="${() => this.remove()}"
					>
						<span class="visually-hidden">Remove playing card</span>

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
						<span class="visually-hidden">Move card right</span>

						<svg class="icon">
							<use xlink:href="#arrow-right-icon"></use>
						</svg>
					</button>
				</div>

				<div class="input-list">
					<label class="control-box">
						<span class="visually-hidden">Rank</span>

						<select
							class="pc-rank-input select"
							id="card-rank-${this.uniqueId}"
							name="card-rank-${this.uniqueId}"
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

					<span class="pc-card-of">of</span>

					<label class="control-box">
						<span class="visually-hidden">Suit</span>

						<select
							class="pc-suit-input select"
							id="card-suit-${this.uniqueId}"
							name="card-suit-${this.uniqueId}"
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

				<div class="action-list">
					<label class="control-box --flat --grow">
						<span class="label truncate">Count</span>
						<input
							class="pc-count-input text-input"
							name="card-count-${this.uniqueId}"
							type="number"
							value="1"
							.value="${this.count}"
							min="1"
							@change="${(event: Event) => {
								const input = event.target as HTMLInputElement
								this.count = Number(input.value)
							}}"
						>
						<span class="label truncate" aria-hidden="true">×</span>
					</label>

					<button
						class="button --icon push-inline-start"
						type="button"
						popovertarget="pc-duplicate-modal"
						@click="${(event: Event) => this.showDuplicateModal(event)}"
					>
						<span class="visually-hidden">Duplicate card</span>

						<svg class="icon">
							<use xlink:href="#copy-icon"></use>
						</svg>
					</button>
				</div>

				<label class="pc-is-debuffed checkbox-control">
					<input
						class="pc-is-debuffed-input"
						name="card-is-debuffed-${this.uniqueId}"
						type="checkbox"
						value="is-debuffed"
						.checked="${this.debuffed}"
						@change="${(event: Event) => {
							const input = event.target as HTMLInputElement
							this.debuffed = input.checked
						}}"
					>

					<span class="label">Debuffed?</span>
				</label>

				<label class="control-box --flat --grow">
					<span class="label truncate">Edition</span>

					<select
						class="pc-edition-input select"
						id="card-edition-${this.uniqueId}"
						name="card-edition-${this.uniqueId}"
						.value="${this.edition}"
						@change="${(event: Event) => {
							const input = event.target as HTMLInputElement
							this.edition = input.value as Edition
						}}"
					>
						<option value="Base" selected>Base</option>
						<option value="Foil">Foil</option>
						<option value="Holographic">Holographic</option>
						<option value="Polychrome">Polychrome</option>
					</select>
				</label>

				<label class="control-box --flat --grow">
					<span class="label truncate">Enhancement</span>

					<select
						class="pc-enhancement-input select"
						id="card-enhancement-${this.uniqueId}"
						name="card-enhancement-${this.uniqueId}"
						.value="${this.enhancement}"
						@change="${(event: Event) => {
							const input = event.target as HTMLInputElement
							this.enhancement = input.value as Enhancement
						}}"
					>
						<option value="None" selected>None</option>
						<option value="Bonus">Bonus</option>
						<option value="Mult">Mult</option>
						<option value="Wild">Wild</option>
						<option value="Glass">Glass</option>
						<option value="Steel">Steel</option>
						<option value="Stone">Stone</option>
						<option value="Gold">Gold</option>
						<option value="Lucky">Lucky</option>
					</select>
				</label>

				<label class="control-box --flat --grow">
					<span class="label truncate">Seal</span>

					<select
						class="pc-seal-input select"
						id="card-seal-${this.uniqueId}"
						name="card-seal-${this.uniqueId}"
						.value="${this.seal}"
						@change="${(event: Event) => {
							const input = event.target as HTMLInputElement
							this.seal = input.value as Seal
						}}"
					>
						<button><selectedcontent></selectedcontent></button>
						<option value="None" selected>
							<span aria-hidden="true" class="pc-seal-orb" style="--seal-color: transparent"></span>
							None
						</option>
						<option value="Gold">
							<span aria-hidden="true" class="pc-seal-orb" style="--seal-color: var(--c-seal-gold)"></span>
							Gold
						</option>
						<option value="Red">
							<span aria-hidden="true" class="pc-seal-orb" style="--seal-color: var(--c-seal-red)"></span>
							Red
						</option>
						<option value="Blue">
							<span aria-hidden="true" class="pc-seal-orb" style="--seal-color: var(--c-seal-blue)"></span>
							Blue
						</option>
						<option value="Purple">
							<span aria-hidden="true" class="pc-seal-orb" style="--seal-color: var(--c-seal-purple)"></span>
							Purple
						</option>
					</select>
				</label>
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

	toggleBlindEffects (blindName: BlindName, isActive: boolean) {
		const isThePillarBlind = blindName === 'The Pillar' && isActive
		this.classList[isThePillarBlind ? 'add' : 'remove']('--is-blind-the-pillar')
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
		return new PlayingCard({
			rank: this.rank,
			suit: this.suit,
			edition: this.edition,
			enhancement: this.enhancement,
			seal: this.seal,
			debuffed: this.debuffed,
			played: this.played,
			count: this.count,
		})
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
