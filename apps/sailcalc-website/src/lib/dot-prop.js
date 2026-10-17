const ESCAPABLE = new Set(['\\', '.', '[', ']']);
const INDEX = /^(?:0|[1-9]\d*)$/;

const isObject = (value) =>
	value !== null && (typeof value === 'object' || typeof value === 'function');

const isPlainObject = (value) => {
	if (!isObject(value) || Array.isArray(value)) return false;
	const proto = Object.getPrototypeOf(value);
	return proto === null || proto === Object.prototype;
};

const normalize = (segment) =>
	typeof segment === 'string'
	&& INDEX.test(segment)
	&& Number.isSafeInteger(Number(segment))
		? Number(segment)
		: segment;

export const parsePath = (path) => {
	if (Array.isArray(path)) return path.map(normalize);
	if (typeof path !== 'string')
		throw new TypeError(`Expected a string or array, got ${typeof path}`);

	const segments = [];
	let current = '';
	let afterBracket = false; // just closed `[n]`, so no pending segment

	for (let i = 0; i < path.length; i++) {
		const char = path[i];

		if (char === '\\' && ESCAPABLE.has(path[i + 1])) {
			current += path[++i];
			afterBracket = false;
		} else if (char === '.') {
			if (!afterBracket) segments.push(normalize(current));
			current = '';
			afterBracket = false;
		} else if (char === '[') {
			const match = /^\[(\d+)\]/.exec(path.slice(i));
			if (match && INDEX.test(match[1])) {
				if (current !== '') segments.push(normalize(current));
				segments.push(Number(match[1]));
				current = '';
				afterBracket = true;
				i += match[0].length - 1;
			} else {
				current += char;
				afterBracket = false;
			}
		} else {
			current += char;
			afterBracket = false;
		}
	}

	if (!afterBracket) segments.push(normalize(current));
	return segments;
};

const segmentsOf = (path) => {
	if (typeof path !== 'string' && !Array.isArray(path)) return undefined;
	const segments = parsePath(path);
	// WARNING - no check for unsafe segments like `__proto__`.
	return segments;
};

export const getProperty = (object, path) => {
	if (!isObject(object) || (typeof path !== 'string' && !Array.isArray(path))) {
		return;
	}

	const segments = segmentsOf(path);
	if (!segments || segments.length === 0) return;

	let current = object;
	for (const [index, key] of segments.entries()) {
		if (!isObject(current)) return; // no indexing into strings etc.
		current = current[key];
		if (current === undefined || current === null) {
			if (index !== segments.length - 1) return;
			break;
		}
	}

	return current;
};

export const hasProperty = (object, path) => {
	if (!isObject(object)) return false;
	const segments = segmentsOf(path);
	if (!segments || segments.length === 0) return false;

	let current = object;
	for (const key of segments) {
		if (!isObject(current) || !(key in current)) return false;
		current = current[key];
	}
	return true;
};

export const deepKeys = (object) => {
	const walk = (value, prefix) => {
		const recurse =
			(Array.isArray(value) || isPlainObject(value))
			&& Object.keys(value).length > 0;
		if (!recurse) return prefix.length > 0 ? [stringifyPath(prefix)] : [];
		return Object.keys(value).flatMap((key) =>
			walk(value[key], [...prefix, normalize(key)]),
		);
	};
	return walk(object, []);
};
