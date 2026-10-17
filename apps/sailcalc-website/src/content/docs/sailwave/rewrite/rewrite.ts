export interface RewriteFile {
	file: File;
}

// This seems to be unfinished work in progress - commented out to stop it
// breaking anything 2026-10-16.

/*
async function onFiles(files: File[]) {
	importFile = files[0];

	importFileText = await importFile.text();

	const importUrlObject = URL.createObjectURL(importFile);

	originalFrame?.setAttribute('src', importUrlObject);

	const bodyStart = importFileText.indexOf('<body');
	const bodyEnd = importFileText.lastIndexOf('</body>');
	const body = importFileText.substring(bodyStart, bodyEnd + 7);

	const originalDocument =
		document.implementation.createHTMLDocument('New Document');
	originalDocument.body.outerHTML = body;
	const tables = originalDocument.querySelectorAll('table');
	console.log(tables);
}
*/
