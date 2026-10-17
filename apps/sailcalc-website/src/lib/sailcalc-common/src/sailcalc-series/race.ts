import { getNextId, type Series } from './series';
import { type TimeInput } from './time';

export interface Race {
	id: string;
	name: string;
	starts: RaceStart[];
}

export interface RaceStart {
	name: string;
	description?: string;
	competitors: Record<string, RaceCompetitor>;
}

/** A competitor in a race. */
export interface RaceCompetitor {
	/** Finishing position. */
	fp?: number;
	/** Appendix A etc. code (e.g. DSQ). */
	code?: string;
	/** Finish time. */
	finishTime?: TimeInput; // Finish time.
	/** Individual start time for a pursuit race. */
	individualStartTime?: TimeInput;
}

/**
 * Add a race to a series.
 *
 * @param series The series to modify.
 * @returns The new race object.
 */
export const addRace = (series: Series) => {
	const id = getNextId(series, 'race');

	const race: Race = {
		id,
		name: `R${Object.keys(series.races).length + 1}`,
		starts: [],
	};

	series.races[id] = race;
	series.raceOrder.push(id);

	// Races must have at least one start!
	addRaceStart(race);
	return race;
};

/**
 * Add a start to a race.
 *
 * @param race The race to modify.
 * @param partial Partial properties for the new race start.
 * @returns The new start object.
 */
export const addRaceStart = (race: Race) => {
	const start: RaceStart = {
		name: `Start ${race.starts.length + 1}`,
		competitors: {},
	};
	race.starts.push(start);
	return start;
};
