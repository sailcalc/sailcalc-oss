<script lang="ts">
import type { Snippet } from 'svelte';

type Props = {
	children?: Snippet;
};

let { children }: Props = $props();
</script>

{#if children}
	<div class="sc-cell">{@render children()}</div>
{/if}

<style>
.sc-cell {
	text-align: center;
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: center;
	border: solid #ccc;
	border-width: 0 1px 1px 0;
	width: 100%;
	/** Include the border in the width so we can fit n cells in. */
	box-sizing: border-box;
}
</style>
