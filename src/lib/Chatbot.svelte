<script lang="ts">
	import { marked } from 'marked';
	import { onMount } from 'svelte';
	import { t } from '$lib/i18n';
	import type { Preferences, SenderoRoute, CulturalEvent } from '$lib';

	let {
		preferences,
		pathways,
		culturalAgenda
	}: {
		preferences: Preferences;
		pathways: SenderoRoute[];
		culturalAgenda: CulturalEvent[];
	} = $props();

	let loadingMessage = $state(false);
	let userMessage = $state('');
	let partialMessage = $state('');
	let messages: { content: string; role: string }[] = $state([
		{
			role: 'system',
			content: $t('chat.initial.systemPrompt')
		}
	]);

	onMount(async () => {
		messages.push({
			role: 'system',
			content:
				"Here's cultural events:" +
				JSON.stringify(culturalAgenda) +
				'\n and pathways: ' +
				JSON.stringify(pathways)
		});

		userMessage = $t('chat.initial.userMessage', {
			preference: preferences.preference,
			pace: preferences.pace,
			groupSize: preferences.groupSize
		});
		sendMessage();
	});

	async function sendMessage() {
		if (userMessage.trim() !== '') {
			loadingMessage = true;
			messages = [...messages, { content: userMessage.trim(), role: 'user' }];
			userMessage = '';

			try {
				const response = await fetch('/api/chat', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ messages: messages })
				});

				loadingMessage = false;

				if (response.ok && response.body) {
					const reader = response.body.getReader();
					const decoder = new TextDecoder('utf-8');

					while (true) {
						const { done, value } = await reader.read();
						if (done) break;

						const message = decoder.decode(value);

						try {
							const json = JSON.parse(message);

							partialMessage = json.finalMessage;

							// console.debug('Partial message: ', partialMessage);

							messages = [...messages]; // Trigger reactivity
						} catch {
							continue;
						}
					}

					messages = [...messages, { content: partialMessage, role: 'assistant' }];
					partialMessage = '';
				} else {
					console.error('Error in response:', response.statusText);
				}
			} catch (error) {
				console.error('Error sending message:', error);
			}
		}
	}
</script>

<div class="chatbox">
	{#each messages as { content, role }}
		{#if role !== 'system'}
			<div class="message {role}">
				{@html marked(content)}
			</div>
		{/if}
	{/each}

	{#if partialMessage}
		<div class="message assistant">
			{@html marked(partialMessage)}
		</div>
	{/if}

	{#if loadingMessage}
		<div class="message assistant">
			<div class="loader"></div>
		</div>
	{/if}
</div>

<div class="input-group mt-3">
	<input
		type="text"
		bind:value={userMessage}
		placeholder="Ask me anything"
		class="form-control"
		onkeyup={(e) =>
			e.key === 'Enter' && !(loadingMessage || partialMessage.trim() !== '') && sendMessage()}
	/>

	<button
		class="btn btn-primary"
		onclick={sendMessage}
		disabled={loadingMessage || partialMessage.trim() !== ''}>Send</button
	>
</div>

<style>
	.chatbox {
		width: 100%;
		height: 100%;

		border-radius: 10px;
		border: 1px solid #ced4da;
		padding: 1rem;
		background-color: #ffffff;

		opacity: 1;
		visibility: visible;
		transition:
			height 200ms ease,
			opacity 200ms ease,
			visibility 200ms ease;
		overflow: hidden;

		overflow-y: auto;
		overscroll-behavior-y: contain;
		scroll-snap-type: y proximity;
	}

	.message {
		margin: 0.5rem 0;
		margin-bottom: 1rem;
		padding: 0.5rem;
		border-radius: 15px;

		max-width: 90%;
		min-width: 60px;
		width: fit-content;

		height: fit-content;

		overflow-x: auto;
		overflow-y: none;
	}

	.message:last-child {
		scroll-snap-align: end;
	}

	.message * {
		width: fit-content;
		overflow: hidden;
	}

	:global(.message > p:only-child) {
		margin: 0.25rem;
	}

	.user {
		background-color: #0d6efd;
		color: white;

		margin-left: auto;
		text-align: right;
	}

	.assistant {
		background-color: #e9ecef;
		color: #343a40;
	}

	.loader {
		width: 10px;
		aspect-ratio: 1;
		border-radius: 50%;
		animation: l5 1s infinite linear alternate;
		margin-left: 15px;
	}

	.input-group {
		position: relative;
		bottom: 0;
	}
	@keyframes l5 {
		0% {
			box-shadow:
				15px 0 #3a3a3a,
				-15px 0 #3a3a3a20;
			background: #3a3a3a;
		}
		33% {
			box-shadow:
				15px 0 #3a3a3a,
				-15px 0 #3a3a3a20;
			background: #3a3a3a20;
		}
		66% {
			box-shadow:
				15px 0 #3a3a3a20,
				-15px 0 #3a3a3a;
			background: #3a3a3a20;
		}
		100% {
			box-shadow:
				15px 0 #3a3a3a20,
				-15px 0 #3a3a3a;
			background: #3a3a3a;
		}
	}

	@media (max-width: 768px) {
		.chatbox {
			max-width: 100vw;

			border-radius: 0;

			padding-bottom: 1rem;
		}

		.message {
			max-width: 100%;

			background: none;
			box-shadow: none;
		}

		.user {
			background: none;

			color: #0d6efd;

			border-bottom: 1px solid #ced4da;
			border-radius: 0;
		}

		.assistant {
			background: none;

			color: #343a40;

			border-bottom: 1px solid #ced4da;
			border-radius: 0;
		}
	}
</style>
