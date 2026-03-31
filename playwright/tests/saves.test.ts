import { expect, test } from '@playwright/test'

test.describe('Saves', () => {
	test('displays save data', async ({ page }) => {
		await page.clock.setFixedTime(new Date('2026-03-29T15:16:00'))
		await page.goto('/?state=---1-1--5-___________-11*_*_*_*_*_*_*_*_*_*_*_*-50********_122********_126*****0*3**_69****12.25****_132********_119****5.5****-0*3***2**1*_0*3**4*2**1*4_0*3**2****_0*3**5*2***_0*3**5*2***_0*3***2***')

		const table = page.getByRole('table', { name: /^Saves$/ })
		const cells = table.getByRole('row').last().getByRole('cell')
		for (const [i, expectedCellContent] of ['Current hand (autosave)', 'Flush Five', '1.297e16', 'Mar 29, 2026, 15:16:00'].entries()) {
			await expect(cells.nth(i)).toContainText(expectedCellContent)
		}
	})

	test('can store and load saves', async ({ page }) => {
		await page.goto('/?state=---1-1--5-___________-11*_*_*_*_*_*_*_*_*_*_*_*-50********_122********_126*****0*3**_69****12.25****_132********_119****5.5****-0*3***2**1*_0*3**4*2**1*4_0*3**2****_0*3**5*2***_0*3**5*2***_0*3***2***')

		await expect(page.locator('[data-sc-score]')).toHaveText('12,972,158,342,922,240')

		const table = page.getByRole('table', { name: /^Saves$/ })
		await expect(table.getByRole('row')).toHaveCount(2)
		await expect(table).toContainText('Current hand (autosave)')

		await page.getByRole('textbox', { name: /^Save name$/ }).fill('e16 example')
		await page.getByRole('button', { name: /^Save$/ }).click()
		await expect(table.getByRole('row')).toHaveCount(3)
		await expect(table.getByRole('row').nth(1)).toContainText('e16 example')
		await expect(table.getByRole('row').nth(2)).toContainText('Current hand (autosave)')

		await page.getByRole('button', { name: /^Remove playing card$/ }).first().click()
		await expect(page.locator('[data-sc-score]')).toHaveText('23,713,925,824,512')

		await page.getByRole('button', { name: /^Load$/ }).last().click()
		await expect(page.locator('[data-sc-score]')).toHaveText('12,972,158,342,922,240')

		await page.reload()
		const table2 = page.getByRole('table', { name: /^Saves$/ })
		await expect(table2.getByRole('row')).toHaveCount(3)
		await expect(table2.getByRole('row').nth(1)).toContainText('Current hand (autosave)')
		await expect(table2.getByRole('row').nth(2)).toContainText('e16 example')
	})
})
