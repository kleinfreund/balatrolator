/** @type {import('eslint').Linter.Config} */ const config = {
	root: true,
	parserOptions: {
		parser: '@typescript-eslint/parser',
		sourceType: 'module',
	},
	env: {
		browser: true,
	},
	plugins: ['@typescript-eslint'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
	],
	rules: {
		// Necessary to use tabs for indentation.
		'no-tabs': ['error', { allowIndentationTabs: true }],
		indent: 'off',
		'@typescript-eslint/indent': ['error', 'tab'],
		// Other rules.
		'comma-dangle': 'off',
		'@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
		'space-before-function-paren': ['error', 'always'],
		'@typescript-eslint/no-unused-vars': ['error', { 'ignoreRestSiblings': true }],
	},
	overrides: [
		{
			files: '*.test.ts',
			rules: {
				'@typescript-eslint/ban-ts-comment': 'off',
			},
		},
	],
}

/* eslint-env node */
module.exports = config
