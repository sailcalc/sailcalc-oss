import { getNextId, type Series } from './series';

export interface Competitor {
	id: string;
	sailNo?: string;
	boatClass?: string;
	helm?: PersonName;
	crew?: PersonName[];
	custom?: Record<string, string>;
}

export interface PersonName {
	displayAs?: string;
	firstName?: string;
	lastName?: string;
}

/**
 * Add a competitor to a series.
 *
 * @param series The series to modify
 * @returns The competitor object
 */
export const addCompetitor = (series: Series): Competitor => {
	const id = getNextId(series, 'competitor');

	const competitor: Competitor = {
		id,
	};
	series.competitors[id] = competitor;

	return competitor;
};

/*
export type CompetitorProperty = Property | CustomProperty | NameProperty;

export interface Property {
	key: Omit<keyof Competitor, 'custom' | 'helm' | 'crew'>;
	title?: string;
}

export interface CustomProperty extends Property {
	key: 'custom';
	customKey: string;
}

export interface NameProperty extends Property {
	key: 'helm' | 'crew';
}

export interface PropertyOptions {
	customKey?: string;
}

export const getCompetitorProperty = (
	competitor: Competitor,
	prop: CompetitorProperty,
): string | undefined => {
	switch (prop.key) {
		case 'custom': {
			const { customKey } = prop as CustomProperty;
			return competitor.custom && customKey && competitor.custom[customKey];
		}
		case 'helm': {
			return competitor.helm?.displayAs;
		}
		case 'crew': {
			return competitor.crew?.map((member) => member.displayAs).join(',');
		}
		default: {
			return competitor[prop.key as keyof Competitor]?.toString();
		}
	}
};
*/
