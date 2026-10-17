<script lang="ts">
// @TODO Get rid of remaining 'cells'.
// @TODO Tidy CSS and comment.
// @TODO Document.
// @TODO Replace JS hover with CSS.

import { getProperty } from '$lib/dot-prop';
import type {
	ScoringGroup,
	SeriesResult,
	Competitor,
	Race,
} from '@sailcalc/sailcalc-common/sailcalc-series';
import type { Snippet } from 'svelte';

import {
	buildCompetitorTitleColumns,
	type CompetitorTitleColumn,
} from './competitor-title-column.ts';
import ResultCell from './ResultCell.svelte';
import { type SummaryRaceTitleColumn } from './summary-race-title-column.ts';

const titlePaddingEm = 0.375;

function getColumnWidthEm(column: CompetitorTitleColumn): number {
	return (column?.emWidth ?? 0) + titlePaddingEm * 2;
}

export interface SummaryResultsTableProps {
	scoringGroup: ScoringGroup;
	competitors: Record<string, Competitor>;
	competitorOrder: string[];
	competitorColumns: CompetitorTitleColumn[];
	races: Record<string, Race>;
	raceColumns: SummaryRaceTitleColumn[];
	options?: Options;

	children?: Snippet;
}

export interface Options {
	striped?: boolean | string[];
	ignoreConstantCompetitorColumns?: boolean;
	ignoreEmptyCompetitorColumns?: boolean;
	/** Display rank ordinals (see docs). */
	rankOrdinals?:
		| 'auto' // Show if they are provided in the `rankText`.
		| 'super' // Show as superscript if they are provided in `rankText` (default).
		| false; // Do not show.
	// | true // Show in default language.
	// | string; // Show in the given language (e.g. 'en').
}

let {
	scoringGroup,
	competitors,
	competitorOrder,
	competitorColumns,
	races,
	raceColumns,
	options = {},

	children,
}: SummaryResultsTableProps = $props();

const defaultSettings: Options = {
	rankOrdinals: 'super',
	striped: true,
};

let settings = $derived({ ...defaultSettings, ...options });
let useCompetitorColumns = $derived(
	buildCompetitorTitleColumns(
		{ competitorColumns, competitors, competitorOrder },
		{
			ignoreConstantColumns: options.ignoreConstantCompetitorColumns,
			ignoreEmptyColumns: options.ignoreEmptyCompetitorColumns,
		},
	),
);
let titlesEmWidth = $derived(
	useCompetitorColumns.reduce(
		(prev, column) => prev + getColumnWidthEm(column),
		0,
	),
);

const defaultShading = ['#ebf2fa', '#fff'];

function getRankHtml({ rank, rankSuffix }: SeriesResult): string {
	if (Number.isNaN(rank) || !rank) return '';
	switch (settings.rankOrdinals) {
		case 'auto': {
			return `${rank}${rankSuffix}`;
		}
		case 'super': {
			return rankSuffix ? `${rank}<sup>${rankSuffix}</sup>` : `${rank}`;
		}
		default: {
			return rank;
		}
	}
}

let stripes = $derived(
	settings.striped === true
		? defaultShading
		: Array.isArray(settings.striped)
			? settings.striped
			: '',
);
</script>

<div
	class={['sailcalc', 'striped', 'scsr__container']}
	style={[
		`--result-cell-width: 2.75em;`,
		`--grid-border-color: #777;`,
		// Number of races to set max width of races section.
		`--n-races: ${raceColumns.length};`,
		// Min width of races section.
		`--min-races: ${Math.min(raceColumns.length, 4)};`,
		`--titles-width: ${titlesEmWidth}em;`,
		`--highlight-even: ${stripes[0]};`,
		`--highlight-odd: ${stripes[1]};`,
	].join(' ')}
