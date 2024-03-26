import { HandLevel } from './components/HandLevel.js'
import { JokerCard } from './components/JokerCard.js'
import { PlayingCard } from './components/PlayingCard.js'
import { getState } from '#utilities/getState.js'
import { log } from '#utilities/log.js'
import { calculateScore } from '#lib/balatro.js'
import type { BlindName, Card, DeckName, HandName, InitialState, Joker, State, ResultScore, PlanetName } from '#lib/types.js'
import { PLANET_TO_HAND_MAP } from '../lib/data.js'

export class UiState {
	handsInput: HTMLInputElement
	discardsInput: HTMLInputElement
	moneyInput: HTMLInputElement
	blindNameSelect: HTMLSelectElement
	blindIsActiveCheckbox: HTMLInputElement
	deckSelect: HTMLSelectElement
	observatorySelect: HTMLSelectElement
	jokerSlotsInput: HTMLInputElement

	handLevelContainer: HTMLElement

	jokerContainer: HTMLElement
	addJokerButton: HTMLButtonElement

	playingCardContainer: HTMLElement
	addCardButton: HTMLButtonElement

	scoreCardContainer: HTMLElement
	playedHandEl: HTMLElement

	constructor (form: HTMLFormElement) {
		this.handsInput = form.querySelector('[data-r-hands]') as HTMLInputElement
		this.discardsInput = form.querySelector('[data-r-discards]') as HTMLInputElement
		this.moneyInput = form.querySelector('[data-r-money]') as HTMLInputElement
		this.blindNameSelect = form.querySelector('[data-r-blind-name]') as HTMLSelectElement
		this.blindIsActiveCheckbox = form.querySelector('[data-r-blind-is-active]') as HTMLInputElement
		this.deckSelect = form.querySelector('[data-r-deck]') as HTMLSelectElement
		this.observatorySelect = form.querySelector('[data-r-observatory]') as HTMLSelectElement
		this.jokerSlotsInput = form.querySelector('[data-r-joker-slots]') as HTMLInputElement

		this.handLevelContainer = form.querySelector('[data-h-container]') as HTMLElement

		this.jokerContainer = form.querySelector('[data-j-container]') as HTMLElement
		this.addJokerButton = form.querySelector('[data-j-add-button]') as HTMLButtonElement
		this.addJokerButton.addEventListener('click', () => this.addJoker())

		this.playingCardContainer = form.querySelector('[data-c-container]') as HTMLElement
		this.addCardButton = form.querySelector('[data-c-add-button]') as HTMLButtonElement
		this.addCardButton.addEventListener('click', () => this.addCard())

		this.scoreCardContainer = form.querySelector('[data-sc-container]') as HTMLElement
		this.playedHandEl = form.querySelector('[data-sc-played-hand]') as HTMLElement

		// Quick and dirty way to update the state whenever necessary
		form.addEventListener('change', () => {
			for (const el of this.playingCardContainer.children) {
				if (el instanceof PlayingCard) {
					el.updateState()
				}
			}

			for (const el of this.jokerContainer.children) {
				if (el instanceof JokerCard) {
					el.updateState()
				}
			}
		})
	}

	updateScore (state: State) {
		const { hand, scoringCards, scores } = calculateScore(state)
		log({ hand, scoringCards, scores })

		const distinctScores = new Map<number, ResultScore>()
		for (const score of scores) {
			if (!distinctScores.has(score.score)) {
				distinctScores.set(score.score, score)
			}
		}

		this.playedHandEl.textContent = hand

		this.scoreCardContainer.innerHTML = ''
		for (const score of distinctScores.values()) {
			const template = document.querySelector('template#score-card') as HTMLTemplateElement
			const fragment = template.content.cloneNode(true) as Element

			const luckEl = fragment.querySelector('[data-sc-luck]') as HTMLElement
			luckEl.textContent = score.luck

			const formattedScoreEl = fragment.querySelector('[data-sc-formatted-score]') as HTMLElement
			formattedScoreEl.textContent = score.formattedScore

			const scoreEl = fragment.querySelector('[data-sc-score]') as HTMLElement
			scoreEl.textContent = new Intl.NumberFormat('en').format(score.score)

			this.scoreCardContainer.appendChild(fragment)
		}
	}

