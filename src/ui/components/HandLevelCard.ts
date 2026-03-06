import { html } from 'lit-html'

import type { HandLevel, HandName } from '#lib/types.ts'
import { BaseElement } from './BaseElement.ts'

const lightCss = /*css*/`
	hand-level-card {
		display: block;
		inline-size: initial;
	}

	@media (prefers-contrast: more) {
		hand-level-card {
			--c-text: var(--c-black);
			--c-border: var(--c-black);
			--c-background-light: var(--c-grey-light);
			--c-background-lighter: var(--c-white);
		}
	}

	.hlc-level-input {
		text-align: right;
		inline-size: 4rem;
	}

	.hlc-plays-input {
		text-align: right;
		inline-size: 5rem;
	}
`
const lightStyleSheet = await new CSSStyleSheet().replace(lightCss)

export class HandLevelCard extends BaseElement {
	static {
		if (window.customElements.get('hand-level-card') === undefined) {
			window.customElements.define('hand-level-card', HandLevelCard)
			document.adoptedStyleSheets.push(lightStyleSheet)
		}
	}

	#handName
	#level
	#plays

	constructor (
		handName?: HandName,
		handLevel?: HandLevel,
	) {
		super()

		this.#handName = handName ?? 'High Card'
		this.#level = handLevel?.level ?? 1
		this.#plays = handLevel?.plays ?? 0
	}

	get handName () {
		return this.#handName
	}

	set handName (handName) {
		this.#handName = handName

		this.queueRender()
	}

	get level () {
		return this.#level
	}

	set level (level) {
		this.#level = level

		this.queueRender()
	}

	get plays () {
		return this.#plays
	}

	set plays (plays) {
		this.#plays = plays

		this.queueRender()
	}

	template () {
		return html`
			<fieldset class="stack">
				<legend>${this.handName}</legend>

				<div class="stack">
					<div class="input-list">
						<label class="control-box --flat --grow">
							<span class="label">
								<span aria-hidden="true">lvl</span>
								<span class="visually-hidden">Level</span>
							</span>

							<input
								class="hlc-level-input text-input"
								type="number"
								value="1"
								.value="${this.level}"
								min="1"
								@change="${(event: Event) => {
									const input = event.target as HTMLInputElement
									this.level = Number(input.value)
								}}"
							>
						</label>

						<label class="hlc-plays control-box --flat --grow">
							<span class="label">
								<span aria-hidden="true">#</span>
								<span class="visually-hidden">Number of plays</span>
							</span>

							<input
								class="hlc-plays-input text-input"
								type="number"
								value="0"
								.value="${this.plays}"
								min="0"
								@change="${(event: Event) => {
									const input = event.target as HTMLInputElement
									this.plays = Number(input.value)
								}}"
							>
						</label>
					</div>
				</div>
			</fieldset>
		`
	}
}
