<script lang="ts">
import { type Result } from '@sailcalc/sailcalc-common/sailcalc-series';

import Cell from './flex-table/Cell.svelte';

interface Props {
	result: Result;
}

let { result }: Props = $props();
</script>

{#if result.code}
	{#if result.score || result.score === 0}
		{#if result.isDiscard}
			<Cell>
				<div class="sc-result-cell__code">{result.code}</div>
				<div class="sc-result-cell__score">({result.score})</div>
			</Cell>
		{:else}
			<Cell>
				<div class="sc-result-cell__code">{result.code}</div>
				<div class="sc-result-cell__score">{result.score}</div>
			</Cell>
		{/if}
	{:else}
		<!-- No score, we just have to deal with the code. -->
		{#if result.isDiscard}
			<Cell>
				<div class="sc-result-cell__code-only">({result.code})</div>
			</Cell>
		{:else}
			<Cell>
				<div class="sc-result-cell__code-only">{result.code}</div>
			</Cell>
		{/if}
	{/if}
{:else}
	<!-- No code, we just have to deal with the score. -->
	{#if result.isDiscard}
		<Cell>
			<div class="sc-result-cell__score-only">({result.score})</div>
		</Cell>
	{:else}
		<Cell>
			<div class="sc-result-cell__score-only">{result.score}</div>
		</Cell>
	{/if}
{/if}

<style>
:global {
	.sc-result-cell__code {
		font-size: 0.625em;
		width: 100%;
	}
	.sc-result-cell__score {
		line-height: 1;
		padding-bottom: 0.125em;
	}
	.sc-result-cell__code-only {
		padding: 1px 0 2px;
		font-size: 0.875em;
	}
	.sc-result-cell__score-only {
		padding: 1px 0 2px;
	}
}
</style>
