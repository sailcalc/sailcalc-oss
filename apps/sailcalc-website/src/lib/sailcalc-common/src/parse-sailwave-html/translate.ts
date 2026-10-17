const dictionary: Record<string, string> = {
	Nett: 'Net',
};

/**
 * Translate archaic terms.
 *
 * @param from Old word
 * @returns New word
 */
export const translate = (from: string): string => {
	return dictionary[from] ?? from;
};
