import { State } from '#lib/types.ts'
import { deminify, minify } from './minifier.ts'
import { WebStorage } from './Storage.ts'

interface Save {
	name: string
	time: number
	state: State
	autoSave?: boolean
}

type StoredSave = Omit<Save, 'state'> & { state: string }

const AUTO_SAVE_NAME = 'Current hand'

export class SaveManager {
	#saves: Save[] = []

	get saves () {
		return this.#saves
	}

	getSave (name: string) {
		return this.#saves.find((save) => save.name === name)
	}

	#getSaveIndex (name: string) {
		return this.#saves.findIndex((save) => save.name === name)
	}

	getAutoSave () {
		return this.#saves.find((save) => save.autoSave)
	}

	#getAutoSaveIndex () {
		return this.#saves.findIndex((save) => save.autoSave)
	}

	/**
	 * Save the current state under a name.
	 */
	save (name: string, state: State) {
		const existingSaveIndex = this.#getSaveIndex(name)
		const index = existingSaveIndex === -1 ? this.#saves.length : existingSaveIndex
		const existingSave = this.#saves[index]
		this.#saves[index] = {
			name,
			time: Date.now(),
			state,
			autoSave: existingSave?.autoSave ?? false,
		}
	}

	/**
	 * Save the current state as a special auto save overwriting the previous auto save.
	 */
	autoSave (state: State) {
		const autoSaveIndex = this.#getAutoSaveIndex()
		const index = autoSaveIndex === -1 ? this.#saves.length : autoSaveIndex
		const autoSave = this.#saves[index]
		this.#saves[index] = {
			name: autoSave?.name ?? AUTO_SAVE_NAME,
			time: Date.now(),
			state,
			autoSave: true,
		}
	}

	deleteSave (name: string) {
		this.#saves.splice(this.#getSaveIndex(name), 1)
	}

	/**
	 * Retrieve saves out of web storage.
	 */
	retrieveStoredSaves () {
		let minifiedSaves = [] as StoredSave[]
		try {
			minifiedSaves = JSON.parse(WebStorage.get('saves') ?? '[]') as StoredSave[]
		} catch (error) {
			// A JSON SyntaxError can occur here for old save data that was compressed and which is no longer being decompressed.
			console.error('Failed to parse saves.', error)
		}

		const saves: Save[] = minifiedSaves.map((save) => ({
			...save,
			state: deminify(save.state),
		}))
		saves.sort((saveA, saveB) => saveB.time - saveA.time)

		this.#saves = saves
	}

	/**
	 * Store saves in web storage.
	 */
	storeSaves () {
		this.#saves.sort((saveA, saveB) => saveB.time - saveA.time)
		const storedSaves: StoredSave[] = this.#saves.map((save) => ({
			...save,
			state: minify(save.state),
		}))

		WebStorage.set('saves', JSON.stringify(storedSaves))
	}
}
