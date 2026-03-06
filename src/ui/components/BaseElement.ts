import { html, render } from 'lit-html'

import { uniqueId } from '#ui/uniqueId.ts'

export class BaseElement extends HTMLElement {
	get [Symbol.toStringTag] () {
		return this.tagName
	}


	#uniqueId

	/**
	 * Tracks queued updates.
	 */
	#updateCount = 0

	constructor () {
		super()

		this.#uniqueId = uniqueId()
	}

	connectedCallback () {
		if (!this.isConnected) {
			return
		}

		this.render()
	}

	get uniqueId () {
		return this.#uniqueId
	}

	/**
	 * Convenience wrapper for the following:
	 *
	 * ```js
	 * this.queueUpdate(() => {
	 *   this.renderIfIdle()
	 * })
	 * ```
	 */
	queueRender () {
		this.queueUpdate(() => {
			this.renderIfIdle()
		})
	}

	/**
	 * Queues an update using `queueMicrotask`.
	 *
	 * The `callback` must call `this.#renderIfIdle()` which guarantees that `this.#updateCount` is tracked correctly.
	 *
	 * Using `queueMicrotask` ensures that multiple simultaneous changes to IDL attributes can be processed before applying their effects (which might depend on this having happened).
	 */
	queueUpdate (callback: VoidFunction) {
		this.#updateCount++
		queueMicrotask(callback)
	}

	renderIfIdle () {
		this.#updateCount--

		if (this.#updateCount === 0) {
			this.render()
		}
	}

	/**
	 * Renders the component.
	 */
	render () {
		if (!this.isConnected) {
			// Aborts rendering if the component is not yet or no longer connected.
			return
		}

		render(this.template(), this)
	}

	template () {
		return html``
	}
}
