/**
 * @returns the shortcut string (e.g. `"Ctrl+Shift+K"`) associated with a {@link KeyboardEvent}.
 */
export function getShortcutKey (event: KeyboardEvent): string {
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
