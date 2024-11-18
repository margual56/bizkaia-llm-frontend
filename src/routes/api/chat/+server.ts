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

							if (OLLAMA_URL.includes('localhost')) {
								if (json.message && json.message.content) {
									partialMessage += json.message.content;
								} else {
									continue;
								}
							} else {
								/*
							{
							"id": "chatcmpl-RgHnW6IPJdtP8TTzFq5oTowk",
							"object": "chat.completion.chunk",
							"created": 1731947121,
							"model": "meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo",
							"choices": [
							   {
										"index": 0,
										"delta": {
										  "role": "assistant",
											"content": "ib",
											"tool_calls": null
										},
										"finish_reason": null
									}
								],
							"usage": null
							}
						 */
								if (json.choices && json.choices.length > 0 && json.choices[0].delta.content) {
									partialMessage += json.choices[0].delta.content;
								} else {
									continue;
								}
							}

							const chunkData =
								JSON.stringify({
									finalMessage: partialMessage
								}) + '\n';

							controller.enqueue(new TextEncoder().encode(chunkData));
							console.log('Enqueued chunk:', chunkData); // Log enqueued data
							console.info('Message: ', partialMessage);
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
