<script lang="ts">
	import { t, locale, locales } from '$lib/i18n';
	import type { Preferences } from '$lib';
	import Chatbot from '$lib/Chatbot.svelte';
	import Questionnaire from '$lib/Questionnaire.svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let showChatbot = false;
	let preferences: Preferences = {
		preference: '',
		pace: '',
		groupSize: ''
	};

	function handleFinishQuiz() {
		showChatbot = true;
	}
</script>

<main>
	<select
		class="form-select language-selection"
		aria-label="Language selection"
		bind:value={$locale}
	>
		{#each locales as l}
			<option value={l}>{$t(l)}</option>
		{/each}
	</select>
	<h1 class="my-5">{$t('homepage.title')}</h1>

	{#if !showChatbot}
		<Questionnaire finishQuiz={handleFinishQuiz} bind:preferences />
	{:else}
		<section class="chatbox-container">
			<Chatbot {preferences} pathways={data.pathways!} culturalAgenda={data.culturalAgenda!} />
		</section>
	{/if}
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

	@keyframes fadeInDown {
		0% {
			opacity: 0;
			transform: translateY(-20px);
		}
		100% {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.chatbox-container {
		max-width: min(95vw, 850px);
		width: 100%;

		height: 80vh;

		display: flex;
		flex-direction: column;
		align-items: center;

		margin: auto 1rem;

		padding-bottom: 1rem;
	}
</style>
