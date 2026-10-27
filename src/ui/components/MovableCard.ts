import { BaseElement } from './BaseElement.ts'

const registeredContainers = new Set<Element>()
let isDragging = false
const FORMAT_PREFIX = 'dragged-element-id:'

let lastDraggedElId: string | null = null

export class MovableCard extends BaseElement {
	#container: HTMLElement | undefined

	constructor () {
		super()

		this.addEventListener('dragstart', this.#handleDragStart)
		this.addEventListener('dragend', this.#handleDragEnd)
		this.addEventListener('drop', this.#handleDrop)
	}

	connectedCallback () {
		if (!this.isConnected) {
			return
		}

		const container = this.parentElement
		if (!container) {
			throw new Error(`<${this.tagName.toLowerCase()} id="${this.id}"> “parentElement” is not available.`)
		}
		this.#container = container

		if (!registeredContainers.has(this.#container)) {
			registeredContainers.add(this.#container)
			this.#container.addEventListener('dragenter', this.#handleDragOver)
			this.#container.addEventListener('dragover', this.#handleDragOver)
		}
	}

	disconnectedCallback () {
		if (this.#container) {
			registeredContainers.delete(this.#container)
			this.#container.removeEventListener('dragenter', this.#handleDragOver)
			this.#container.removeEventListener('dragover', this.#handleDragOver)
			this.#container = undefined
		}
	}

	moveToStart = () => {
		if (
			this.#container?.firstElementChild instanceof BaseElement &&
			this.#container.firstElementChild !== this
		) {
			this.#move(this.#container.firstElementChild, 'beforebegin')
		}
	}

	moveToEnd = () => {
		if (
			this.#container?.lastElementChild instanceof BaseElement &&
			this.#container.lastElementChild !== this
		) {
			this.#move(this.#container.lastElementChild, 'afterend')
		}
	}

	swapLeft = () => {
		if (this.previousElementSibling instanceof BaseElement) {
			this.#move(this.previousElementSibling, 'beforebegin')
		}
	}

	swapRight = () => {
		if (this.nextElementSibling instanceof BaseElement) {
			this.#move(this.nextElementSibling, 'afterend')
		}
	}

	#move (referenceElement: BaseElement, where: InsertPosition) {
		referenceElement.insertAdjacentElement(where, this)
		this.focus()

		// Updates the “disabled” state of the “Move left”/“Move right” buttons.
		// Re-rendering only `referenceElement` and `this` is only sufficient when swapping adjacent elements. Otherwise, up to four elements must be re-rendered (e.g. when moving the last element to the start while there are at least four elements).
		for (const element of this.parentElement!.children) {
			if (element instanceof BaseElement) {
				element.queueRender()
			}
		}
	}

	#handleDragStart = (event: DragEvent) => {
		if (event.dataTransfer === null || !(event.target instanceof Element) || !this.#container) {
			return
		}

		const draggedEl = Array.from(this.#container.children).find((el) => el === event.target)
		if (draggedEl) {
			draggedEl.setAttribute('is-being-dragged', '')
			isDragging = true
			event.dataTransfer.effectAllowed = 'move'
			event.dataTransfer.dropEffect = 'move'
			// Dirty workaround: Store the drag'n'drop data in the format to get around browser security measures that prevent reading the data in event types other than `drop`.
			event.dataTransfer.setData(`${FORMAT_PREFIX}${draggedEl.id}`, draggedEl.id)
		}
	}

	#handleDragEnd = (event: DragEvent) => {
		if (!this.#container) {
			return
		}

		const draggedEl = getDragEventData(event, this.#container)
		if (draggedEl) {
			draggedEl.removeAttribute('is-being-dragged')

			// Temporarily disable animations during rearranging of elements to avoid animation glitches. The elements are `transform`-moved to their future positions while dragging them around and since the `transform` property is subject to a `transition` animation, actually moving them around in the DOM would “double” the amount by which the element is moved. The `transform` movement is subsequently reset which would animate due to the animation leading to the animation glitch.
			callWithDisabledContainerAnimations(this.#container, (container) => {
				const { rearrange } = getShiftedElements(container, draggedEl, event.clientX)
				rearrange()
			})

			for (const node of this.#container.children) {
				if (node instanceof BaseElement) {
					node.style.setProperty('--shift-by', '0')
					node.queueRender()
				}
			}
			isDragging = false
		}
	}

	#handleDragOver = (event: DragEvent) => {
		if (!this.#container) {
			return
		}

		const draggedEl = getDragEventData(event, this.#container)
		if (draggedEl) {
			// **Allow** dropping off an element to occur
			event.preventDefault()
			// Safari workaround: Store the drag event data during the dragover event to work around an issue in Safari that makes it impossible to read `event.dataTransfer.types` during the dragend event.
			lastDraggedElId = draggedEl.id

			const { elements } = getShiftedElements(this.#container, draggedEl, event.clientX)
			for (const { element, shiftBy } of elements) {
				element.style.setProperty('--shift-by', String(shiftBy))
			}
		}
	}

	#handleDrop = (event: DragEvent) => {
		if (isDragging) {
			event.preventDefault()
		}
	}
}

function getDragEventData (event: DragEvent, container: Element): HTMLElement | null {
	if (event.dataTransfer === null || !(event.target instanceof Element)) {
		return null
	}

	// Dirty workaround: Read data from the format key instead of using `getData`.
	const format = event.dataTransfer.types.find((format) => format.startsWith(FORMAT_PREFIX))
	const draggedElId = format ? format.substring(FORMAT_PREFIX.length) : lastDraggedElId
	lastDraggedElId = null

	if (draggedElId && container) {
		const draggedEl = Array.from(container.children).find((el) => el.id === draggedElId)
		if (draggedEl instanceof HTMLElement) {
			return draggedEl
		}
	}

	return null
}

function getShiftedElements (container: HTMLElement, draggedEl: HTMLElement, dragClientX: number): { elements: { element: HTMLElement, shiftBy: number }[], rearrange: () => void } {
	const children = Array.from(container.children) as HTMLElement[]
	const draggedElIndex = children.findIndex((el) => el === draggedEl)
	// Determining the insertion coordinate for the element …
	// The drop target X coordinate relative to the container.
	const dropTargetX = dragClientX - container.offsetLeft

	for (const [index, el] of children.entries()) {
		// The element's X coordinate relative to the container.
		const elStartX = el.offsetLeft - container.offsetLeft
		// The element's halfway point X coordinate relative the container.
		const halfwayPointX = elStartX + el.clientWidth / 2

		if (dropTargetX < halfwayPointX) {
			const rearrange = () => {
				el.insertAdjacentElement('beforebegin', draggedEl)
			}

			let shiftParameters: ShiftParameters
			if (draggedElIndex + 1 < index) {
				// Dragging the element to the right so some elements need to shift to the left.
				shiftParameters = { direction: -1, shiftStart: draggedElIndex + 1, shiftEnd: index }
			} else if (draggedElIndex > index) {
				// Dragging the element to the left so some elements need to shift to the right.
				shiftParameters = { direction: 1, shiftStart: index, shiftEnd: draggedElIndex }
			} else {
				// The element remains in place so no elements need to shift.
				shiftParameters = { direction: 0, shiftStart: -1, shiftEnd: -1 }
			}

			return {
				elements: children.map((element, index) => getShiftBy(element, index, draggedEl, shiftParameters )),
				rearrange,
			}
		}
	}

	// Dragging the element to the end so the elements following it need to shift to the left.
	const shiftParameters: ShiftParameters = { direction: -1, shiftStart: draggedElIndex + 1, shiftEnd: children.length }
	return {
		elements: children.map((element, index) => getShiftBy(element, index, draggedEl, shiftParameters )),
		rearrange: () => {
			container.insertAdjacentElement('beforeend', draggedEl)
		},
	}
}

interface ShiftParameters {
	direction: -1 | 0 | 1
	shiftStart: number
	shiftEnd: number
}

function getShiftBy (
	element: HTMLElement,
	index: number,
	draggedEl: HTMLElement,
	{ direction, shiftStart, shiftEnd }: ShiftParameters,
) {
	let shiftBy: number
	if (element === draggedEl) {
		// Invert the shift direction for the dragged element as it shifts the opposite way.
		shiftBy = (-1 * direction) * (shiftEnd - shiftStart)
	} else if (shiftStart <= index && index < shiftEnd) {
		shiftBy = direction
	} else {
		shiftBy = 0
	}

	return { element, shiftBy }
}

/**
 * Call `callback` while `container` has the `disable-animations` attribute for _one_ animation frame.
 *
 * @param container
 * @param callback
 */
function callWithDisabledContainerAnimations (container: HTMLElement, callback: (container: HTMLElement) => void) {
	container.setAttribute('disable-animations', '')
	callback(container)
	window.requestAnimationFrame(() => {
		container.removeAttribute('disable-animations')
	})
}
