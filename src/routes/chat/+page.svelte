<script lang="ts">
	import type {
		CulturalEvent,
		GroupSizeType,
		PaceType,
		Preferences,
		PreferenceType,
		SenderoRoute
	} from '$lib';
	import Chatbot from '$lib/Chatbot.svelte';
	import { page } from '$app/stores';

	let {
		pathways,
		culturalAgenda
	}: {
		pathways: SenderoRoute[];
		culturalAgenda: CulturalEvent[];
	} = $props();

	const preference: PreferenceType = Number.parseInt($page.url.searchParams.get('preference')!);
	const pace = Number.parseInt($page.url.searchParams.get('pace')!);
	const groupSize = Number.parseInt($page.url.searchParams.get('groupSize')!);

	const preferences: Preferences = { preference, pace, groupSize };
</script>

<Chatbot {preferences} {pathways} {culturalAgenda} />
