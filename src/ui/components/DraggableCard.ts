const registeredContainers = new Set<Element>()
let isDragging = false
const FORMAT_PREFIX = 'dragged-element-id:'

let lastDraggedElId: string | null = null

export class DraggableCard extends HTMLElement {
	container: HTMLElement | undefined

	constructor () {
		super()

		this.addEventListener('dragstart', this.handleDragStart)
		this.addEventListener('dragend', this.handleDragEnd)
		this.addEventListener('drop', this.handleDrop)
	}

	connectedCallback () {
		if (!this.isConnected) {
			return
		}

		const container = this.closest<HTMLElement>('[data-drop-zone]')
		if (!container) {
			throw new Error(`${this.tagName} is a DraggableCard but is not an descendant of an element with the “data-drop-zone” attribute.`)
		}
		this.container = container

		if (!registeredContainers.has(this.container)) {
			registeredContainers.add(this.container)

			this.container.addEventListener('dragenter', this.handleDragOver)
			this.container.addEventListener('dragover', this.handleDragOver)
		}
	}

	disconnectedCallback () {
		if (this.container) {
			registeredContainers.delete(this.container)
		}
		this.container = undefined
	}

	handleDragStart = (event: DragEvent) => {
		if (event.dataTransfer === null || !(event.target instanceof Element) || !this.container) {
			return
		}

		const draggedEl = Array.from(this.container.children).find((el) => el === event.target)
		if (draggedEl) {
			isDragging = true
			event.dataTransfer.effectAllowed = 'move'
			event.dataTransfer.dropEffect = 'move'
			// Dirty workaround: Store the drag'n'drop data in the format to get around browser security measures that prevent reading the data in event types other than `drop`.
			event.dataTransfer.setData(`${FORMAT_PREFIX}${draggedEl.id}`, draggedEl.id)
		}
	}

	handleDragEnd = (event: DragEvent) => {
		if (!this.container) {
			return
		}

		const draggedEl = getDragEventData(event, this.container)
		if (draggedEl) {
			drop(this.container, draggedEl, event.clientX)
			isDragging = false
		}
	}

	handleDragOver = (event: DragEvent) => {
		if (!this.container) {
			return
		}

		const draggedEl = getDragEventData(event, this.container)
		if (draggedEl) {
			// **Allow** dropping off an element to occur
			event.preventDefault()
			// Safari workaround: Store the drag event data during the dragover event to work around an issue in Safari that makes it impossible to read `event.dataTransfer.types` during the dragend event.
			lastDraggedElId = draggedEl.id
		}
	}

	handleDrop = (event: DragEvent) => {
		if (isDragging) {
			event.preventDefault()
		}
	}
}

function getDragEventData (event: DragEvent, container: Element): Element | null {
	if (event.dataTransfer === null || !(event.target instanceof Element)) {
		return null
	}

	// Dirty workaround: Read data from the format key instead of using `getData`.
	const format = event.dataTransfer.types.find((format) => format.startsWith(FORMAT_PREFIX))
	const draggedElId = format ? format.substring(FORMAT_PREFIX.length) : lastDraggedElId
	lastDraggedElId = null

	if (draggedElId && container) {
		const draggedEl = Array.from(container.children).find((el) => el.id === draggedElId)

		if (draggedEl) {
			return draggedEl
		}
	}

	return null
}

function drop (container: Element, draggedEl: Element, dragClientX: number) {
	// Determining the insertion coordinate for the element …
	const containerRect = container.getBoundingClientRect()
	// The drop target X coordinate relative to the container.
	const dropTargetX = dragClientX - containerRect.left

	for (const el of container.children) {
		const { left, width } = el.getBoundingClientRect()
		// The element's X coordinate relative to the container.
		const elStartX = left - containerRect.left
		// The element's halfway point X coordinate relative the container.
		const halfwayPointX = elStartX + width / 2

		if (dropTargetX < halfwayPointX) {
			el.insertAdjacentElement('beforebegin', draggedEl)
			return
		}
	}

	container.insertAdjacentElement('beforeend', draggedEl)
}
