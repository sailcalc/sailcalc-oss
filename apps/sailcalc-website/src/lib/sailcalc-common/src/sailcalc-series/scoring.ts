import { getNextId, type Series } from './series';

export interface ScoringGroup {
	id: string;
	name?: string;
	competitors: Record<string, SeriesResult>; // Competitors in the scoring group.
}

export interface Result {
	// scoringGroupId: string;
	// competitorId: string;
	raceId: string;
	score?: number; // Scored result;
	isDiscard?: boolean | null; // Discarded result;
	code?: string;
}

export interface SeriesResult {
	rank: number;
	rankSuffix?: string;
	total: number;
	net: number;
	races: Record<string, Result>;
	penalty?: number;
}

/**
 * Add a scoring group to a series.
 *
 * @param series The series to modify
 * @param partial Partial properties for the new scoring group
 * @returns The new scoring group object
 */
export const addScoringGroup = (
	series: Series,
	partial: Partial<ScoringGroup> = {},
): ScoringGroup => {
	const id = getNextId(series, 'scoringGroup');

	const { name } = partial;

	const scoringGroup: ScoringGroup = {
		id,
		competitors: {},
	};
	if (name !== undefined) {
		scoringGroup.name = name;
	}
	series.scoringGroups = series.scoringGroups ?? {};
	series.scoringGroups[id] = scoringGroup;
	return scoringGroup;
};
