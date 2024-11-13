<script lang="ts">
	import type { Preferences } from '$lib';
	import { env } from '$env/dynamic/private';
	import { marked } from 'marked';
	import { onMount } from 'svelte';

	let attractions = [
		{
			name: 'Turismo Bulegoa Bilbo Bizkaia',
			rating: 4.5,
			reviews: 1921,
			type: 'Tourist information center',
			address: 'Plaza Biribila, 1',
			hours: 'Open ⋅ Closes 5:30 PM',
			phone: '944 79 57 60',
			website: 'https://www.bilbaoturismo.net/',
			image: 'https://ssl.gstatic.com/local/servicebusiness/default_user.png',
			description: 'Friendly and cheap city tours'
		},
		{
			name: 'Vizcaya Bridge',
			rating: 4.6,
			reviews: 31834,
			type: 'Bridge',
			address: 'Puente de Vizcaya Zubia',
			description: 'UNESCO-listed Industrial Revolution icon',
			phone: '944 80 10 12',
			website: 'http://www.puente-colgante.com/'
		},
		{
			name: 'Plaza Bizkaia enparantza',
			rating: 4.1,
			reviews: 794,
			type: 'Tourist attraction',
			hours: 'Open now',
			website: 'https://www.bilbaoturismo.net/BilbaoTurismo/eu/plazas/bizkaia'
		},
		{
			name: 'Bilbao Historiko - Expogela',
			rating: 4.3,
			reviews: 68,
			type: 'Tourist attraction',
			address: 'San Frantzisko Kalea, 32',
			hours: 'Open ⋅ Closes 3 PM',
			phone: '946 79 33 79',
			website: 'http://expogela.bilbaohistoriko.org/'
		},
		{
			name: 'Balcón de Bizkaia',
			rating: 4.6,
			reviews: 389,
			type: 'Tourist attraction',
			hours: 'Open 24 hours',
			description: 'Great views parking onsite',
			image: 'https://ssl.gstatic.com/local/servicebusiness/default_user.png'
		},
		{
			name: 'Basque Free Tours',
			rating: 4.9,
			reviews: 99,
			type: 'Visitor center',
			address: 'Arriaga Plaza, 1',
			hours: 'Open ⋅ Closes 7:30 PM',
			phone: '623 19 34 33',
			website: 'http://www.basquefreetours.com/',
			image: 'https://ssl.gstatic.com/local/servicebusiness/default_user.png',
			description: 'Did the English Tour with Marvin and really enjoyed it.'
		},
		{
			name: 'Gaztelugatxe',
			rating: 4.7,
			reviews: 435,
			type: 'Tourist attraction',
			hours: 'Open ⋅ Closes 5 PM',
			website: 'https://www.tiketa.eus/',
			description: 'The visit is completely free, but a reservation is required.',
			image: 'https://ssl.gstatic.com/local/servicebusiness/default_user.png'
		},
		{
			name: 'Guggenheim Museum Bilbao',
			rating: 4.5,
			reviews: 82602,
			type: 'Tourist attraction',
			address: 'Abandoibarra Etorb., 2',
			hours: 'Open ⋅ Closes 7 PM',
			phone: '944 35 90 80',
			website: 'https://www.guggenheim-bilbao.eus/'
		},
		{
			name: 'Artxanda viewpoint',
			rating: 4.7,
			reviews: 12233,
			type: 'Tourist attraction',
			address: 'Enekuri Artxanda Errepidea, 70',
			hours: 'Open 24 hours',
			website:
				'https://www.bilbao.eus/cs/Satellite?cid=3000005415&language=es&pagename=Bilbaonet%2FPage%2FBIO_home',
			description: 'Its accessible via the funicular railway which is a fun way to arrive!'
		},
		{
			name: 'Mirador',
			rating: 4.6,
			reviews: 66,
			type: 'Tourist attraction',
			address: 'Lezamako Trenbide Zaharreko Bidea',
			hours: 'Open now',
			description: 'Free parking and good for hiking'
		},
		{
			name: 'Bizkaia Maite Tours',
			rating: 4.9,
			reviews: 9,
			type: 'Tour agency',
			address: 'Grupo Santo Domingo de Guzmán',
			hours: 'Open 24 hours',
			phone: '688 89 47 49',
			website: 'https://bizkaiamaitetours.vercel.app/pages/index.html',
			description: 'We were very lucky to have Jose Luis as our guide for 2 different tours.'
		},
		{
			name: 'Bilboko Donejakue Katedrala',
			rating: 4.3,
			reviews: 8257,
			type: 'Tourist attraction',
			address: 'Done Jakue Plazatxoa, 1',
			phone: '944 15 36 27',
			website: 'http://catedralbilbao.com/',
			description: 'Audio guide is included (good for 6 EUR ticket).'
		},
		{
			name: 'BilbaoGuia-Guia de turismo',
			rating: 4.8,
			reviews: 57,
			type: 'Sightseeing tour agency',
			address: 'Iparraguirre Kalea, 36-Principal, izquierda',
			hours: 'Open ⋅ Closes 2 PM',
			phone: '640 77 29 76',
			website: 'https://www.bilbaoguia.com/'
		},
		{
			name: 'Playa de Ereaga',
			rating: 4.4,
			reviews: 3047,
			type: 'Tourist attraction',
			hours: 'Open 24 hours',
			description: 'Mostly for enjoying the scenic views and sea breeze'
		},
		{
			name: 'Parque Doña Casilda Iturrizar',
			rating: 4.5,
			reviews: 11325,
			type: 'Tourist attraction',
			hours: 'Open 24 hours',
			website: 'https://www.bilbaoturismo.net/BilbaoTurismo/eu/parques/dona-casilda',
			description: 'Very chill park with nice views and some nice cultural amenities and sights.'
		},
		{
			name: 'Baileneko Etxe Orratzak/Rascacielos de Bailen',
			rating: 4.4,
			reviews: 10,
			type: 'Tourist attraction',
			address: 'Bailén Kalea, 1'
		},
		{
			name: 'AITOR DELGADO TOURS - BASQUE PRIVATE TOUR GUIDE',
			rating: 5.0,
			reviews: 105,
			type: 'Sightseeing tour agency',
			address: 'Felipe Uhagón Alkatearen Kalea, 12, bajo',
			hours: 'Open ⋅ Closes 9 PM',
			phone: '687 47 61 34',
			website: 'https://www.aitordelgado.com/'
		},
		{
			name: 'Europa parkea',
			rating: 4.4,
			reviews: 4773,
			type: 'Tourist attraction',
			address: 'Ondarroa Kalea, s/n',
			hours: 'Open 24 hours',
			website: 'http://www.bilbao.net/',
			description: 'Amazing park full of life!'
		},
		{
			name: 'Informazio Turistikoa Gaztelugatxe',
			rating: 4.9,
			reviews: 7,
			type: 'Tourist attraction',
			address: 'Gibelorratzagako San Pelaio Auzoa, 78',
			description: 'Bring water!'
		}
	];

	export let preferences: Preferences;

	let loadingMessage = false;
	let userMessage = '';
	let partialMessage = '';
	let messages: { content: string; role: string }[] = [
		{
			role: 'system',
			content:
				"You are a helpful agent helping people find the best tourist destinations in Bizkaia for them. Here's a list of attractions:"
		}
	];

	messages.concat(
		attractions.map((attraction) => {
			return {
				role: 'system',
				content: JSON.stringify(attraction)
			};
		})
	);

	onMount(() => {
		userMessage =
			'Can you recommend some tourist destinations in Bizkaia? When I travel, I prefer to go to the ' +
			preferences.preference +
			', I prefer a ' +
			preferences.pace +
			' pace' +
			' and I prefer to travel ' +
			preferences.groupSize +
			'. Based on that, what tourist destinations in Bizkaia do you recommend?';
		sendMessage();
	});

	async function sendMessage() {
		if (userMessage.trim() !== '') {
			loadingMessage = true;
			// Add user's message to the chat
			messages = [...messages, { content: userMessage, role: 'user' }];

			// Clear the input
			userMessage = '';

			// Placeholder for assistant's response
			let assistantMessage = { content: '', role: 'assistant' };

			try {
				// Call Ollama API with streaming
				const response = await fetch('/api/chat', {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
						Authorization: 'Bearer ' + env.LLAMA_API_KEY
					},
					body: JSON.stringify({
						model: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
						stream: true,
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

						loadingMessage = false;

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

			loadingMessage = false;
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
		min-width: 60px;
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

	.loader {
		width: 10px;
		aspect-ratio: 1;
		border-radius: 50%;
		animation: l5 1s infinite linear alternate;
		margin-left: 15px;
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
</style>
