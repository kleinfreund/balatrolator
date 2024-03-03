const registeredContainers = new Set<Element>()

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
	}

	handleDragStart (event: DragEvent) {
		if (event.dataTransfer === null || !(event.target instanceof Element)) {
			return
		}

		if (this.container) {
			const draggedElIndex = Array.from(this.container.children).findIndex((el) => el === event.target)
			if (draggedElIndex !== -1) {
				event.dataTransfer.effectAllowed = 'move'
				event.dataTransfer.dropEffect = 'move'
				event.dataTransfer.setData('text/plain', String(draggedElIndex))
			}
		}
	}

	handleDragEnd (event: DragEvent) {
		const draggedEl = getDragEventData(event, this.container)
		if (draggedEl) {
			drop(this.container, draggedEl, event.clientX)
		}
	}

	handleDragOver (event: DragEvent) {
		if (getDragEventData(event, this.container)) {
			event.preventDefault()
		}
	}
}

function getDragEventData (event: DragEvent, container: Element): Element | null {
	if (event.dataTransfer === null || !(event.target instanceof Element)) {
		return null
	}

	const draggedElIndex = Number(event.dataTransfer.getData('text/plain'))
	if (!Number.isNaN(draggedElIndex) && container) {
		const draggedEl = container.children[draggedElIndex]

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
