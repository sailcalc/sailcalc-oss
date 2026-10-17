import { createSeries, type Series } from '../sailcalc-series';
import { parseRaceTable, type SailwaveRaceTable } from './race-results';
import { parseSummaryTable, type SailwaveSummaryTable } from './series-summary';

export interface SailwaveResultsDocument {
	summaryTables: SailwaveSummaryTable[];
	raceTables: SailwaveRaceTable[];
	series: Series;
}

/**
 * Parse a Sailwave results HTML document.
 *
 * @param doc DOM to parse.
 * @returns Extracted data.
 */
export const parseSailwaveResultsDocument = (
	doc = document,
): SailwaveResultsDocument => {
	const series = createSeries({ uuid: false });

	const parsed: SailwaveResultsDocument = {
		summaryTables: [],
		raceTables: [],
		series,
	};

	// Extract all the series summary tables.
	for (const table of doc.querySelectorAll('table.summarytable')) {
		parsed.summaryTables.push(
			parseSummaryTable(series, table as HTMLTableElement),
		);
	}

	for (const table of doc.querySelectorAll('table.racetable')) {
		parsed.raceTables.push(parseRaceTable(series, table as HTMLTableElement));
	}

	return parsed;
};
