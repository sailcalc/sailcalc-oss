<script lang="ts">
import {
	Button,
	type ButtonVariant,
	type ButtonSize,
	Spinner,
} from '$lib/shadcn/';
import ArrowSquareOutIcon from 'phosphor-svelte/lib/ArrowSquareOutIcon';

const variants = 'default secondary ghost destructive link'.split(
	' ',
) as ButtonVariant[];
const sizes = 'xs sm default lg'.split(' ') as ButtonSize[];
</script>

<Button>Spinner <Spinner /></Button>
<div class="py-2">
	<Button size="lg" variant="default"></Button>
	{#each variants as variant (variant)}
		<div>
			<Button {variant}>{variant}</Button>
			{#each sizes as size (size)}
				<Button {size} {variant}
					>{variant}
					{size}
					<ArrowSquareOutIcon weight="duotone" /></Button
				>
			{/each}
		</div>
	{/each}
</div>

<p>
	This is <ArrowSquareOutIcon
		style="display: inline-block"
		weight="duotone"
		size="24"
	/> inline
</p>

<Button size="lg" variant="default">Outline</Button>

<Button variant="secondary">Secondary</Button>

<Button variant="ghost">Ghost</Button>

<Button variant="destructive">Destructive</Button>

<Button variant="link">Link</Button>
