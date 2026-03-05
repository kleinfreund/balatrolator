import { JokerName } from '#lib/types.ts'

/**
 * Resolves a joker to its “Copy” target if applicable
 *
 * **Example**: a “Blueprint” copying “Brainstorm” copying “Sock and Buskin” is resolved as “Sock and Buskin”.
 */
export function resolveJoker<Joker extends { name: JokerName, index: number }> (jokers: Joker[], target: Joker, visitedIndexes = new Set<number>()): Joker | undefined {
	// Immediately resolve non-copy joker
	if (target.name !== 'Blueprint' && target.name !== 'Brainstorm') {
		return target
	}

	const copyTarget = jokers.at(target.name === 'Blueprint' ? target.index + 1 : 0)
	if (copyTarget === undefined) {
		return undefined
	}

	// Cycle detection! Resolves to no joker if the copy jokers are in an infinite loop (e.g. Blueprint first, Brainstorm second)
	if (visitedIndexes.has(copyTarget.index)) {
		return undefined
	}

	visitedIndexes.add(copyTarget.index)

	return resolveJoker(jokers, copyTarget, visitedIndexes)
}
