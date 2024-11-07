<script lang="ts">
	import type { Preferences } from "$lib";
	import { marked } from "marked";
	import { onMount } from "svelte";

	export let preferences: Preferences;

	let userMessage = '';
	let partialMessage = '';
	let messages: {content: string, role: string}[] = [
		{
		role: "system",
		content: "You are a helpful agent helping people find the best tourist destinations in Bizkaia for them."
		}
	];

	onMount(() => {
		userMessage = "Can you recommend some tourist destinations in Bizkaia? When I travel, I prefer to go to the " + preferences.preference + ", I prefer a " + preferences.pace + " pace" + " and I prefer to travel " + preferences.groupSize + ". Based on that, what tourist destinations in Bizkaia do you recommend?";
		sendMessage();
	});

	async function sendMessage() {
		if (userMessage.trim() !== '') {
			// Add user's message to the chat
			messages = [...messages, { content: userMessage, role: 'user' }];

			// Clear the input
			userMessage = '';

			// Placeholder for assistant's response
			let assistantMessage = { content: '', role: 'assistant' };

			try {
				// Call Ollama API with streaming
				const response = await fetch('https://shiny-waddle-646gjpqp7c5rvv-11434.app.github.dev/api/chat', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						model: 'llama3.2', // Replace with the model you're using
						messages: messages
					})
				});

				if (response.ok && response.body) {
					const reader = response.body.getReader();
					const decoder = new TextDecoder('utf-8');

					// Process the stream
					while (true) {
						const { done, value } = await reader.read();
						if (done) break;

						// Decode and parse each chunk
						let response = decoder.decode(value, { stream: true });
						const parts = response.split('\n').filter(Boolean);

						// Append each complete JSON response
						for (const part of parts) {
							try {
								const json = JSON.parse(part);

								if (json.message && json.message.content) {
									partialMessage += json.message.content;

									assistantMessage.content = partialMessage;
									messages = [...messages]; // Trigger reactivity
								}
							} catch (e) {
								console.error('Error parsing JSON chunk:', e);
							}
						}
					}

					// Append the finished partialMessage to the message list
					assistantMessage.content = partialMessage;
					messages = [...messages, assistantMessage];

					// Clear the partialMessage for the next message
					partialMessage = '';
				} else {
					console.error('Failed to fetch from Ollama:', response.statusText);
					assistantMessage.content = 'Oops! Something went wrong with the server.';
					messages = [...messages];
				}
			} catch (error) {
				console.error('Error fetching from Ollama:', error);
				assistantMessage.content = "Oops! Couldn't reach the server.";
				messages = [...messages];
			}
		}
	}
</script>

<div class="chatbox">
	{#each messages as { content, role }}
		{#if role!=="system"}
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
</div>

<div class="input-group mt-3">
	<input
		type="text"
		bind:value={userMessage}
		placeholder="Ask me about a destination..."
		class="form-control"
		on:keyup={(e) => e.key === 'Enter' && sendMessage()}
	/>
	<button class="btn btn-primary" on:click={sendMessage}>Send</button>
</div>

<style>
	.chatbox {
		width: 100%;
		max-width: 90vw;
		height: 60vh;
		border-radius: 10px;
		border: 1px solid #ced4da;
		display: flex;
		flex-direction: column;
		padding: 1rem;
		overflow-y: scroll;
		background-color: #ffffff;
	}

	.message {
		margin: 0.5rem 0;
		padding: 0.5rem;
		border-radius: 15px;
		max-width: 70%;
	}

	.user {
		background-color: #0d6efd;
		color: white;
		align-self: flex-end;
	}

	.assistant {
		background-color: #e9ecef;
		color: #343a40;
		align-self: flex-start;
	}
</style>
