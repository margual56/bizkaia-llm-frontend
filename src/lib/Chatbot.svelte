<script>
	let messages = [
		{
			text: "Hi there! Based on your answers, I've got some great destination suggestions for you!",
			role: 'assistant'
		}
	];

	let userMessage = '';
	let partialMessage = '';

	async function sendMessage() {
		if (userMessage.trim() !== '') {
			// Add user's message to the chat
			messages = [...messages, { text: userMessage, role: 'user' }];

			// Capture the message to send, then clear the input
			const messageToSend = userMessage;
			userMessage = '';

			// Placeholder for assistant's response
			let assistantMessage = { text: '', role: 'assistant' };

			try {
				// Call Ollama API with streaming
				const response = await fetch('http://localhost:11434/api/chat', {
					method: 'POST',
					headers: { 'Content-role': 'application/json' },
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
						partialMessage += JSON.parse(decoder.decode(value, { stream: true }))['message'][
							'content'
						];

						// Each chunk may contain multiple JSON objects; handle each individually
						const parts = partialMessage.split('\n').filter(Boolean);
						partialMessage = parts.pop() || ''; // Save any incomplete JSON for the next chunk

						// Append each complete JSON response
						for (const part of parts) {
							try {
								const json = JSON.parse(part);
								if (json.message && json.message.content) {
									assistantMessage.text = partialMessage;
									messages = [...messages]; // Trigger reactivity
								}
							} catch (e) {
								console.error('Error parsing JSON chunk:', e);
							}
						}
					}

					// Append the finished partialMessage to the message list
					assistantMessage.text = partialMessage;
					messages = [...messages, assistantMessage];

					// Clear the partialMessage for the next message
					partialMessage = '';
				} else {
					console.error('Failed to fetch from Ollama:', response.statusText);
					assistantMessage.text = 'Oops! Something went wrong with the server.';
					messages = [...messages];
				}
			} catch (error) {
				console.error('Error fetching from Ollama:', error);
				assistantMessage.text = "Oops! Couldn't reach the server.";
				messages = [...messages];
			}
		}
	}
</script>

<div class="chatbox">
	{#each messages as { text, role }}
		<div class="message {role}">
			{text}
		</div>
	{/each}

	{#if partialMessage}
		<div class="message assistant">
			{partialMessage}
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
		max-width: 500px;
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
