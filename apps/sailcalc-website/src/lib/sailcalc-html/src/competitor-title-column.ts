import { getProperty } from '$lib/dot-prop';

import { type Competitor } from '../../sailcalc-common/src/sailcalc-series';
import { estimateStringWidthEm } from './estimate-em-width.ts';

export interface CompetitorTitleColumn {
	/** (Dot-prop) key in competitor object. */
	propertyKey: string;
	/** Column title. */
	title: string;
	/** Width of element in CSS em units. */
	emWidth?: number;
	/** Alignment (default left). */
	align?: 'l' | 'r' | 'c';
}

export function buildCompetitorTitleColumns(
	{
		competitors,
		competitorOrder,
		competitorColumns,
	}: {
		competitors: Record<string, Competitor>;
		competitorOrder: string[];
		competitorColumns: CompetitorTitleColumn[];
	},
	options: {
		ignoreConstantColumns?: boolean;
		ignoreEmptyColumns?: boolean;
	} = {},
): CompetitorTitleColumn[] {
	const { ignoreConstantColumns, ignoreEmptyColumns } = options;

	// Build the columns for each key.
	const useCompetitorColumns: CompetitorTitleColumn[] = [];

	for (const { propertyKey, title } of competitorColumns) {
		let maxLen = estimateStringWidthEm(title, { bold: true });

		const values = new Set();
		for (const competitorId of competitorOrder) {
			const competitor = competitors[competitorId];
			// Get the value for this competitor.
			const value = getProperty(competitor, propertyKey);
			if (!value) continue;
			values.add(value);
			// Do not set any column wider than 20em.
			maxLen = Math.min(
				40,
				Math.max(
					maxLen,
					// `${getProperty(competitor, propertyKey)}`.length * 0.5,
					estimateStringWidthEm(value),
				),
			);
		}

		// Don't add the column if all the values are the same.
		// svelte-ignore state-referenced-locally
		if (
			(ignoreConstantColumns && values.size < 2)
			|| (ignoreEmptyColumns && values.size === 0)
		)
			continue;

		const emWidth = Math.ceil(maxLen * 8) / 8;
		useCompetitorColumns.push({
			propertyKey,
			emWidth,
			title,
			// align: 'c',
		});
	}

	return useCompetitorColumns;
}
