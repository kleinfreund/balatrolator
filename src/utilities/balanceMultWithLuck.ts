import type { Luck } from '#lib/types.js'

/**
 * Balances a mult value (either +Mult or xMult) that's subject to a probabilistic effect (e.g. Bloodstone, lucky card).
 *
 * For +Mult (as indicated by `mode === 'plus'`), the mult value is balanced in the range [0, mult] (e.g. [0, 20] for a lucky card). For xMult (as indicated by `mode === 'times'`), the mult value is balanced in the range [1, mult] (e.g. [1, 2] for Bloodstone).
 *
 * The probability of an effect (i.e. “1 in $denominator chance”) is used to determine the _average_ mult value. For example, with lucky card's 1 in 5 chance, the average value used would be 1/5*20 = 4. The numerator is raised by the number of “Oops! All 6s” jokers. Notably, having “Oops! All 6s” four times would guarantee lucky cards to trigger because their probability would be 5/5 = 1.
 *
 * The `luck` parameter modifies the result by either implying “no luck” (in order words: minimum luck or a probability of 0) or “all luck” (in other words: maximum luck or a probability of 1). A number of “Oops! All 6s” jokers resulting in a probability of 1 forces “all luck” even if the `luck` parameter is not “all luck”.
 */
export function balanceMultWithLuck (mult: number, oopses: number, denominator: number, luck: Luck, mode: 'times' | 'plus'): number {
	const neutralElement = mode === 'times' ? 1 : 0
	const minimumNumerator = Math.max(0, Math.min(oopses + 1, denominator))

	let numerator = minimumNumerator
	if (luck === 'all') {
		numerator = denominator
	} else if (luck === 'none' && minimumNumerator < denominator) {
		numerator = 0
	}

	return neutralElement + Math.min(numerator, denominator)*(mult - neutralElement)/denominator
}
