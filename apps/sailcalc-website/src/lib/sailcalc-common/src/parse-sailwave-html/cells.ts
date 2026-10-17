import type { Result } from '../sailcalc-series';
import { SailwaveError } from './error';

export const parseLabel = (el: HTMLElement): string | null => {
	const trimmed = el.innerText.trim();
	return trimmed.length ? trimmed : null;
};

export const parseNumberCell = (el: HTMLElement): number =>
	parseFloat(el.innerText);

/**
 * Parse a summary table Rank column.
 *
 * May be a simple number (1) an ordinal (1st) or text (DNQ).
 */
export const parseRank = (el: HTMLElement) => {
	const rankText = el.innerText;
	const rank = parseFloat(rankText);
	const matches = el.innerText.match(/[^0-9 ]+/);
	const rankSuffix = matches && matches[0];
	if (isNaN(rank)) {
		return {};
	}
	return rankSuffix ? { rank, rankSuffix } : { rank };
};

/**
 * Parse result text output by Sailwave in a series summary table.
 *
 * The format seems to vary a lot so this is more complicated than I thought!
 * Could do with more testing.
 *
 * @param el Sailwave output result.
 * @returns Parsed result.
 */
export const parseSummaryResult = (el: HTMLElement): Partial<Result> => {
	const text = el.innerText;
	// Left (        (\()?
	// Score              ([0-9.]+)?
	// Whitespace                   \s*
	// Code                            ([A-Za-z]+)?
	// Whitespace                                  \s*
	// Left (                                         (\()?
	// Score                                               ([0-9.]+)?
	// Right )s                                                      (\)*)
	const regExp = /^(\()?([0-9.]+)?\s*([A-Za-z]+)?\s*(\()?([0-9.]+)?(\)*)$/;

	const [matched, lb, score1, code, mb, score2, rb] = text.match(regExp) ?? [];

	if (!matched) {
		throw new ParseResultError('Could not match result', {
			html: el.innerHTML,
			text,
			matched,
		});
	}
	const result: Partial<Result> = {};
	if (code?.length) result.code = code;

	// Any left or right braces mean a discard.
	if (lb?.length || mb?.length || rb?.length) result.isDiscard = true;

	// Two numbers mean the score is ambiguous.
	if (score1?.length) {
		if (score2?.length) {
			throw new ParseResultError('Two values for score', {
				html: el.innerHTML,
				text,
				matched,
				lb,
				score1,
				code,
				mb,
				score2,
				rb,
			});
		}
		result.score = parseFloat(score1);
	}
	if (score2?.length) result.score = parseFloat(score2);

	return result;
};

export class ParseResultError extends SailwaveError {}
