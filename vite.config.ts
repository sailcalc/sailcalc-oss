import { defineConfig } from 'vite-plus';

export default defineConfig({
	fmt: {
		ignorePatterns: ['**/shadcn/**'],

		// Global.
		experimentalOperatorPosition: 'start',
		printWidth: 80,
		singleQuote: true,
		useTabs: true,

		// JS/TS.
		jsdoc: true,
		sortImports: true,
		sortPackageJson: { sortScripts: true },

		// Extensions.
		astro: true,
		proseWrap: 'always', // Markdown.
		sortTailwindcss: { functions: ['cn'] },
		svelte: { indentScriptAndStyle: false },
	},
	lint: {
		ignorePatterns: ['apps/sailcalc-website/**', '**/shadcn/**'],
		jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
		rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
		options: { typeAware: true, typeCheck: true },
	},
	run: {
		cache: true,
	},
});
