import type { HandName } from '#lib/types.ts'

export class HandLevel extends HTMLElement {
	static {
		if (window.customElements.get('hand-level') === undefined) {
			window.customElements.define('hand-level', HandLevel)
		}
	}

	hasRendered = false
	fragment: Element
	nameEl: HTMLElement
	levelInput: HTMLInputElement
	playsInput: HTMLInputElement

	constructor () {
		super()

		const template = document.querySelector<HTMLTemplateElement>('template#hand-level')!
		this.fragment = template.content.cloneNode(true) as Element

		this.nameEl = this.fragment.querySelector<HTMLElement>('[data-h-name]')!
		this.levelInput = this.fragment.querySelector<HTMLInputElement>('[data-h-level]')!
		this.playsInput = this.fragment.querySelector<HTMLInputElement>('[data-h-plays]')!
	}

	get [Symbol.toStringTag] () {
		return this.tagName
	}

	get handName () {
		return this.nameEl.textContent as HandName
	}

	get level () {
		return Number(this.levelInput.value)
	}

	get plays () {
		return Number(this.playsInput.value)
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

	setHandLevel (handName: HandName, { level, plays }: { level: number, plays: number }) {
		this.nameEl.textContent = handName
		this.levelInput.value = String(level)
		this.playsInput.value = String(plays)
	}
}
