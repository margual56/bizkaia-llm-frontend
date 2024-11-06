<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();

	let answers = {
		preference: '',
		pace: '',
		groupSize: ''
	};

	function finishQuiz() {
		dispatch('finishQuiz');
	}
</script>

<div class="container text-center">
	<!-- Question 1 -->
	<div class="question-card card p-3" style:opacity={1}>
		<h2>Do you prefer mountain or beach destinations?</h2>
		<div class="d-flex flex-row my-1">
			<button
				class="flex-fill btn btn-primary m-2"
				on:click={() => (answers.preference = 'mountain')}>Mountain</button
			>
			<button class="flex-fill btn btn-primary m-2" on:click={() => (answers.preference = 'beach')}
				>Beach</button
			>
		</div>
	</div>

	<!-- Question 2 (conditionally shown, space reserved) -->
	<div class="question-card card p-3" style:opacity={answers.preference ? 1 : 0}>
		<h2>Do you like a fast or relaxed pace?</h2>
		<div class="d-flex flex-row my-1">
			<button class="flex-fill btn btn-primary m-2" on:click={() => (answers.pace = 'fast')}
				>Fast</button
			>
			<button class="flex-fill btn btn-primary m-2" on:click={() => (answers.pace = 'relaxed')}
				>Relaxed</button
			>
		</div>
	</div>

	<!-- Question 3 (conditionally shown, space reserved) -->
	<div class="question-card card p-3" style:opacity={answers.pace ? 1 : 0}>
		<h2>Are you traveling solo or in a group?</h2>
		<div class="d-flex flex-row my-1">
			<button class="flex-fill btn btn-primary m-2" on:click={() => (answers.groupSize = 'solo')}
				>Solo</button
			>
			<button class="flex-fill btn btn-primary m-2" on:click={() => (answers.groupSize = 'group')}
				>Group</button
			>
		</div>
	</div>

	<!-- Final button (conditionally shown) -->
	<div class="question-card card p-3" style:opacity={answers.groupSize ? 1 : 0}>
		<button class="btn btn-success mt-3" on:click={finishQuiz}>See Recommendations</button>
	</div>
</div>

<style>
	.question-card {
		/* Reserve space for each question card */
		height: fit-content; /* Adjust as needed for consistent layout */
		margin-bottom: 1rem;
		transition: opacity 0.5s ease-in-out; /* Smooth fade in/out */
		opacity: 0; /* Start hidden for animations */
	}

	/* Only reveal cards with content */
	.question-card[style*='opacity: 1'] {
		opacity: 1;
	}
</style>
