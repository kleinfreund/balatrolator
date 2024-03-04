const registeredContainers = new Set<Element>()
let isDragging = false

export class DraggableCard extends HTMLElement {
	container: HTMLElement

	constructor () {
		super()

		const container = this.closest('[data-drop-zone]')
		if (!container) {
			throw new Error(`${this.tagName} is a DraggableCard but is not an descendant of an element with the “data-drop-zone” attribute.`)
		}
		this.container = container as HTMLElement

		if (!registeredContainers.has(this.container)) {
			registeredContainers.add(this.container)

			this.container.addEventListener('dragenter', this.handleDragOver)
			this.container.addEventListener('dragover', this.handleDragOver)
		}

		this.addEventListener('dragstart', this.handleDragStart)
		this.addEventListener('dragend', this.handleDragEnd)
		this.addEventListener('drop', this.handleDrop)
	}

	handleDragStart = (event: DragEvent) => {
		if (event.dataTransfer === null || !(event.target instanceof Element)) {
			return
		}

		const draggedEl = Array.from(this.container.children).find((el) => el === event.target)
		if (draggedEl) {
			isDragging = true
			event.dataTransfer.effectAllowed = 'move'
			event.dataTransfer.dropEffect = 'move'
			event.dataTransfer.setData('text/plain', draggedEl.id)
		}
	}

	handleDragEnd = (event: DragEvent) => {
		const draggedEl = getDragEventData(event, this.container)
		if (draggedEl) {
			drop(this.container, draggedEl, event.clientX)
			isDragging = false
		}
	}

	handleDragOver = (event: DragEvent) => {
		if (getDragEventData(event, this.container)) {
			// **Allow** dropping off an element to occur
			event.preventDefault()
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

	const draggedElId = event.dataTransfer.getData('text/plain')
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
