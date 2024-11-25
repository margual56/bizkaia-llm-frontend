<script lang="ts">
	import type { Preferences } from '$lib';
	import Questionnaire from '$lib/Questionnaire.svelte';
	import { goto } from '$app/navigation';

	let preferences: Preferences = {
		preference: 0,
		pace: 0,
		groupSize: 0
	};

	function handleFinishQuiz() {
		//redirect to
		goto(
			`/chat?preference=${preferences.preference}&pace=${preferences.pace}&groupSize=${preferences.groupSize}`
		);
	}
</script>

<Questionnaire finishQuiz={handleFinishQuiz} bind:preferences />