>
	<!-- Title row. ---------------------------------------------------------- -->
	<div class="scsr__row-grid">
		<!-- Rank titles. -->
		<div class="scsr__rank-section scsr--titles">
			<div class="scsr__cell">Rank</div>
		</div>

		<!-- Competitor titles. -->
		<div class="scsr__titles-section scsr--titles">
			{#each useCompetitorColumns as column (column.propertyKey)}
				<div
					class={[
						'scsr--title',
						{
							'scsr--align-c': column.align === 'c',
							'scsr--align-r': column.align === 'r',
						},
					]}
					style={`width: ${getColumnWidthEm(column)}em;`}
				>
					<div>{column.title}</div>
				</div>
			{/each}
		</div>

		<!-- Race titles. -->
		<div class="scsr__races-section scsr--titles">
			{#each raceColumns as col (col.raceId)}
				{#if col.href}
					<div class="scsr__cell">
						<!-- eslint-disable svelte/no-navigation-without-resolve -->
						<a href={col.href}>{races[col.raceId].name}</a>
					</div>
				{:else}
					<div class="scsr__cell">{races[col.raceId].name}</div>
				{/if}
			{/each}
		</div>

		<!-- Series totals. -->
		<div class="scsr__total-section scsr--titles">
			<div class="scsr__cell">Total</div>
			<div class="scsr__cell">Net</div>
		</div>
	</div>

	<!-- Competitor rows. ---------------------------------------------------- -->
	{#each competitorOrder as cId, i (cId)}
		<a href="#top" class={['scsr__row-grid', i % 2 ? 'odd' : 'even']}>
			<!-- Competitor rank. -->
			<div class="scsr__rank-section">
				<div class="scsr__cell">
					<span>{@html getRankHtml(scoringGroup.competitors[cId])}</span>
				</div>
			</div>

			<!-- Competitor titles. -->
			<div class="scsr__titles-section">
				{#each useCompetitorColumns as column (column.propertyKey)}
					<div
						class={[
							'title',
							{
								'align-c': column.align === 'c',
								'align-r': column.align === 'r',
							},
						]}
						style={`width: ${getColumnWidthEm(column)}em;`}
					>
						<div>{getProperty(competitors[cId], column.propertyKey)}</div>
					</div>
				{/each}
			</div>

			<!-- Competitor races. -->
			<div class="scsr__races-section">
				{#each raceColumns as { raceId } (raceId)}
					<ResultCell result={scoringGroup.competitors[cId].races[raceId]} />
				{/each}
			</div>

			<!-- Competitor series totals. -->
			<div class="scsr__total-section">
				<div class="scsr__cell">{scoringGroup.competitors[cId].total}</div>
				<div class="scsr__cell">
					<span class="total-net">{scoringGroup.competitors[cId].net}</span>
				</div>
			</div>
		</a>
	{/each}

	<!-- End row. ---------------------------------------------------------- -->
	{#if children}
		<div class="scsr__row-grid">
			<div class="scsr__menu-section">
				{@render children()}
			</div>
		</div>
	{/if}
</div>

<style>
:global {
	.scsr__row-grid {
		display: grid;
		gap: 0;
		align-items: stretch;
		justify-content: center;
		grid-template-columns:
			var(--result-cell-width) /* rank */
			minmax(20em, var(--titles-width)) /* titles */
			minmax(
				calc(var(--result-cell-width) * var(--min-races)),
				calc(var(--result-cell-width) * var(--n-races))
			)
			/* races */
			calc(var(--result-cell-width) * 2); /* total/net */

		grid-template-rows: auto;
		/* Include the border within the cell width so we know how wide they are. */
		box-sizing: content-box;
		border: solid #777;
		border-width: 1px 1px 1px 0;
		border-width: 0;

		break-inside: avoid-page;
		/* grid-template-columns: repeat(auto-fit, minmax(2.75em, 1fr)); */
	}

	a.scsr__row-grid {
		color: inherit;
		text-decoration: inherit;
	}

	a.scsr__row-grid:hover > *,
	a.scsr__row-grid:focus > * {
		background-color: #eee;
	}

	.striped .even > * {
		background-color: var(--highlight-even);
	}

	.striped .odd > * {
		background-color: var(--highlight-odd);
	}

	.scsr__rank-section,
	.scsr__total-section,
	.scsr__titles-section,
	.scsr__races-section {
		/** Do NOT include the border in the width so we can fit n cells in. */
		width: 100%;
		box-sizing: content-box;
		border: solid #777;
		border-width: 1px 0 0 2px;
		margin-top: -1px;
	}

	.scsr__rank-section,
	.total-net {
		font-weight: bold;
	}

	.scsr__total-section {
		border-width: 1px 1px 0 2px;
	}

	.scsr__rank-section.scsr--titles,
	.scsr__total-section.scsr--titles,
	.scsr__titles-section.scsr--titles,
	.scsr__races-section.scsr--titles {
		background: #fff;
		border-width: 1px 0 0 2px;
		margin-top: 0;
		margin-bottom: 1px;
		font-weight: bold;
	}

	.scsr__total-section.scsr--titles {
		border-width: 1px 1px 0 2px;
	}

	.scsr__rank-section {
		display: grid;
		gap: 0;
		grid-template-columns: var(--result-cell-width);
	}

	.scsr__titles-section {
		display: flex;
		flex-wrap: wrap;
	}

	.scsr__titles-section > .title {
		flex-grow: 1;
		display: flex;
		align-items: center;
		min-height: 1.5em;
		border: solid #ccc;
		border-width: 0 1px 1px 0;
		/** Include the border in the width so we can fit n cells in. */
		box-sizing: border-box;
		vertical-align: middle;
	}

	.scsr__titles-section > .title > div {
		padding: 0 0 0 0.375em; /* This must match `nonCenteredTitlePaddingEm`. */
		text-align: left;
	}

	.scsr__titles-section > .title.align-r > div {
		margin-left: auto;
		padding: 0 0.375em 0 0; /* This must match `nonCenteredTitlePaddingEm`. */
		text-align: right;
	}

	.scsr__titles-section > .title.align-c > div {
		margin: auto;
		padding: 0;
		text-align: center;
	}

	.scsr__races-section {
		display: grid;
		gap: 0;
		grid-template-columns: repeat(
			auto-fit,
			minmax(var(--result-cell-width), 1fr)
		);
	}

	.scsr__total-section {
		display: grid;
		gap: 0;
		grid-template-columns: repeat(
			auto-fit,
			minmax(var(--result-cell-width), 1fr)
		);
	}

	.scsr__menu-section {
		grid-column: 1 / 5;
		width: 100%;
	}

	.scsr__cell {
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

	.scsr__races-section.scsr--titles .scsr__cell {
		font-size: 87.5%;
	}

	/** Smaller than a tablet (768px). */
	@media screen and (width < 48em) {
		.scsr__row-grid {
			grid-auto-flow: dense;
			grid-template-columns:
				var(--result-cell-width) /* rank */
				1fr /* titles/races */
				var(--result-cell-width); /* total/net */
			grid-template-rows: auto;
		}
		.scsr__rank-section {
			grid-row: span 2;
		}
		.scsr__races-section {
			grid-column: 2 / 3;
		}
		.scsr__total-section {
			grid-row: span 2;
		}
		.scsr__menu-section {
			grid-column: 1 / 4;
		}
	}

	/** Print settings. */
	@media print {
		/** Use a sensible font size. */
		.scsr__row-grid {
			font-size: 12px;
		}
	}
}
</style>
