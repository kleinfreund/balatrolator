import { html, render } from 'lit-html'

import { FormAssociatedElement } from './FormAssociatedElement.ts'

const lightCss = /*css*/`
	combo-box {
		position: relative;
		display: block;
		inline-size: 100%;
		max-inline-size: 100%;
		block-size: 2rem;
	}

	.cb-button {
		anchor-name: var(--anchor-name);
		display: flex;
		justify-content: space-between;
		align-items: center;
		block-size: 100%;
		inline-size: 100%;
		padding: 0 0.25rem;
		border: 2px solid var(--c-border);
		border-radius: 0.25rem;
		color: var(--c-text);
		background-color: var(--c-background-lighter);
		text-align: start;
	}

	.cb-popover {
		position-anchor: var(--anchor-name);
		position: absolute;
		overflow: unset;
		inset-block-start: calc(anchor(end) + 0.25rem);
		inset-inline-start: anchor(start);
		margin: 0;
		padding: 0;
		border: none;
		background-color: transparent;
		font-weight: normal;
	}

	.cb-option-list {
		max-height: 15rem;
		display: flex;
		flex-direction: column;
		overflow-y: auto;
		margin-block-start: 0.25rem;
		border: 2px solid var(--c-border);
		border-radius: 0.5rem;
	}

	.cb-option-list > button {
		display: flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.25rem;
		border: none;
		font: inherit;
		color: var(--c-text);
		background-color: var(--c-background-lighter);
		text-align: start;

		&:focus-visible {
			isolation: isolate;
		}

		&[data-highlighted],
		&:where(:enabled):hover {
			background-color: var(--c-background-light);
		}

		&:not(:has(> .icon)) {
			padding-inline-start: calc(2 * 0.25rem + 16px);
		}
	}

	.cb-option-list:has(> button) + .cb-empty {
		display: none;
	}

	.cb-empty {
		padding: 0.25rem;
		font-style: italic;
	}
`
const lightStyleSheet = await new CSSStyleSheet().replace(lightCss)

/**
 * A form-associated and editable ARIA combobox for selecting from a known set of options with a text input for filtering.
 */
export class ComboBox extends FormAssociatedElement {
	static {
		if (window.customElements.get('combo-box') === undefined) {
			window.customElements.define('combo-box', ComboBox)
			document.adoptedStyleSheets.push(lightStyleSheet)
		}
	}

	get [Symbol.toStringTag] () {
		return this.tagName
	}

	#value = ''
	/**
	 * Indicates when changes to the `value` content attribute *shouldn't* be reflected by its IDL attribute.
	 *
	 * A form reset will reset this flag.
	 */
	#dirty = false
	#disabledState = false

