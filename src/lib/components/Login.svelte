<script lang="ts">
	import { Card } from 'flowbite-svelte';

	export let title: string;
	export let subtitle: string;
</script>

<Card>
	<h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
		{title}
	</h5>
	<p class="mb-3 font-normal text-gray-700 dark:text-gray-400 leading-tight">
		{subtitle}
	</p>
	<slot name="button" />
</Card>
