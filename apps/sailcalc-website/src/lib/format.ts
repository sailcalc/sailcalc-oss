export { default as prettyBytes } from 'pretty-bytes';

const shortDateFormatter = new Intl.DateTimeFormat(undefined, {
	year: 'numeric',
	month: 'numeric',
	day: 'numeric',
});

/**
 * Get a date formatted in the appropriate short format for the locale.
 *
 * @param date
 * @returns
 */
export const shortDate = (date: Date | number) =>
	shortDateFormatter.format(new Date(date));
