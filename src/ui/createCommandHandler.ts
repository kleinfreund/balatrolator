import { getShortcutKey } from './getShortcutKey.ts'

export function createCommandHandler (commands: Record<string, CommandAction>) {
	return function (event: KeyboardEvent) {
		const key = getShortcutKey(event)
		const command = commands[key]
		if (command) {
			const { self = true, stop = true, action } = command
			if (self && event.target !== event.currentTarget) {
				return
			}

			if (stop) {
				event.stopPropagation()
			}

			action(event)
		}
	}
}

interface CommandAction {
	action: (event: KeyboardEvent) => void

	/**
	 * Call `event.stopPropagation` before invoking the command action.
	 *
	 * @default true
	 */
	stop?: boolean

	/**
	 * Only invoke the command action if `event.target` is the element onto which the command handler was attached.
	 *
	 * @default true
	 */
	self?: boolean
}
