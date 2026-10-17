import { describe, it, expect } from 'vite-plus/test';

import pkg from '../../package.json' with { type: 'json' };
import * as index from './index.ts';

describe('The entry point', () => {
	it('should expose the correct version', () => {
		expect(index.version).toBe(pkg.version);
	});
});
