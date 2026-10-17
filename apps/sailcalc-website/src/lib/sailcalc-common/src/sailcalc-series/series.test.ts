import { describe, it, expect } from 'vite-plus/test';

import { createSeries, getNextId } from './series';

const minimalSeries = {
	competitors: {},
	raceOrder: [],
	races: {},
	scoringGroups: {},
};

describe('series.ts', () => {
	describe('createSeries', () => {
		it('should create an empty series with a new uuid by default', () => {
			const s = createSeries();
			const { uuid } = s;

			expect((uuid ?? '').length).toBe(36);
			expect(s).toStrictEqual({
				...minimalSeries,
				uuid,
			});
		});

		it('should use a provided uuid', () => {
			const uuid = 'This should be allowed';
			const s = createSeries({ uuid });

			expect(s.uuid).toBe(uuid);
			expect(s).toStrictEqual({ ...minimalSeries, uuid });
		});

		it('should have no uuid if uuid is false', () => {
			const s = createSeries({ uuid: false });
			expect(s).not.toHaveProperty('uuid');
			expect(s).toStrictEqual(minimalSeries);
		});
	});

	describe('getNextId', () => {
		it('should create a new ID', () => {
			const series = createSeries();
			const nextId = getNextId(series, 'scoringGroup');

			expect(nextId).toBe('a');
			expect(series.lastIds?.scoringGroup).toBe('a');
		});

		it('should increment an existing ID', () => {
			const series = createSeries();
			series.lastIds = { competitor: 'abc' };

			const nextId = getNextId(series, 'competitor');

			expect(nextId).toBe('abd');
			expect(series.lastIds?.competitor).toBe('abd');
		});

		it('should roll over an existing ID', () => {
			const series = createSeries();
			series.lastIds = { race: 'xzz' };

			const nextId = getNextId(series, 'race');

			expect(nextId).toBe('yaa');
			expect(series.lastIds?.race).toBe('yaa');
		});

		it('should extend an existing ID', () => {
			const series = createSeries();
			series.lastIds = { race: 'zzz' };

			const nextId = getNextId(series, 'race');

			expect(nextId).toBe('aaaa');
			expect(series.lastIds?.race).toBe('aaaa');
		});
	});
});
