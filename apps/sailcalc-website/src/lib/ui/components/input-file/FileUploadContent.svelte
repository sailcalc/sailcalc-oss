<script lang="ts">
// import IconFileImport from '@tabler/icons-svelte/icons/file-import';
// import IconUpload from '@tabler/icons-svelte/icons/upload';

import FileArrowUpIcon from 'phosphor-svelte/lib/FileArrowUpIcon';
import FileDashedIcon from 'phosphor-svelte/lib/FileDashedIcon';

interface Props {
	mode?: 'upload' | 'open' | 'import';
	hint?: string;
}

let { hint, mode = 'upload' }: Props = $props();
</script>

<div class="flex flex-col items-center justify-center p-2 sm:p-4">
	{#if mode === 'upload'}
		<FileArrowUpIcon
			class="custom-text-muted mx-auto size-12"
			aria-hidden="true"
		/>
	{:else}
		<FileDashedIcon
			weight="thin"
			class="custom-text-muted mx-auto size-12"
			aria-hidden="true"
		/>
	{/if}
	<p class="mt-1">
		<span class="font-semibold">Click to {mode}</span> or drag and drop
	</p>
	{#if hint}<p class="text-sm">{hint}</p>{/if}
</div>
