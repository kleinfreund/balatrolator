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
	const initialState = uiState.readStateFromUi()
	saveState('state', initialState)
	uiState.updateScore(initialState)
}

function fetchStateAndPopulateUi () {
	const initialState = fetchState('state')
	if (initialState) {
		const state = getState(initialState)
		uiState.populateUiWithState(state)
		// Makes sure state is saved in _both_ URL and browser storage.
		saveState('state', initialState)
		uiState.updateScore(initialState)
	} else {
		const state = getState({})
		uiState.populateUiWithState(state)
	}
}
