import { getState } from '#utilities/getState.js'
import { readStateFromUrl } from '#utilities/Storage.js'
import { UiState } from './UiState.js'

const form = document.querySelector<HTMLFormElement>('[data-form]')!
const uiState = new UiState(form)

form.addEventListener('submit', handleSubmit)

// Populate the UI when the user navigates back/forth through the browser history.
window.addEventListener('popstate', fetchStateAndPopulateUi)

fetchStateAndPopulateUi()

function handleSubmit (event: SubmitEvent) {
	event.preventDefault()
	const state = uiState.readStateFromUi()
	uiState.applyState(state)
}

function fetchStateAndPopulateUi () {
	// Read the state from the URL first, then read it from web storage, and finally, fall back to the default/initial state.
	const state = readStateFromUrl() ?? uiState.getCurrentStoredState() ?? getState({})
	uiState.populateUiWithState(state)
	uiState.applyState(state)
}
