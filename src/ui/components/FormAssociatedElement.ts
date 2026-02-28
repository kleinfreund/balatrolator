/**
 * Basic form-associated custom element implementing the {@link https://developer.mozilla.org/en-US/docs/Web/API/ElementInternals|ElementInternals} API.
 *
 * Adapted from {@link https://www.peterkroener.de/unsortierte-erkenntnisse-zu-formular-elementen-mit-custom-elements-teil-1/|Unsortierte Erkenntnisse zu Formular-Elementen mit Custom Elements, Teil 1 von N}.
 */
export class FormAssociatedElement extends HTMLElement {
	static formAssociated = true

	#internals = this.attachInternals()

	get labels () {
		return this.#internals.labels
	}

	get form () {
		return this.#internals.form
	}

	get shadowRoot () {
		return this.#internals.shadowRoot
	}

	get type () {
		return this.tagName.toLowerCase()
	}

	get validationMessage () {
		return this.#internals.validationMessage
	}

	get validity () {
		return this.#internals.validity
	}

	get willValidate () {
		return this.#internals.willValidate
	}

	checkValidity () {
		return this.#internals.checkValidity()
	}

	reportValidity () {
		return this.#internals.reportValidity()
	}

	setFormValue (...args: Parameters<ElementInternals['setFormValue']>) {
		this.#internals.setFormValue(...args)
	}
}
