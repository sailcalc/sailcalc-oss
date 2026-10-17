import { type Competitor } from './competitor';
import { type Race } from './race';
import { type ScoringGroup } from './scoring';

/** A SailCalc series. */
export interface Series {
	/** UUIDv4 identifying the series. */
	uuid?: string;
	/** UUIDv4 identifying the current version. */
	version?: string;
	/** Parent version uuid. */
	parentVersion?: string;
	/** Last ids for each keyed item. */
	lastIds?: SeriesIds;
	/** Scoring groups */
	scoringGroups: Record<string, ScoringGroup>;
	/** Competitors in the series, keyed by id. */
	competitors: Record<string, Competitor>;
	/** Races in the series, keyed by id. */
	races: Record<string, Race>;
	/** Flag indicating whether scoring needs to be run. */
	isScored?: boolean;
	/** `raceId`s in chronological order. */
	raceOrder: string[];
}

export interface SeriesIds {
	competitor?: string;
	race?: string;
	scoringGroup?: string;
}

const getNextIdUnsafe = (lastId: string) => {
	const chars = lastId.split('');

	for (let i = chars.length - 1; i >= 0; i--) {
		const char = chars[i];

		if (char !== 'z') {
			chars[i] = String.fromCharCode(char.charCodeAt(0) + 1);
			break;
		}

		// Char is z.
		chars[i] = 'a';
		if (i === 0) {
			chars.unshift('a');
		}
	}

	return chars.join('');
};

/**
 * Get the next ID for a series data element.
 *
 * This modifies the series to note the new ID.
 *
 * @param series The series to modify
 * @param label The label for the series
 * @returns Generated ID.
 */
export const getNextId = (series: Series, label: keyof SeriesIds) => {
	// Get the last ID, which may not be defined.
	const lastId =
		series.lastIds && label in series.lastIds && series.lastIds[label];

	const nextId = lastId ? getNextIdUnsafe(lastId) : 'a';

	// Save the next ID, creating if necessary.
	series.lastIds = series.lastIds ?? {};
	series.lastIds[label] = nextId;

	return nextId;
};

/** Create a series object. */
export interface CreateSeriesOptions {
	uuid?: string | false;
}
export const createSeries = (options: CreateSeriesOptions = {}) => {
	const series: Series = {
		scoringGroups: {},
		competitors: {},
		races: {},
		raceOrder: [],
	};

	if (options.uuid) {
		series.uuid = options.uuid;
	} else if (options.uuid !== false) {
		series.uuid = globalThis.crypto.randomUUID();
	}
	return series;
};
