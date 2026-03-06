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

		const name = page.locator('[name^="joker-name-"]')
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

		await page.getByRole('combobox', { name: /^Edition$/ }).selectOption('Foil')
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*-14*1****0*0*1*2-')
	})

	test('show/hide dependent fields when switching joker', async ({ page }) => {
		await page.goto('/')

		await page.getByRole('button', { name: /^Add joker$/ }).click()
		const jokerCard = page.locator('joker-card')
		await expect(jokerCard.getByRole('combobox', { name: /^Suit$/ })).toBeHidden()
		await expect(jokerCard.getByRole('combobox', { name: /^Rank$/ })).toBeHidden()
		await expect(jokerCard.getByRole('spinbutton', { name: /^\+Chips$/ })).toBeHidden()
		await expect(jokerCard.getByRole('spinbutton', { name: /^xMult$/ })).toBeHidden()
		await expect(jokerCard.getByRole('checkbox', { name: /^Active\?$/ })).toBeHidden()
		await expect(jokerCard.getByRole('spinbutton', { name: /^\+Mult$/ })).toBeHidden()

		const name = jokerCard.locator('[name^="joker-name-"]')
		const nameButton = name.getByRole('button', { name: /^Show joker options$/ })
		await nameButton.click()
		await name.getByRole('option', { name: /^The Idol$/ }).click()
		await expect(jokerCard.getByRole('combobox', { name: /^Suit$/ })).toBeVisible()
		await expect(jokerCard.getByRole('combobox', { name: /^Rank$/ })).toBeVisible()
		await expect(jokerCard.getByRole('spinbutton', { name: /^\+Chips$/ })).toBeHidden()
		await expect(jokerCard.getByRole('spinbutton', { name: /^xMult$/ })).toBeHidden()
		await expect(jokerCard.getByRole('checkbox', { name: /^Active\?$/ })).toBeHidden()
		await expect(jokerCard.getByRole('spinbutton', { name: /^\+Mult$/ })).toBeHidden()

		await nameButton.click()
		await name.getByRole('option', { name: /^Blue Joker$/ }).click()
		await expect(jokerCard.getByRole('combobox', { name: /^Suit$/ })).toBeHidden()
		await expect(jokerCard.getByRole('combobox', { name: /^Rank$/ })).toBeHidden()
		await expect(jokerCard.getByRole('spinbutton', { name: /^\+Chips$/ })).toBeVisible()
		await expect(jokerCard.getByRole('spinbutton', { name: /^xMult$/ })).toBeHidden()
		await expect(jokerCard.getByRole('checkbox', { name: /^Active\?$/ })).toBeHidden()
		await expect(jokerCard.getByRole('spinbutton', { name: /^\+Mult$/ })).toBeHidden()

		await nameButton.click()
		await name.getByRole('option', { name: /^Campfire$/ }).click()
		await expect(jokerCard.getByRole('combobox', { name: /^Suit$/ })).toBeHidden()
		await expect(jokerCard.getByRole('combobox', { name: /^Rank$/ })).toBeHidden()
		await expect(jokerCard.getByRole('spinbutton', { name: /^\+Chips$/ })).toBeHidden()
		await expect(jokerCard.getByRole('spinbutton', { name: /^xMult$/ })).toBeVisible()
		await expect(jokerCard.getByRole('checkbox', { name: /^Active\?$/ })).toBeHidden()
		await expect(jokerCard.getByRole('spinbutton', { name: /^\+Mult$/ })).toBeHidden()

		await nameButton.click()
		await name.getByRole('option', { name: /^Card Sharp$/ }).click()
		await expect(jokerCard.getByRole('combobox', { name: /^Suit$/ })).toBeHidden()
		await expect(jokerCard.getByRole('combobox', { name: /^Rank$/ })).toBeHidden()
		await expect(jokerCard.getByRole('spinbutton', { name: /^\+Chips$/ })).toBeHidden()
		await expect(jokerCard.getByRole('spinbutton', { name: /^xMult$/ })).toBeHidden()
		await expect(jokerCard.getByRole('checkbox', { name: /^Active\?$/ })).toBeVisible()
		await expect(jokerCard.getByRole('spinbutton', { name: /^\+Mult$/ })).toBeHidden()

		await nameButton.click()
		await name.getByRole('option', { name: /^Ceremonial Dagger$/ }).click()
		await expect(jokerCard.getByRole('combobox', { name: /^Suit$/ })).toBeHidden()
		await expect(jokerCard.getByRole('combobox', { name: /^Rank$/ })).toBeHidden()
		await expect(jokerCard.getByRole('spinbutton', { name: /^\+Chips$/ })).toBeHidden()
		await expect(jokerCard.getByRole('spinbutton', { name: /^xMult$/ })).toBeHidden()
		await expect(jokerCard.getByRole('checkbox', { name: /^Active\?$/ })).toBeHidden()
		await expect(jokerCard.getByRole('spinbutton', { name: /^\+Mult$/ })).toBeVisible()
	})

	test('can be duplicated', async ({ page }) => {
		await page.goto('/?state=----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*-14*1****0*0*1*2-')

		await page.getByRole('button', { name: /^Duplicate joker$/ }).click()
		const dialog = page.getByRole('dialog', { name: /^Duplicate joker\?$/ })
		await dialog.getByRole('spinbutton', { name: /^Number of copies$/ }).fill('2')
		await dialog.getByRole('button', { name: /^Ok$/ }).click()
		const jokerCards = page.locator('joker-card')
		await expect(jokerCards).toHaveCount(3)
		for (const jokerCard of await jokerCards.all()) {
			await expect(jokerCard.getByRole('spinbutton', { name: /^Count$/ })).toHaveValue('2')
			await expect(jokerCard.getByRole('combobox', { name: /^Edition$/ })).toHaveValue('Foil')
		}
	})

	test('can be re-arranged with left/right buttons', async ({ page }) => {
		await page.goto('/?state=----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*-126*****2*3*1*_132*****0*0*1*_69****12.4*0*0*1*-')

		const cards = page.locator('joker-card')
		await expect(cards.nth(0).locator('[name^="joker-name-"]')).toHaveJSProperty('value', 'The Idol')
		await expect(cards.nth(0).getByRole('combobox', { name: /^Rank$/ })).toHaveValue('Queen')
		await expect(cards.nth(0).getByRole('button', { name: /^Move joker left$/ })).toHaveAttribute('disabled')
		await expect(cards.nth(0).getByRole('button', { name: /^Move joker right$/ })).not.toHaveAttribute('disabled')

		await expect(cards.nth(1).locator('[name^="joker-name-"]')).toHaveJSProperty('value', 'The Family')
		await expect(cards.nth(1).getByRole('button', { name: /^Move joker left$/ })).not.toHaveAttribute('disabled')
		await expect(cards.nth(1).getByRole('button', { name: /^Move joker right$/ })).not.toHaveAttribute('disabled')

		await expect(cards.nth(2).locator('[name^="joker-name-"]')).toHaveJSProperty('value', 'Hologram')
		await expect(cards.nth(2).getByRole('spinbutton', { name: /^xMult$/ })).toHaveValue('12.4')
		await expect(cards.nth(2).getByRole('button', { name: /^Move joker left$/ })).not.toHaveAttribute('disabled')
		await expect(cards.nth(2).getByRole('button', { name: /^Move joker right$/ })).toHaveAttribute('disabled')
		await cards.nth(0).getByRole('button', { name: /^Move joker right$/ }).click()

		const cards2 = page.locator('joker-card')
		await expect(cards2.nth(0).locator('[name^="joker-name-"]')).toHaveJSProperty('value', 'The Family')
		await expect(cards2.nth(0).getByRole('button', { name: /^Move joker left$/ })).toHaveAttribute('disabled')
		await expect(cards2.nth(0).getByRole('button', { name: /^Move joker right$/ })).not.toHaveAttribute('disabled')

		await expect(cards2.nth(1).locator('[name^="joker-name-"]')).toHaveJSProperty('value', 'The Idol')
		await expect(cards2.nth(1).getByRole('combobox', { name: /^Rank$/ })).toHaveValue('Queen')
		await expect(cards2.nth(1).getByRole('button', { name: /^Move joker left$/ })).not.toHaveAttribute('disabled')
		await expect(cards2.nth(1).getByRole('button', { name: /^Move joker right$/ })).not.toHaveAttribute('disabled')

		await expect(cards2.nth(2).locator('[name^="joker-name-"]')).toHaveJSProperty('value', 'Hologram')
		await expect(cards2.nth(2).getByRole('spinbutton', { name: /^xMult$/ })).toHaveValue('12.4')
		await expect(cards2.nth(2).getByRole('button', { name: /^Move joker left$/ })).not.toHaveAttribute('disabled')
		await expect(cards2.nth(2).getByRole('button', { name: /^Move joker right$/ })).toHaveAttribute('disabled')
		await expect(cards2.nth(2).getByRole('button', { name: /^Move joker left$/ })).not.toHaveAttribute('disabled')
		await expect(cards2.nth(2).getByRole('button', { name: /^Move joker right$/ })).toHaveAttribute('disabled')
		await cards2.nth(2).getByRole('button', { name: /^Move joker left$/ }).click()

		const cards3 = page.locator('joker-card')
		await expect(cards3.nth(0).locator('[name^="joker-name-"]')).toHaveJSProperty('value', 'The Family')
		await expect(cards3.nth(0).getByRole('button', { name: /^Move joker left$/ })).toHaveAttribute('disabled')
		await expect(cards3.nth(0).getByRole('button', { name: /^Move joker right$/ })).not.toHaveAttribute('disabled')

		await expect(cards3.nth(1).locator('[name^="joker-name-"]')).toHaveJSProperty('value', 'Hologram')
		await expect(cards3.nth(1).getByRole('spinbutton', { name: /^xMult$/ })).toHaveValue('12.4')
		await expect(cards3.nth(1).getByRole('button', { name: /^Move joker left$/ })).not.toHaveAttribute('disabled')
		await expect(cards3.nth(1).getByRole('button', { name: /^Move joker right$/ })).not.toHaveAttribute('disabled')

		await expect(cards3.nth(2).locator('[name^="joker-name-"]')).toHaveJSProperty('value', 'The Idol')
		await expect(cards3.nth(2).getByRole('combobox', { name: /^Rank$/ })).toHaveValue('Queen')
		await expect(cards3.nth(2).getByRole('button', { name: /^Move joker left$/ })).not.toHaveAttribute('disabled')
		await expect(cards3.nth(2).getByRole('button', { name: /^Move joker right$/ })).toHaveAttribute('disabled')
	})

	test('can be drag-and-dropped to re-arrange', async ({ page }) => {
		await page.goto('/?state=----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*-126*****2*3*1*_132*****0*0*1*_69****12.4*0*0*1*-')

		await expect(page.locator('[name^="joker-name-"]')).toHaveCount(3)
		const cards = page.locator('joker-card')
		await expect(cards.nth(0).locator('[name^="joker-name-"]')).toHaveJSProperty('value', 'The Idol')
		await expect(cards.nth(0).getByRole('combobox', { name: /^Rank$/ })).toHaveValue('Queen')
		await expect(cards.nth(1).locator('[name^="joker-name-"]')).toHaveJSProperty('value', 'The Family')
		await expect(cards.nth(2).locator('[name^="joker-name-"]')).toHaveJSProperty('value', 'Hologram')
		await expect(cards.nth(2).getByRole('spinbutton', { name: /^xMult$/ })).toHaveValue('12.4')

		const target = cards.nth(1)
		const targetRect = await target.evaluate((element) => element.getBoundingClientRect())
		await cards.nth(0).dragTo(
			target,
			// Make sure the drop location is safely past the halfway point of the target.
			{ targetPosition: { x: targetRect.width * 0.75, y: 0 } },
		)

		const cards2 = page.locator('joker-card')
		await expect(cards2.nth(0).locator('[name^="joker-name-"]')).toHaveJSProperty('value', 'The Family')
		await expect(cards2.nth(1).locator('[name^="joker-name-"]')).toHaveJSProperty('value', 'The Idol')
		await expect(cards2.nth(1).getByRole('combobox', { name: /^Rank$/ })).toHaveValue('Queen')
		await expect(cards2.nth(2).locator('[name^="joker-name-"]')).toHaveJSProperty('value', 'Hologram')
		await expect(cards2.nth(2).getByRole('spinbutton', { name: /^xMult$/ })).toHaveValue('12.4')

		const target2 = cards2.nth(0)
		const target2Rect = await target2.evaluate((element) => element.getBoundingClientRect())
		await cards2.nth(2).dragTo(
			target2,
			// Make sure the drop location is safely before the halfway point of the target.
			{ targetPosition: { x: target2Rect.width * 0.25, y: 0 } },
		)

		const cards3 = page.locator('joker-card')
		await expect(cards3.nth(0).locator('[name^="joker-name-"]')).toHaveJSProperty('value', 'Hologram')
		await expect(cards3.nth(0).getByRole('spinbutton', { name: /^xMult$/ })).toHaveValue('12.4')
		await expect(cards3.nth(1).locator('[name^="joker-name-"]')).toHaveJSProperty('value', 'The Family')
		await expect(cards3.nth(2).locator('[name^="joker-name-"]')).toHaveJSProperty('value', 'The Idol')
		await expect(cards3.nth(2).getByRole('combobox', { name: /^Rank$/ })).toHaveValue('Queen')
	})
})

