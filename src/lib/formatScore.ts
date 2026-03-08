import { Decimal } from 'decimal.js'

export function formatScore (score: string): string {
	if (score.includes('e+')) {
		const [prefix, suffix] = score.split('e+') as [string, string]
		const number = Number(prefix.substring(0, 6))

		return `${number.toFixed(3)}e${suffix}`
	}

	const bigNumber = Decimal(score)
	if (bigNumber.lessThan(10_000)) {
		return new Intl.NumberFormat('en', { maximumFractionDigits: 1 })
			.format(bigNumber.toNumber())
	}

	if (bigNumber.lessThan(1_000_000_000_000)) {
		return new Intl.NumberFormat('en', { maximumFractionDigits: 0 })
			.format(bigNumber.toNumber())
	}

	const decimalValue = bigNumber.div(Math.pow(10, score.length - 1))
	const roundedValue = decimalValue.toPrecision(4).toString()
	const prefix = roundedValue + (roundedValue.includes('.') ? '' : '.')

	return `${prefix.padEnd(5, '0')}e${String(score.length - 1)}`
}
