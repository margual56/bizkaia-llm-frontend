<script lang="ts">
	import { t, locale, locales } from '$lib/i18n';
	import storage from '$lib/store';
	import type { Locales } from '$lib/translations';
	let { children } = $props();
	export const lang_sub = storage<{ lang: Locales }>('lang', { lang: 'es' });
</script>

<main>
	<select
		class="form-select language-selection"
		aria-label="Language selection"
		bind:value={$locale}
		onchange={() => lang_sub.update(() => ({ lang: $locale }))}
	>
		{#each locales as l}
			<option value={l}>{$t(l)}</option>
		{/each}
	</select>
	<h1 class="my-5">{$t('homepage.title')}</h1>

	{@render children()}
</main>

<style>
	.language-selection {
		position: absolute;
		top: 1rem;
		right: 1rem;
		z-index: 1000;
		width: fit-content;
	}

	main {
		padding: 0 1rem;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: flex-start;
		height: 100vh;
		background-color: #f8f9fa;
		color: #343a40;
	}

	h1 {
		font-size: 2.5rem;
		animation: fadeInDown 1s ease-in-out;
	}
</style>
