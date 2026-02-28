import { expect, test } from '@playwright/test'

test.describe('Round data', () => {
	test('continuously updates URL with current state', async ({ page }) => {
		await page.goto('/')

		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--')

		const hands = page.getByRole('spinbutton', { name: /^Hands$/ })
		await hands.fill('1')
		await hands.blur()
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '1----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--')

		const discards = page.getByRole('spinbutton', { name: /^Discards$/ })
		await discards.fill('2')
		await discards.blur()
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '1-2---1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--')

		const money = page.getByRole('spinbutton', { name: /^Money$/ })
		await money.fill('3')
		await money.blur()
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '1-2-3--1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--')

		// Playwright doesn't support form-associated elements, yet, so I have to use `page.locator` here: https://github.com/microsoft/playwright/issues/37806
		const blind = page.locator('[name="blindName"]')
		const blindButton = blind.getByRole('button', { name: /^Show blind options$/ })
		await blindButton.click()
		const blindInput = blind.getByRole('combobox', { name: /^Filter blinds$/ })
		await expect(blindInput).toBeFocused()
		const blindOptions = blind.getByRole('listbox', { name: /^Blinds$/ })
		await expect(blindOptions.getByRole('option')).toHaveCount(30)
		await blindInput.fill('w')
		await expect(blindOptions.getByRole('option')).toHaveCount(4)
		await page.keyboard.press('ArrowDown')
		await page.keyboard.press('Enter')
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '1-2-3-6-1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--')

		const deck = page.locator('[name="deck"]')
		const deckButton = deck.getByRole('button', { name: /^Show deck options$/ })
		await deckButton.click()
		const deckInput = deck.getByRole('combobox', { name: /^Filter decks$/ })
		await expect(deckInput).toBeFocused()
		const deckOptions = deck.getByRole('listbox', { name: /^Decks$/ })
		await expect(deckOptions.getByRole('option')).toHaveCount(16)
		await deckInput.fill('n')
		await expect(deckOptions.getByRole('option')).toHaveCount(6)
		await page.keyboard.press('ArrowDown')
		await page.keyboard.press('Enter')
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '1-2-3-6-1-6-5-___________-*_*_*_*_*_*_*_*_*_*_*_*--')

		const jokerSlots = page.getByRole('spinbutton', { name: /^Joker slots$/ })
		await jokerSlots.fill('4')
		await jokerSlots.blur()
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '1-2-3-6-1-6-4-___________-*_*_*_*_*_*_*_*_*_*_*_*--')
	})
})

test.describe('Levels', () => {
	test('continuously updates URL with current state', async ({ page }) => {
		await page.goto('/')

		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--')

		for (const { groupName, state } of [
			{
				groupName: /^Flush Five$/,
				state: '----1--5-___________-2*2_*_*_*_*_*_*_*_*_*_*_*--',
			},
			{
				groupName: /^Flush House$/,
				state: '----1--5-___________-2*2_2*2_*_*_*_*_*_*_*_*_*_*--',
			},
			{
				groupName: /^Five of a Kind$/,
				state: '----1--5-___________-2*2_2*2_2*2_*_*_*_*_*_*_*_*_*--',
			},
			{
				groupName: /^Straight Flush$/,
				state: '----1--5-___________-2*2_2*2_2*2_2*2_*_*_*_*_*_*_*_*--',
			},
			{
				groupName: /^Four of a Kind$/,
				state: '----1--5-___________-2*2_2*2_2*2_2*2_2*2_*_*_*_*_*_*_*--',
			},
			{
				groupName: /^Full House$/,
				state: '----1--5-___________-2*2_2*2_2*2_2*2_2*2_2*2_*_*_*_*_*_*--',
			},
			{
				groupName: /^Flush$/,
				state: '----1--5-___________-2*2_2*2_2*2_2*2_2*2_2*2_2*2_*_*_*_*_*--',
			},
			{
				groupName: /^Straight$/,
				state: '----1--5-___________-2*2_2*2_2*2_2*2_2*2_2*2_2*2_2*2_*_*_*_*--',
			},
			{
				groupName: /^Three of a Kind$/,
				state: '----1--5-___________-2*2_2*2_2*2_2*2_2*2_2*2_2*2_2*2_2*2_*_*_*--',
			},
			{
				groupName: /^Two Pair$/,
				state: '----1--5-___________-2*2_2*2_2*2_2*2_2*2_2*2_2*2_2*2_2*2_2*2_*_*--',
			},
			{
				groupName: /^Pair$/,
				state: '----1--5-___________-2*2_2*2_2*2_2*2_2*2_2*2_2*2_2*2_2*2_2*2_2*2_*--',
			},
			{
				groupName: /^High Card$/,
				state: '----1--5-___________-2*2_2*2_2*2_2*2_2*2_2*2_2*2_2*2_2*2_2*2_2*2_2*2--',
			},
		]) {
			const fieldset = page.getByRole('group', { name: groupName })
			const level = fieldset.getByRole('spinbutton', { name: /^Level$/ })
			await level.fill('2')
			const plays = fieldset.getByRole('spinbutton', { name: /^Number of plays$/ })
			await plays.fill('2')
			await plays.blur()
			await expect(page).toHaveURL((url) => url.searchParams.get('state') === state)
		}
	})
})

test.describe('Jokers', () => {
	test('continuously updates URL with current state', async ({ page }) => {
		await page.goto('/')

		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--')

		await page.getByRole('button', { name: /^Add joker$/ }).click()
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*-25*****0*0*1*-')

		const name = page.locator('[name="joker-name-0"]')
		const nameButton = name.getByRole('button', { name: /^Show joker options$/ })
		await nameButton.click()
		const nameInput = name.getByRole('combobox', { name: /^Filter jokers$/ })
		await expect(nameInput).toBeFocused()
		const nameOptions = name.getByRole('listbox', { name: /^Jokers$/ })
		await expect(nameOptions.getByRole('option')).toHaveCount(150)
		await nameInput.fill('cr')
		await expect(nameOptions.getByRole('option')).toHaveCount(5)
		await page.keyboard.press('ArrowDown')
		await page.keyboard.press('Enter')
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*-14*****0*0*1*-')

		const count = page.getByRole('spinbutton', { name: /^Count$/ })
		await count.fill('2')
		await count.blur()
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*-14*****0*0*1*2-')

		const edition = page.getByRole('combobox', { name: /^Edition$/ })
		await edition.selectOption('Foil')
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*-14*1****0*0*1*2-')
	})
})

test.describe('Hand', () => {
	test('continuously updates URL with current state', async ({ page }) => {
		await page.goto('/')

		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--')

		await page.getByRole('button', { name: /^Add card$/ }).click()
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--0*0*****1*')

		const count = page.getByRole('spinbutton', { name: /^Count$/ })
		await count.fill('2')
		await count.blur()
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--0*0*****1*2')

		const rank = page.getByRole('combobox', { name: /^Rank$/ })
		await rank.selectOption('10')
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--4*0*****1*2')

		const suit = page.getByRole('combobox', { name: /^Suit$/ })
		await suit.selectOption('Spades')
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--4*1*****1*2')

		const edition = page.getByRole('combobox', { name: /^Edition$/ })
		await edition.selectOption('Foil')
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--4*1*1****1*2')

		const enhancement = page.getByRole('combobox', { name: /^Enhancement$/ })
		await enhancement.selectOption('Mult')
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--4*1*1*2***1*2')

		const seal = page.getByRole('combobox', { name: /^Seal$/ })
		await seal.selectOption('Gold')
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--4*1*1*2*1**1*2')
	})
})
