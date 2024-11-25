<script lang="ts">
	import { t } from '$lib/i18n';
	import { GroupSizeType, PaceType, PreferenceType, type Preferences } from '$lib';

	let question1Answer1 = $state(false);
	let question1Answer2 = $state(false);

	let question2Answer1 = $state(false);
	let question2Answer2 = $state(false);

	let question3Answer1 = $state(false);
	let question3Answer2 = $state(false);

	let {
		finishQuiz,
		preferences = $bindable()
	}: { finishQuiz: () => void; preferences: Preferences } = $props();
</script>

<div class="container text-center">
	<!-- Question 1 -->
	<div class="question-card card p-3" style:opacity={1}>
		<h2>{$t('questionnaire.question1')}</h2>
		<div class="d-flex flex-row my-1">
			<button
				disabled={!question1Answer1 !== !question1Answer2 && !question1Answer1}
				class="flex-fill btn btn-primary m-2"
				onclick={() => {
					question1Answer1 = true;
					preferences.preference = PreferenceType.mountain;
				}}>{$t('questionnaire.question1.answer1.text')}</button
			>
			<button
				disabled={!question1Answer1 !== !question1Answer2 && !question1Answer2}
				class="flex-fill btn btn-primary m-2"
				onclick={() => {
					question1Answer2 = true;
					preferences.preference = PreferenceType.beach;
				}}>{$t('questionnaire.question1.answer2.text')}</button
			>
		</div>
	</div>

	<!-- Question 2 (conditionally shown, space reserved) -->
	<div class="question-card card p-3" data-active={question1Answer1 || question1Answer2}>
		<h2>{$t('questionnaire.question2')}</h2>
		<div class="d-flex flex-row my-1">
			<button
				disabled={!question2Answer1 !== !question2Answer2 && !question2Answer1}
				class="flex-fill btn btn-primary m-2"
				onclick={() => {
					question2Answer1 = true;
					preferences.pace = PaceType.slow;
				}}>{$t('questionnaire.question2.answer1.text')}</button
			>
			<button
				disabled={!question2Answer1 !== !question2Answer2 && !question2Answer2}
				class="flex-fill btn btn-primary m-2"
				onclick={() => {
					question2Answer2 = true;
					preferences.pace = PaceType.fast;
				}}>{$t('questionnaire.question2.answer2.text')}</button
			>
		</div>
	</div>

	<!-- Question 3 (conditionally shown, space reserved) -->
	<div class="question-card card p-3" data-active={question2Answer1 || question2Answer2}>
		<h2>{$t('questionnaire.question3')}</h2>
		<div class="d-flex flex-row my-1">
			<button
				disabled={!question3Answer1 !== !question3Answer2 && !question3Answer1}
				class="flex-fill btn btn-primary m-2"
				onclick={() => {
					question3Answer1 = true;
					preferences.groupSize = GroupSizeType.solo;
				}}>{$t('questionnaire.question3.answer1.text')}</button
			>
			<button
				disabled={!question3Answer1 !== !question3Answer2 && !question3Answer2}
				class="flex-fill btn btn-primary m-2"
				onclick={() => {
					question3Answer2 = true;
					preferences.groupSize = GroupSizeType.group;
				}}>{$t('questionnaire.question3.answer2.text')}</button
			>
		</div>
	</div>

	<!-- Final button (conditionally shown) -->
	<div class="question-card card p-3" data-active={question3Answer1 || question3Answer2}>
		<button class="btn btn-success mt-3" onclick={finishQuiz}>{$t('questionnaire.results')}</button>
	</div>
</div>

<style>
	.question-card {
		/* Reserve space for each question card */
		height: fit-content; /* Adjust as needed for consistent layout */
		margin-bottom: 1rem;
		transition: opacity 0.5s fadeInDown; /* Smooth fade in/out */
		opacity: 0; /* Start hidden for animations */
	}

	/* Only reveal cards with content */
	:global(.question-card[data-active='true']) {
		opacity: 1;
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
