<script>
	let messages = [
		{
			text: "Hi there! Based on your answers, I've got some great destination suggestions for you!",
			type: 'bot'
		}
	];

	let userMessage = '';

	function sendMessage() {
		if (userMessage.trim() !== '') {
			messages = [...messages, { text: userMessage, type: 'user' }];
			userMessage = '';

			// Mock bot response
			setTimeout(() => {
				messages = [
					...messages,
					{ text: "Here's a suggestion! 🏖 You might enjoy Sunshine Beach!", type: 'bot' }
				];
			}, 1000);
		}
	}
</script>

<div class="chatbox">
	{#each messages as { text, type }}
		<div class="message {type}">
			{text}
		</div>
	{/each}
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

	.bot {
		background-color: #e9ecef;
		color: #343a40;
		align-self: flex-start;
	}
</style>
