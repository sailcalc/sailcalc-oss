export interface Options {
	bold?: boolean;
	spacing?: number;
}

/**
 * Estimates the rendered width of a string in em units.
 *
 * This is a heuristic based on typical proportional sans-serif font metrics
 * (Helvetica/Arial-like). It's meant for quick estimates — e.g. deciding
 * whether text will overflow, sizing something before it's rendered, or running
 * in an environment without a DOM (Node, a web worker, etc.).
 *
 * @param text - The string to measure.
 * @param [options]
 * @param [options.bold=false] - Widen the estimate for bold text. Default is
 *   `false`
 * @param [options.letterSpacing=0] - Extra em to add per character. Default is
 *   `0`
 * @returns Estimated width in em units.
 */
export function estimateStringWidthEm(text: string, options: Options = {}) {
	if (!text) return 0;
	const { bold = false } = options;

	// Average relative widths, in em, for a 1em proportional sans-serif font.
	const widths = {
		narrow: 0.28, // i l j t f I . , ' " : ; ! | ( ) [ ] { } space
		wide: 0.9, // m w M W @ %
		upper: 0.72, // other uppercase letters
		digit: 0.56, // 0-9 (tabular figures are fairly uniform)
		default: 0.5, // other lowercase letters / punctuation
		unicodeFallback: 1.0, // unknown / wide scripts (CJK, emoji, etc.)
	};

	const narrowChars = new Set('iIjlt.,\'":;!|()[]{} \t'.split(''));
	const wideChars = new Set('mwMW@%'.split(''));

	let total = 0;

	for (const ch of text) {
		const code = ch.codePointAt(0) ?? 0;

		if (narrowChars.has(ch)) {
			total += widths.narrow;
		} else if (wideChars.has(ch)) {
			total += widths.wide;
		} else if (code >= 48 && code <= 57) {
			total += widths.digit; // 0-9
		} else if (code >= 65 && code <= 90) {
			total += widths.upper; // A-Z (minus M/W handled above)
		} else if (code >= 97 && code <= 122) {
			total += widths.default; // a-z (minus m/w handled above)
		} else if (code < 128) {
			total += widths.default; // other ASCII punctuation/symbols
		} else {
			total += widths.unicodeFallback; // non-ASCII: assume ~1em wide
		}
	}

	if (bold) {
		total *= 1.08; // bold glyphs typically run ~5-10% wider
	}

	return total;
}
