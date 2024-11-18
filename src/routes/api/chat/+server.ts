import { OLLAMA_URL, OLLAMA_TOKEN, OLLAMA_MODEL } from '$env/static/private';

export async function POST({ request }: { request: Request }) {
	const { messages } = await request.json();

	const headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Cache-Control', 'no-cache');
	headers.append('Connection', 'keep-alive');

	if (OLLAMA_TOKEN) headers.append('Authorization', OLLAMA_TOKEN);

	try {
		const response = await fetch(OLLAMA_URL, {
			method: 'POST',
			headers,
			body: JSON.stringify({
				stream: true,
				model: OLLAMA_MODEL,
				messages
			})
		});

		if (!response.ok || !response.body) {
			return new Response(JSON.stringify({ error: 'Failed to fetch from Ollama' }), {
				status: 500
			});
		}

		const reader = response.body.getReader();
		const decoder = new TextDecoder('utf-8');

		const stream = new ReadableStream({
			async start(controller) {
				let partialMessage = '';

				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					const responseChunk = decoder.decode(value, { stream: true });
					console.log('Raw chunk from Ollama:', responseChunk); // Log raw chunk

					const parts = responseChunk.split('\n').filter(Boolean);
					for (const part of parts) {
						const text = part.startsWith('data: ') ? part.slice(6) : part;

						if (text === '[DONE]') {
							console.log("Received '[DONE]' message from Ollama.");
							controller.close();
							return;
						}

						try {
							const json = JSON.parse(text);
							console.log('Parsed JSON chunk:', json); // Log parsed chunk

							if (json.message && json.message.content) {
								partialMessage += json.message.content;

								const chunkData =
									JSON.stringify({
										chunk: json,
										finalMessage: partialMessage
									}) + '\n';

								controller.enqueue(new TextEncoder().encode(chunkData));
								console.log('Enqueued chunk:', chunkData); // Log enqueued data
								console.info('Message: ', partialMessage);
							}
						} catch (e) {
							console.error('Error parsing JSON chunk:', e);
							controller.error(e);
						}
					}
				}

				controller.enqueue(
					new TextEncoder().encode(
						JSON.stringify({
							chunk: null,
							finalMessage: partialMessage
						}) + '\n'
					)
				);
				controller.close();
			}
		});

		return new Response(stream, {
			headers: {
				'Content-Type': 'application/json',
				'Cache-Control': 'no-cache',
				'Transfer-Encoding': 'chunked'
			}
		});
	} catch (error) {
		console.error('Error fetching from Ollama:', error);
		return new Response(JSON.stringify({ error: "Couldn't reach the server" }), {
			status: 500
		});
	}
}
