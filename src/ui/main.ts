import { getState } from '#utilities/getState.js'
import { fetchState, saveState } from '#utilities/Storage.js'
import { UiState } from './UiState.js'

const form = document.querySelector('[data-form]') as HTMLFormElement
const uiState = new UiState(form)

form.addEventListener('submit', handleSubmit)

// Populate the UI when the user navigates back/forth through the browser history
window.addEventListener('popstate', fetchStateAndPopulateUi)

fetchStateAndPopulateUi()

function handleSubmit (event: SubmitEvent) {
	event.preventDefault()
	const state = uiState.readStateFromUi()
	saveState('state', state)
	uiState.updateScore(state)
}

function fetchStateAndPopulateUi () {
	const state = fetchState('state')
	if (state) {
		uiState.populateUiWithState(state)
		saveState('state', state)
		uiState.updateScore(state)
	} else {
		const state = getState({})
		uiState.populateUiWithState(state)
		// TODO: Should this default state be persisted in the URL and determine a default score?
	}
}
