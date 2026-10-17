/**
 * Read a file (or blob) into a string.
 *
 * To read a UTF-8 encoded file just use `await file.text()`, otherwise use this
 * with the provided encoding.
 *
 * @param file The file to read.
 * @param encoding Encoding: defaults to UTF-8.
 * @returns A promise for the text content of the file.
 */
export async function readFileText(
	file: File | Blob,
	encoding?: string,
): Promise<string> {
	const fr = new FileReader();
	return new Promise((resolve, reject) => {
		fr.addEventListener('load', () => resolve(fr.result as string));
		fr.addEventListener('abort', () => reject('Aborted'));
		fr.addEventListener('error', () => reject('Error'));
		fr.readAsText(file, encoding);
	});
}
