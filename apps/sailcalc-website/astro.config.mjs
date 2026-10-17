import starlight from '@astrojs/starlight';
import svelte from '@astrojs/svelte';
import tailwindcss from '@tailwindcss/vite';
import mermaid from 'astro-mermaid';
// @ts-check
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	integrations: [
		// Mermaid must come before starlight!
		mermaid({
			theme: 'forest',
			autoTheme: true,
		}),

		starlight({
			title: 'SailCalc',
			// social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],

			customCss: [
				// Path to your Tailwind base styles:
				'./src/styles/global.css',
			],
			// disable404Route: true,
			defaultLocale: 'en-GB',
			/*
			locales: {
				root: {
					label: 'English',
					lang: 'en-GB',
				},
			},
            */

			/*
      social: [
          {
              icon: 'github',
              label: 'GitHub',
              href: 'https://github.com/withastro/starlight',
          },
      ],
      */

			sidebar: [
				{
					label: 'SailCalc',
					items: [{ autogenerate: { directory: 'sailcalc' } }],
				},
				{
					label: 'SailCalc Documentation',
					items: [{ autogenerate: { directory: 'sailcalc-docs' } }],
				},
				{
					label: 'Sailwave',
					items: [{ autogenerate: { directory: 'sailwave' } }],
				},
				{
					label: 'Reference',
					items: [{ autogenerate: { directory: 'race-management' } }],
				},
				/*
          {
              label: 'Guides',
              items: [
                  // Each item here is one entry in the navigation menu.
                  { label: 'Example Guide', slug: 'guides/example' },
              ],
          },
          {
              label: 'Reference',
              items: [{ autogenerate: { directory: 'reference' } }],
          },
          */
			],
		}),
		svelte(),
	],

	vite: {
		plugins: [tailwindcss()],
	},
});
