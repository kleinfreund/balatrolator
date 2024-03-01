import { Joker, State } from '#lib/types.js'

/**
 * Resolves a joker to its “Copy” target if applicable
 *
 * **Example**: a “Blueprint” copying “Brainstorm” copying “Sock and Buskin” is resolved as “Sock and Buskin”.
 */
export function resolveJoker (state: State, target: Joker | undefined, visitedIndexes = new Set<number>()): Joker | undefined {
	if (!target) {
		return undefined
	}

	let copyTarget: Joker | undefined
	if (target.name === 'Blueprint') {
		copyTarget = state.jokers[target.index + 1]
	} else if (target.name === 'Brainstorm') {
		copyTarget = state.jokers[0]
	}

	if (copyTarget) {
		// Cycle detection! Resolves to no joker if the copy jokers are in an infinite loop (e.g. Blueprint first, Brainstorm second)
		if (visitedIndexes.has(copyTarget.index)) {
			return undefined
		}

		visitedIndexes.add(copyTarget.index)

		return resolveJoker(state, copyTarget, visitedIndexes)
	}


	return target
}
