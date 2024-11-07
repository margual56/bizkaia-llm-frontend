<script lang="ts">
	import type { Preferences } from '$lib';
	import Chatbot from '$lib/Chatbot.svelte';
	import Questionnaire from '$lib/Questionnaire.svelte';

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
	<h1 class="my-5">Welcome to Bizkaia LLM 🌍</h1>

	<section class="my-auto">
		{#if !showChatbot}
			<Questionnaire on:finishQuiz={handleFinishQuiz} bind:preferences />
		{/if}

		{#if showChatbot}
			<Chatbot bind:preferences />
		{/if}
	</section>
</main>

<style>
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
	
</style>