	#button: HTMLButtonElement | null = null
	#buttonCommands: Record<string, { action: (event: KeyboardEvent) => void }> = {
		'Alt+ArrowDown': {
			action: () => this.#openPopover(),
		},
		'Alt+ArrowUp': {
			action: () => this.#openPopover(),
		},
		ArrowDown: {
			action: () => this.#openPopover(),
		},
		ArrowUp: {
			action: () => this.#openPopover(),
		},
		ArrowLeft: {
			action: () => this.#selectNeighboringOption(-1),
		},
		ArrowRight: {
			action: () => this.#selectNeighboringOption(1),
		},
	}

	#query = ''
	#_highlightedOptionIndex = 0
	#ariaActiveDescendantElement: Element | null = null
	#searchInputCommands: Record<string, { action: (event: KeyboardEvent) => void }> = {
		ArrowDown: {
			action: (event) => this.#moveOptionIndex(event, 1),
		},
		ArrowUp: {
			action: (event) => this.#moveOptionIndex(event, -1),
		},
		Enter: {
			action: (event) => this.#selectHighlightedOption(event),
		},
		Tab: {
			action: (event) => this.#selectHighlightedOption(event),
		},
	}

	#optionList: HTMLElement | null = null
	#_options: string[] = []
	#_filteredOptions: string[] = []

	constructor () {
		super()

		if (!this.id) {
			this.id = `${this.tagName.toLowerCase()}-${this.uniqueId}`
		}

		// Needed for dynamically setting a unique anchor name.
		this.style.setProperty('--anchor-name', `--${this.id}`)

		const optionsSelector = `#${this.getAttribute('options-json')}`
		const optionsScript = document.querySelector<HTMLScriptElement>(optionsSelector)!
		this.#options = JSON.parse(optionsScript.textContent.trim()) as string[]

		this.setFormValue(this.value)
	}

	formDisabledCallback (disabled: boolean) {
		this.disabledState = disabled
	}

	/**
	 * Resets the dirty flag and initializes the combo box anew using the value of the `value` content attribute, if set.
	 */
	// This relies on all internal form controls being disassociated from their form so that they don't reset their values per the default reset algorithm. This would interfere with the logic in this callback.
	formResetCallback () {
		this.#dirty = false
		this.#setValue(this.defaultValue, { isUserTriggered: false })
	}

	get defaultValue () {
		// The `defaultValue` IDL attribute reflects the `value` (yes, not `default-value`) content attribute.
		return this.getAttribute('value') ?? ''
	}

	set defaultValue (defaultValue) {
		this.setAttribute('value', defaultValue)

		if (!this.#dirty) {
			this.#setValue(defaultValue, { isUserTriggered: false })
		}
	}

	/**
	 * The form-associated element's disabled state. Controls the disabled state of the form controls and buttons that are part of the color picker. Does not change when an ancestor fieldset is disabled.
	 */
	get disabled () {
		return this.hasAttribute('disabled')
	}

	set disabled (disabled) {
		if (disabled) {
			this.setAttribute('disabled', '')
		} else {
			this.removeAttribute('disabled')
		}

		this.queueRender()
	}

	/**
	 * The element's _effective_ disabled state. `true` if the element itself is disabled _or_ if the element is a descendant of a disabled `fieldset` element.
	 */
	// Keeping track of this separately to the `disabled` IDL attribute is necessary because that should only indicate if the element itself is disabled. However, sometimes we need to know whether the element is functionally disabled through _either_ its own disabled state _or_ an ancestor fieldset.
	get disabledState () {
		return this.disabled || this.#disabledState
	}

	set disabledState (disabledState) {
		this.#disabledState = disabledState

		this.queueRender()
	}

	get name () {
		return this.getAttribute('name') ?? ''
	}

	set name (name) {
		this.setAttribute('name', name)
	}

	/**
	 * ID of the form-associated element. Will be used to prefix all form controls’ `id` and `for` attribute values.
	 */
	get id () {
		return this.getAttribute('id') ?? ''
	}

	set id (id) {
		this.setAttribute('id', id)

		this.queueRender()
	}

	get required () {
		return this.hasAttribute('required')
	}

	set required (required) {
		if (required) {
			this.setAttribute('required', '')
		} else {
			this.removeAttribute('required')
		}
	}

	get query () {
		return this.#query
	}

	set query (query) {
		this.#query = query
		this.#_filteredOptions = this.#options.filter((option) => option.toLowerCase().includes(query))

		this.queueRender()
	}

	get #options () {
		return this.#_options
	}

	set #options (options) {
		this.#_options = options
		this.#_filteredOptions = options.filter((option) => option.toLowerCase().includes(this.query))

		this.queueRender()
	}

	get #filteredOptions () {
		return this.#_filteredOptions
	}

	get #highlightedOptionIndex () {
		return this.#_highlightedOptionIndex
	}

	set #highlightedOptionIndex (highlightedOptionIndex) {
		this.#_highlightedOptionIndex = highlightedOptionIndex

		// TODO: Improve this somehow. This might be interacted with before anything was rendered which crashes.
		if (this.isConnected) {
			this.#ariaActiveDescendantElement = this.#getOptionByIndex(highlightedOptionIndex)
		}

		this.queueRender()
	}

	/**
	 * Value of the form-associated element.
	 *
	 * **Getter**: Returns the selected option.
	 */
	get value (): string {
		return this.#value || this.defaultValue
	}

	/**
	 * **Setter**: Sets the selected option.
	 *
	 * Sets the dirty flag.
	 */
	set value (value: string) {
		this.#setValue(value, { isUserTriggered: true })
	}

	/**
	 * Set `value`.
	 *
	 * Sets the dirty flag **if `isUserTriggered` is `true`**.
	 */
	#setValue (
		value: string,
		{ isUserTriggered }: { isUserTriggered: boolean },
	) {

		if (isUserTriggered) {
			this.#dirty = true
		}

		this.#value = value
		this.setFormValue(this.value)

		// Update the highlighted option so opening the popover starts with the correct option highlighted
		this.#highlightedOptionIndex = this.#filteredOptions.indexOf(this.value)

		// Clear the query on setting a value so that opening the listbox shows an unfiltered list of options again
		this.query = ''

		this.queueUpdate(() => {
			this.renderIfIdle()

			if (isUserTriggered) {
				// Form-associated custom elements automatically include their form value in any event's `target.value` property.
				this.dispatchEvent(new Event('input', { bubbles: true }))

				// Technically, this should be guarded behind some form of “has committed value” check. However, the nature of the combo box means that each value change always coincides with a value being committed.
				this.dispatchEvent(new Event('change', { bubbles: true }))
			}
		})
	}

	/**
	 * Renders the component.
	 */
	render () {
		if (!this.isConnected) {
			// Aborts rendering if the component is not yet or no longer connected.
			return
		}

		this.classList.add('combo-box')
		render(this.template(), this)

		this.#button = this.querySelector<HTMLButtonElement>('.cb-button')!
		this.#optionList = this.querySelector<HTMLElement>('.cb-option-list')!
	}

	template () {
		return html`
			<button
				class="cb-button"
				type="button"
				aria-label="${this.getAttribute('button-label') ?? 'Show options'}"
				aria-expanded="false"
				aria-controls="${this.id}-popover"
				popovertarget="${this.id}-popover"
				@keydown="${this.#handleButtonShortcuts}"
			>
				${this.value}
				<svg class="icon">
					<use xlink:href="#caret-down-icon"></use>
				</svg>
			</button>

			<div
				id="${this.id}-popover"
				class="cb-popover"
				popover
				@toggle="${this.#handleTogglePopover}"
			>
				<input
					class="cb-input text-input"
					aria-label="${this.getAttribute('input-label') ?? 'Search'}"
					autocomplete="off"
					autofocus
					role="combobox"
					aria-autocomplete="list"
					aria-expanded="true"
					aria-controls="${this.id}-listbox"
					.ariaActiveDescendantElement="${this.#ariaActiveDescendantElement}"
					.value="${this.query}"
					@input="${this.#handleSearchInput}"
					@keydown="${this.#handleSearchShortcuts}"
				>

				<div
					id="${this.id}-listbox"
					class="cb-option-list"
					role="listbox"
					aria-label="${this.getAttribute('listbox-label') ?? 'Options'}"
					@click="${this.#handleOptionClick}"
				>
					${this.#filteredOptions
						.map((option, index) => {
							return html`
								<button
									id="${this.id}-${index}"
									type="button"
									role="option"
									data-value="${option}"
									aria-selected="${String(option === this.value)}"
									?data-highlighted="${index === this.#highlightedOptionIndex}"
								>
									${
										option === this.value
											? html`<svg class="icon">
												<use xlink:href="#check-icon"></use>
											</svg>`
											: ''
									}
									${option}
								</button>
							`
						})}
				</div>

				<div class="cb-empty">
					<p>No matches</p>
				</div>
			</div>
		`
	}

	#getOptionByIndex (index: number): HTMLElement {
		const optionList = this.#optionList?.children ?? []
		const option = optionList[index]
		if (!(option instanceof HTMLElement)) {
			throw new Error(`<${this.tagName.toLowerCase()} id="${this.id}">: no option at index ${index}!`)
		}

		return option
	}

	#openPopover = () => {
		if (this.#button?.popoverTargetElement instanceof HTMLElement) {
			this.#button.popoverTargetElement.showPopover()
		}
	}

	#selectNeighboringOption = (direction: -1 | 1) => {
		const currentIndex = this.#options.findIndex((option) => option === this.value)
		const newIndex = Math.max(0, Math.min(currentIndex + direction, this.#options.length - 1))
		if (newIndex !== currentIndex) {
			this.value = this.#options[newIndex]!
		}
	}

	#handleButtonShortcuts = (event: KeyboardEvent) => {
		const key = getShortcutKey(event)
		const command = this.#buttonCommands[key]
		if (command) {
			command.action(event)
		}
	}

	#handleTogglePopover = (event: ToggleEvent) => {
		const isOpen = event.newState === 'open'

		this.#button!.ariaExpanded = String(isOpen)

		if (isOpen) {
			const selectedOptionIndex = this.#filteredOptions.indexOf(this.value)
			this.#highlightedOptionIndex = selectedOptionIndex
			const selectedOption = this.#getOptionByIndex(selectedOptionIndex)
			if (selectedOption) {
				scrollIntoViewIfNeeded(selectedOption, this.#optionList!)
			}
		}
	}

	#handleSearchInput = (event: Event) => {
		this.#highlightedOptionIndex = 0
		const input = event.target as HTMLInputElement
		this.query = input.value.trim().toLowerCase()
	}

	#handleSearchShortcuts = (event: KeyboardEvent) => {
		const key = getShortcutKey(event)
		const command = this.#searchInputCommands[key]
		if (command) {
			command.action(event)
		}
	}

	#moveOptionIndex = (event: KeyboardEvent, direction: -1 | 1) => {
		event.preventDefault()

		const filteredOptionCount = this.#filteredOptions.length
		this.#highlightedOptionIndex = Math.max(0, Math.min(this.#highlightedOptionIndex + direction, filteredOptionCount - 1))

		const highlightedOption = this.#ariaActiveDescendantElement
		if (highlightedOption instanceof HTMLElement) {
			scrollIntoViewIfNeeded(highlightedOption, this.#optionList!)
		}
	}

	#selectHighlightedOption = (event: KeyboardEvent) => {
		event.preventDefault()
		const highlightedOption = this.#ariaActiveDescendantElement
		if (highlightedOption instanceof HTMLElement) {
			this.#selectOption(highlightedOption.dataset.value!)
		}
	}

	#handleOptionClick = (event: Event) => {
		const option = event.composedPath().find((target) => target instanceof HTMLElement && target.role === 'option')
		if (option instanceof HTMLElement) {
			this.#selectOption(option.dataset.value!)
		}
	}

	#selectOption = (value: string) => {
		this.value = value

		this.#button?.focus()
		if (this.#button?.popoverTargetElement instanceof HTMLElement) {
			this.#button.popoverTargetElement.hidePopover()
		}
	}
}

/**
 * @returns the shortcut string (e.g. `"Ctrl+Shift+K"`) associated with a {@link KeyboardEvent}.
 */
function getShortcutKey (event: KeyboardEvent): string {
	return [
		event.metaKey ? 'Meta' : undefined,
		event.ctrlKey ? 'Ctrl' : undefined,
		event.altKey ? 'Alt' : undefined,
		event.shiftKey ? 'Shift' : undefined,
		event.key,
	]
		.filter((key) => key !== undefined)
		.join('+')
}

/**
 * Scroll `el` into its `parent`'s visible scroll box.
 */
function scrollIntoViewIfNeeded (el: HTMLElement, parent: HTMLElement) {
	const elBox = el.getBoundingClientRect()
	const elEnd = elBox.y + elBox.height
	const parentBox = parent.getBoundingClientRect()
	const parentEnd = parentBox.y + parentBox.height

	if (elBox.y < parentBox.y) {
		parent.scrollTop -= parentBox.y - elBox.y
	} else if (elEnd > parentEnd) {
		parent.scrollTop += elEnd - parentEnd
	}
}
