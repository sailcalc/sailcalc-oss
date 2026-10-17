<script lang="ts">
import { readFileText } from '$lib/file';
import { prettyBytes, shortDate } from '$lib/format';
import { parseSailwaveResultsDocument } from '$lib/sailcalc-common/src/parse-sailwave-html';
import {
	SummaryResultsTable,
	type CompetitorTitleColumn,
	type SummaryRaceTitleColumn,
	type SummaryResultsTableProps,
} from '$lib/sailcalc-html/src';
// import { Button, Input, Label } from '@src/lib/sh';
import { FileUpload, FileUploadContent } from '$lib/ui/components';
// import IconFileImport from '@tabler/icons-svelte/icons/file-import';
import { mount, onMount } from 'svelte';

const uid = $props.id();

let progress = $state(0);

let importFile = $state<File>();

let importFileText = $state('');
let importFileBody = $state('');

let originalFrame = $state<HTMLIFrameElement>();
let newFrame = $state<HTMLIFrameElement>();

async function onFiles(files: File[]) {
	// Load the CSS file.
	const css = await (await fetch('/result-table.css')).text();

	importFile = files[0];

	// importFileText = await importFile.text();

	// Browsers are required to interpret iso-8859-1 as windows-1252.
	importFileText = await readFileText(importFile, 'windows-1252');

	const importUrlObject = URL.createObjectURL(importFile);

	originalFrame?.setAttribute('src', importUrlObject);

	// Import the document 'as is'. Note that the file has been converted to
	// a UTF-16 string so we need to fix the existing iso-8859-1 declaration.
	const doc = Document.parseHTMLUnsafe(importFileText);
	const contentTypeEl = doc.head.querySelector('meta[http-equiv=Content-Type]');
	contentTypeEl?.setAttribute('content', 'text/html; charset=utf-8');
	const viewportEl = doc.head.querySelector('meta[name=viewport]');
	viewportEl?.setAttribute('content', 'width=device-width, initial-scale=1');

	// Add SailCalc CSS.
	const style = doc.createElement('style');
	style.innerHTML = css;
	doc.head.append(style);

	const parsed = parseSailwaveResultsDocument(doc);

	const { series, summaryTables /*, raceTables */ } = parsed;
	const { competitors, races } = series;
	for (const {
		sourceElement,
		scoringGroupId,
		raceColumns,
		competitorColumns,
	} of summaryTables) {
		try {
			// Create a target for the new 'table'.
			const targetElement = document.createElement('div');
			// Insert the target before the original table.
			if (sourceElement.parentElement) {
				sourceElement.parentElement.insertBefore(targetElement, sourceElement);
			}

			// Hide the original element.
			sourceElement.hidden = true;

			const scoringGroup = series.scoringGroups[scoringGroupId];
			const competitorOrder = Object.keys(scoringGroup.competitors);

			const props: SummaryResultsTableProps = {
				scoringGroup,
				competitors,
				competitorOrder,
				competitorColumns,
				races,
				raceColumns,
				options: {
					ignoreConstantCompetitorColumns: true,
					// ignoreEmptyCompetitorColumns: true,
				},
			};

			mount(SummaryResultsTable, { target: targetElement, props });
		} catch (err) {
			console.error(err);
		}
	}

	const html = `<!doctype html>\n${doc.documentElement.outerHTML}`;
	const outputUrlObject = URL.createObjectURL(
		new Blob([html], { type: 'text/html' }),
	);
	const otherUrl = URL.createObjectURL(new Blob([html], { type: 'text/html' }));
	newFrame?.setAttribute('src', otherUrl);

	window.open(outputUrlObject, '_blank');
}
</script>

<FileUpload
	{onFiles}
	multiple={false}
	mode="open"
	hint="Sailwave results HTML file"
	accept="text/html"
/>

{#if importFile}
	{importFile.name}
	{shortDate(importFile.lastModified)}
	{prettyBytes(importFile.size)}
{/if}

<iframe bind:this={originalFrame} title="Original document" class="frame py-2"
></iframe>

<iframe bind:this={newFrame} title="Converted document" class="frame py-2"
></iframe>

{#if importFileText}
	<pre class="frame py-2">{importFileText}</pre>
{/if}

<style>
.frame {
	max-height: 20vh;
	width: 100%;
	overflow: auto;
}
</style>
