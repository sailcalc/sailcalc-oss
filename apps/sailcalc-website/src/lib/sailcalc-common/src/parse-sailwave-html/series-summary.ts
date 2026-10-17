import {
	type CompetitorTitleColumn,
	type SummaryRaceTitleColumn,
} from '../../../sailcalc-html/src';
import {
	addScoringGroup,
	addCompetitor,
	type Series,
	type SeriesResult,
} from '../sailcalc-series';
import {
	parseLabel,
	parseNumberCell,
	parseRank,
	parseSummaryResult,
} from './cells';
import { type SeriesSummaryColumn } from './series-summary-column';
import { parseSummaryColumns } from './series-summary-column';
import { translate } from './translate';

/** The data contained in a Sailwave series summary table. */
export interface SailwaveSummaryTable {
	/** Source <table> element. */
	sourceElement: HTMLElement;
	raceColumns: SummaryRaceTitleColumn[];
	/** Parsed columns. */
	// columns: SeriesSummaryColumn[];
	competitorColumns: CompetitorTitleColumn[];
	scoringGroupId: string;
}

/**
 * Parse a summary table for a scoring group.
 *
 * @param series
 * @param table
 */
export const parseSummaryTable = (
	series: Series,
	sourceElement: HTMLTableElement,
): SailwaveSummaryTable => {
	const { id: scoringGroupId } = addScoringGroup(series);

	// Get the column structure for the table.
	const columns = parseSummaryColumns(sourceElement, series);
	// Add titles to the columns.
	parseSummaryTitleRows(series, sourceElement, columns);

	// Extract the data in the rows.
	parseSummaryDataRows(series, sourceElement, scoringGroupId, columns);

	const raceColumns: SummaryRaceTitleColumn[] = [];
	const competitorColumns: CompetitorTitleColumn[] = [];

	for (const col of columns) {
		switch (col.type) {
			case 'race': {
				raceColumns.push({
					raceId: col.raceId,
					href: col.href,
				});
				break;
			}

			case 'custom': {
				let title = col.title ?? '';
				if (title.indexOf(' ') < 0) {
					title = title.replace(/([A-Z][a-z])/g, ' $1');
				}
				competitorColumns.push({
					propertyKey: `custom.${col.propertyKey}`,
					title,
				});
			}
		}
	}

	return {
		sourceElement,
		raceColumns,
		competitorColumns,
		// columns,
		scoringGroupId,
	};
};

/**
 * Extract titles from a summary table HTML.
 *
 * @param table HTML input
 * @param columns Column structure: the titles are added to this
 */
export const parseSummaryTitleRows = (
	series: Series,
	table: HTMLTableElement,
	columns: SeriesSummaryColumn[],
): void => {
	const titleCells = table.querySelector('thead tr.titlerow')?.children ?? [];
	const dateCells = table.querySelector('thead tr.daterow')?.children ?? [];
	const timeCells = table.querySelector('thead tr.timerow')?.children ?? [];

	columns.forEach((col, i) => {
		// Get the title.
		switch (col.type) {
			case 'race': {
				// Set the name of the race to the title.
				const race = series.races[col.raceId];
				if (race) {
					const el = titleCells[i];
					const link = el.querySelector('a.racelink');
					if (link) {
						race.name = link.textContent;
						col.href = link.getAttribute('href') ?? undefined;
					} else {
						race.name = translate(titleCells[i]?.textContent);
					}
				}

				// Add date and time if these are on separate rows.
				if (dateCells[i] && col.type === 'race') {
					col.date = dateCells[i].textContent;
				}
				if (timeCells[i] && col.type === 'race') {
					col.time = timeCells[i].textContent;
				}
				break;
			}
			default: {
				col.title = translate(titleCells[i]?.textContent);
			}
		}
	});
};

/**
 * Extract competitor results from a summary table row.
 *
 * @param series
 * @param element
 * @param columns
 */
const parseSummaryDataRows = (
	series: Series,
	element: HTMLTableElement,
	scoringGroupId: string,
	columns: SeriesSummaryColumn[],
): void => {
	element.querySelectorAll('tbody tr.summaryrow').forEach((tr) => {
		// Create a new (possibly duplicate) competitor.
		const competitor = addCompetitor(series);
		const competitorId = competitor.id;
		// Results keyed by race ID.

		const seriesResult: SeriesResult = {
			rank: NaN,
			total: NaN,
			net: NaN,
			races: {},
		};

		series.scoringGroups[scoringGroupId].competitors[competitorId] =
			seriesResult;

		const cells = tr.children;
		for (let colIndex = 0; colIndex < cells.length; colIndex++) {
			const cell = cells[colIndex] as HTMLTableCellElement;
			const column = columns[colIndex];
			switch (column.type) {
				case 'custom': {
					competitor.custom = competitor.custom ?? {};
					const value = parseLabel(cell);
					if (value !== null) {
						competitor.custom[column.propertyKey] = value;
					}
					break;
				}
				case 'race': {
					const { raceId } = column;
					seriesResult.races[raceId] = {
						raceId,
						...parseSummaryResult(cell),
					};
					break;
				}
				case 'rank': {
					const { rank, rankSuffix } = parseRank(cell);
					if (rank != null) seriesResult.rank = rank;
					if (rankSuffix != null) seriesResult.rankSuffix = rankSuffix;
					break;
				}
				case 'total': {
					seriesResult.total = parseNumberCell(cell);
					break;
				}
				case 'net': {
					seriesResult.net = parseNumberCell(cell);
					break;
				}
				case 'penalties': {
					seriesResult.penalty = parseNumberCell(cell);
					break;
				}
			}
		}
	});
};
