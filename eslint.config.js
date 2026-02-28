import { defineConfig, globalIgnores } from 'eslint/config'
import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import playwright from 'eslint-plugin-playwright'

export default defineConfig(
	globalIgnores(['coverage/', 'dist/', '**/playwright-report/']),

	js.configs.recommended,
	tseslint.configs.strict,
	tseslint.configs.stylistic,

	{
		languageOptions: {
			globals: {
				...globals.browser,
			},
		},
		plugins: {
			'@stylistic': stylistic,
		},
		rules: {
			// When working with the DOM, non-null assertions are really useful and I want to use them.
			'@typescript-eslint/no-non-null-assertion': 'off',

			'@stylistic/comma-dangle': ['error', 'always-multiline'],
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/semi': ['error', 'never'],
			'@stylistic/space-before-function-paren': ['error', 'always'],
			'@stylistic/quotes': ['error', 'single'],
		},
	},

	{
		...playwright.configs['flat/recommended'],
		files: ['playwright/tests/**'],
		rules: {
			...playwright.configs['flat/recommended'].rules,
		},
	},
)
