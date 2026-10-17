import path from 'path';

import { defineConfig } from 'vite-plus';

export default defineConfig({
	// ... other options
	resolve: {
		alias: {
			$lib: path.resolve('./src/lib'),
		},
	},
});
