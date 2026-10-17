<script lang="ts">
import type { Snippet } from 'svelte';

import FileUploadContent from './FileUploadContent.svelte';

interface Props {
	accept?: string;
	multiple?: boolean;
	onFiles: (files: File[]) => void;
	children?: Snippet;
	/** Use icon and text for different modes. */
	mode?: 'upload' | 'open' | 'import';
	/** File type hint e.g. 'Images max 10MB'. */
	hint?: string;
}

let {
	accept,
	multiple = true,
	onFiles,
	mode,
	hint,
	children,
}: Props = $props();

const uid = $props.id();

let isDragging = $state(false);

// Counter instead of a plain boolean toggle — dragleave fires every time
// the pointer crosses into a child element inside the zone, not just when
// it actually leaves the zone, so a naive toggle causes flicker.
let dragDepth = 0;

function handleDragEnter(e: DragEvent) {
	e.preventDefault();
	dragDepth++;
	isDragging = true;
}

function handleDragOver(e: DragEvent) {
	// Required: without preventDefault() here, the browser refuses the drop.
	e.preventDefault();
}

function handleDragLeave(e: DragEvent) {
	e.preventDefault();
	dragDepth--;
	if (dragDepth <= 0) {
		dragDepth = 0;
		isDragging = false;
	}
}

function handleDrop(e: DragEvent) {
	e.preventDefault();
	dragDepth = 0;
	isDragging = false;
	const files = Array.from(e.dataTransfer?.files ?? []);
	if (files.length) onFiles(files);
}

function handleInputChange(e: Event) {
	const target = e.target as HTMLInputElement;
	const files = Array.from(target.files ?? []);
	if (files.length) onFiles(files);
	target.value = ''; // reset so picking the same file again still fires change
}
</script>

<!-- svelte-ignore a11y_no_static_element_interactions (drag handlers are a
pointer-only enhancement; keyboard access goes through the input below) -->
<div
	class={['dropzone', isDragging && 'dragging']}
	ondragenter={handleDragEnter}
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
>
	<label for={uid} class="dropzone-label">
		{#if children}
			{@render children()}
		{:else}
			<FileUploadContent {mode} {hint} />
		{/if}
	</label>

	<input
		id={uid}
		type="file"
		{accept}
		{multiple}
		class="sr-only"
		onchange={handleInputChange}
	/>
</div>

<style>
.dropzone {
	border: 2px dashed var(--color-border);
	border-radius: var(--radius-md, 0.5rem);
	text-align: center;
	transition: background-color 0.15s ease;
}

/* The div itself is no longer tabbable — the real input is — so the
     ring has to key off the input's focus state instead. */
.dropzone:has(input:focus-visible) {
	outline: 2px solid var(--color-ring);
	outline-offset: 2px;
}

.dropzone.dragging {
	border-color: var(--color-primary);
	background-color: color-mix(in srgb, var(--color-primary) 8%, transparent);
}

.dropzone-label {
	display: block;
	cursor: pointer;
}
</style>
