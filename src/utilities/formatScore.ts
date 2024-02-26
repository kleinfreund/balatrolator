export function formatScore (score: number): string {
	if (score < 1_000_000_000_000) {
		return new Intl.NumberFormat('en', { maximumFractionDigits: 0 }).format(score)
	} else {
		const almostCorrect = new Intl.NumberFormat('en', {
			notation: 'scientific',
			maximumSignificantDigits: 4,
		}).format(score).toLowerCase()
		const [prefix, suffix] = almostCorrect.split('e')
		return prefix!.padEnd(5, '0') + 'e' + suffix!
	}
}
