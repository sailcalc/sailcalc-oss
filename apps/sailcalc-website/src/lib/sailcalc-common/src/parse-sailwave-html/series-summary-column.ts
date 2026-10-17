import { addRace, type Series } from '../sailcalc-series';

export type SeriesSummaryColumn =
	| RaceColumn
	| NetColumn
	| PenaltiesColumn
	| RankColumn
	| TotalColumn
	| CustomColumn;

export interface AbstractColumn {
	type: string;
	title?: string;
}

export interface RaceColumn extends AbstractColumn {
	type: 'race';
	raceId: string;
	href?: string;
	date?: string;
	time?: string;
}

export interface NetColumn extends AbstractColumn {
	type: 'net';
}

export interface PenaltiesColumn extends AbstractColumn {
	type: 'penalties';
}

export interface RankColumn extends AbstractColumn {
	type: 'rank';
}

export interface TotalColumn extends AbstractColumn {
	type: 'total';
}

export interface CustomColumn extends AbstractColumn {
	type: 'custom';
	propertyKey: string;
}

/**
 * Extract columns from a summary table.
 *
 * @param table
 * @returns
 */
export const parseSummaryColumns = (
	table: HTMLTableElement,
	series: Series,
): SeriesSummaryColumn[] => {
	// Get the columns for the table.
	const columns: SeriesSummaryColumn[] = [];

	for (const col of table.querySelectorAll('colgroup col') ?? []) {
		switch (col.className) {
			case 'race': {
				const { id: raceId } = addRace(series);
				const column: RaceColumn = {
					type: 'race',
					raceId,
				};
				columns.push(column);
				break;
			}

			case 'nett': {
				const column: NetColumn = {
					type: 'net',
				};
				columns.push(column);
				break;
			}

			case 'penalties': {
				const column: PenaltiesColumn = {
					type: 'penalties',
				};
				columns.push(column);
				break;
			}

			case 'rank': {
				const column: RankColumn = {
					type: 'rank',
				};
				columns.push(column);
				break;
			}

			case 'total': {
				const column: TotalColumn = {
					type: 'total',
				};
				columns.push(column);
				break;
			}

			default: {
				// Deal with description columns
				const column: CustomColumn = {
					type: 'custom',
					propertyKey: col.className,
				};
				columns.push(column);
			}
		}
	}
	return columns;
};
