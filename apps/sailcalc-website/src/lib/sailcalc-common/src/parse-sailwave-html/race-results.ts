import type { Series } from '../sailcalc-series';

/** The data contained in a Sailwave race table. */
export interface SailwaveRaceTable {
	/** Source <table> element. */
	element: HTMLElement;
	/** Parsed columns. */
	// columns: SummaryColumn[];
}

/**
 * Parse a race table for a scoring group.
 *
 * @param series
 * @param table
 */
export const parseRaceTable = (
	series: Series,
	element: HTMLTableElement,
): SailwaveRaceTable => {
	// const scoringGroup = addScoringGroup(series);

	// Get the column structure for the table;
	// const columns = [];

	return {
		element,
		// columns,
	};
};
