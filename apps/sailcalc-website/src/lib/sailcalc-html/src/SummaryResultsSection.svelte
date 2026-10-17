<script lang="ts">
import type {
	Competitor,
	Race,
	ScoringGroup,
} from '@sailcalc/sailcalc-common/sailcalc-series';

import type { CompetitorTitleColumn } from './competitor-title-column.ts';
import {
	default as SummaryResultsTable,
	type Options as TableOptions,
} from './SummaryResultsTable.svelte';

interface Options {
	table: TableOptions;
}

interface Props {
	scoringGroup: ScoringGroup;
	competitors: Record<string, Competitor>;
	competitorOrder: string[];
	competitorColumns: CompetitorTitleColumn[];
	races: Record<string, Race>;
	raceOrder: string[];
	options?: Options;
}

let {
	scoringGroup,
	competitors,
	competitorOrder,
	competitorColumns,
	races,
	raceOrder,
	options,
}: Props = $props();
</script>

<div class="sailcalc">
	<SummaryResultsTable
		{scoringGroup}
		{competitors}
		{competitorOrder}
		{competitorColumns}
		{races}
		{raceOrder}
		options={options?.table ?? {}}
	/>
</div>

<style>
.sailcalc {
	font-size: 1rem;
}
</style>