test.describe('Playing cards', () => {
	test('continuously updates URL with current state', async ({ page }) => {
		await page.goto('/')

		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--')

		await page.getByRole('button', { name: /^Add card$/ }).click()
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--0*0*****1*')

		const count = page.getByRole('spinbutton', { name: /^Count$/ })
		await count.fill('2')
		await count.blur()
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--0*0*****1*2')

		await page.getByRole('combobox', { name: /^Rank$/ }).selectOption('10')
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--4*0*****1*2')

		await page.getByRole('combobox', { name: /^Suit$/ }).selectOption('Spades')
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--4*1*****1*2')

		await page.getByRole('combobox', { name: /^Edition$/ }).selectOption('Foil')
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--4*1*1****1*2')

		await page.getByRole('combobox', { name: /^Enhancement$/ }).selectOption('Mult')
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--4*1*1*2***1*2')

		await page.getByRole('combobox', { name: /^Seal$/ }).selectOption('Gold')
		await expect(page).toHaveURL((url) => url.searchParams.get('state') === '----1--5-___________-*_*_*_*_*_*_*_*_*_*_*_*--4*1*1*2*1**1*2')
	})

	test('show/hide debuffed checkbox when The Pillar is active', async ({ page }) => {
		await page.goto('/')

		await page.getByRole('button', { name: /^Add card$/ }).click()
		const playingCard = page.locator('playing-card')
		await expect(playingCard.getByRole('checkbox', { name: /^Debuffed\?$/ })).toBeHidden()

		const blind = page.locator('[name="blindName"]')
		const blindButton = blind.getByRole('button', { name: /^Show blind options$/ })
		await blindButton.click()
		await blind.getByRole('option', { name: /^The Pillar$/ }).click()
		await expect(playingCard.getByRole('checkbox', { name: /^Debuffed\?$/ })).toBeVisible()
	})
})
