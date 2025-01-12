import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
	{
		ignores: ['coverage/', 'dist/'],
	},
	eslint.configs.recommended,
	...tseslint.configs.strict,
	...tseslint.configs.stylistic,
	{
		files: ['**/*.{js,ts}'],
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
)
