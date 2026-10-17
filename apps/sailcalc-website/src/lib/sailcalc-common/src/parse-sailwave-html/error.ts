export class SailwaveError extends Error {
	readonly info: unknown;

	/**
	 * Create an ExtendedError.
	 *
	 * @param message - Error message.
	 * @param info - Additional info.
	 */
	constructor(message: string, info?: unknown) {
		super(message);

		// Ensure the error has the correct name.
		this.name = this.constructor.name;

		// Attach the extra info (keep undefined if not provided).
		if (info !== undefined) {
			this.info = info;
		}
	}

	/**
	 * Return useful info when JSON.stringified.
	 *
	 * @returns POJO error information.
	 */
	toJSON() {
		const { name, message, info, stack } = this;
		// Return a plain object; info can be any serializable value.
		return { name, message, info, stack };
	}
}
