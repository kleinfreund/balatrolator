import { getState } from '#utilities/getState.js'
import { readStateFromUrl } from '#utilities/Storage.js'
import { UiState } from './UiState.js'

const uiState = new UiState()

// Populate the UI when the user navigates back/forth through the browser history.
window.addEventListener('popstate', fetchStateAndPopulateUi)

fetchStateAndPopulateUi()

function fetchStateAndPopulateUi () {
	// Read the state from the URL first, then read it from web storage, and finally, fall back to the default/initial state.
	const state = readStateFromUrl() ?? uiState.getAutoSaveState() ?? getState({})
	uiState.populateUiWithState(state)
}