	/**
	 * Assembles a `State` object from the various form elements in the UI.
	 *
	 * Inverse operation of `populateUiWithState`.
	 */
	readStateFromUi (): State {
		const hands = Number(this.handsInput.value)
		const discards = Number(this.discardsInput.value)
		const money = Number(this.moneyInput.value)
		const blindName = this.blindNameSelect.value as BlindName
		const blindIsActive = this.blindIsActiveCheckbox.checked
		const deck = this.deckSelect.value as DeckName
		const jokerSlots = Number(this.jokerSlotsInput.value)

		const initialState: Required<InitialState> = {
			hands,
			discards,
			money,
			blind: {
				name: blindName,
				isActive: blindIsActive,
			},
			deck,
			observatoryHands: [],
			handLevels: {},
			jokers: [],
			jokerSlots,
			playedCards: [],
			heldCards: [],
		}

		for (const optionEl of this.observatorySelect.selectedOptions) {
			const planet = optionEl.value as PlanetName
			initialState.observatoryHands.push(PLANET_TO_HAND_MAP[planet])
		}

		for (const handLevel of this.handLevelContainer.children) {
			if (!(handLevel instanceof HandLevel)) continue

			initialState.handLevels[handLevel.handName] = {
				level: handLevel.level,
				plays: handLevel.plays,
			}
		}

		for (const jokerCard of this.jokerContainer.children) {
			if (!(jokerCard instanceof JokerCard)) continue

			initialState.jokers.push({
				name: jokerCard.jokerName,
				edition: jokerCard.edition,
				plusChips: jokerCard.plusChips,
				plusMultiplier: jokerCard.plusMultiplier,
				timesMultiplier: jokerCard.timesMultiplier,
				rank: jokerCard.rank,
				suit: jokerCard.suit,
				isActive: jokerCard.isActive,
			})
		}

		for (const cardEl of this.playingCardContainer.children) {
			if (!(cardEl instanceof PlayingCard)) continue

			initialState[cardEl.isPlayed ? 'playedCards' : 'heldCards'].push({
				rank: cardEl.rank,
				suit: cardEl.suit,
				edition: cardEl.edition,
				enhancement: cardEl.enhancement,
				seal: cardEl.seal,
				isDebuffed: cardEl.isDebuffed,
			})
		}

		return getState(initialState)
	}

	/**
	 * Populates the UI using a `State` object. Tries to retrieve this object from the URL or local storage.
	 */
	populateUiWithState (state: State) {
		this.handsInput.value = String(state.hands)
		this.discardsInput.value = String(state.discards)
		this.moneyInput.value = String(state.money)
		this.blindNameSelect.value = state.blind.name
		this.blindIsActiveCheckbox.checked = state.blind.isActive
		this.deckSelect.value = state.deck
		this.jokerSlotsInput.value = String(state.jokerSlots)

		for (const optionEl of this.observatorySelect.options) {
			if (state.observatoryHands.includes(PLANET_TO_HAND_MAP[optionEl.value as PlanetName])) {
				optionEl.selected = true
			}
		}

		this.handLevelContainer.innerHTML = ''
		for (const [handName, handLevel] of Object.entries(state.handLevels)) {
			this.addHandLevel(handName as HandName, handLevel)
		}

		this.jokerContainer.innerHTML = ''
		for (const joker of state.jokers) {
			this.addJoker(joker)
		}

		this.playingCardContainer.innerHTML = ''
		for (const card of state.playedCards) {
			this.addCard(card, true)
		}

		for (const card of state.heldCards) {
			this.addCard(card, false)
		}
	}

	addJoker (joker?: Joker) {
		this.jokerContainer.insertAdjacentHTML('beforeend', '<joker-card></joker-card>')
		const jokerEl = this.jokerContainer.lastElementChild
		if (joker && jokerEl instanceof JokerCard) {
			jokerEl.setJoker(joker)
		}
	}

	addCard (card?: Card, isPlayed?: boolean) {
		this.playingCardContainer.insertAdjacentHTML('beforeend', '<playing-card></playing-card>')
		const el = this.playingCardContainer.lastElementChild
		if (card && el instanceof PlayingCard) {
			el.setCard(card, isPlayed)
		}
	}

	addHandLevel (handName: HandName, handLevel: { level: number, plays: number }) {
		this.handLevelContainer.insertAdjacentHTML('beforeend', '<hand-level></hand-level>')
		const el = this.handLevelContainer.lastElementChild
		if (el instanceof HandLevel) {
			el.setHandLevel(handName, handLevel)
		}
	}
}
