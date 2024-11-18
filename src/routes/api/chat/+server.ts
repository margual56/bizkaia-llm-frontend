import { OLLAMA_URL, OLLAMA_TOKEN, OLLAMA_MODEL } from '$env/static/private';

export async function POST({ request }: { request: Request }) {
	const { messages } = await request.json();

	// Prepare headers for the request to Ollama API
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');
	headers.append('Cache-Control', 'no-cache');
	headers.append('Connection', 'keep-alive');

	if (OLLAMA_TOKEN) headers.append('Authorization', OLLAMA_TOKEN);

	const abortController = new AbortController();
	const { signal } = request; // Use the incoming request's signal to detect client aborts

	signal.addEventListener('abort', () => {
		// If the client aborts, stop the request to Ollama
		abortController.abort();
		console.log('Client aborted the request.');
	});
	try {
		// Initiate a streaming request to the Ollama API
		const response = await fetch(OLLAMA_URL, {
			method: 'POST',
			headers,
			body: JSON.stringify({
				stream: true,
				model: OLLAMA_MODEL,
				messages
			}),
			signal: abortController.signal
		});

		// Check if the response is OK and has a readable stream
		if (!response.ok || !response.body) {
			return new Response(JSON.stringify({ error: 'Failed to fetch from Ollama' }), {
				status: 500
			});
		}

		const reader = response.body.getReader();
		const decoder = new TextDecoder('utf-8');

		// Create a ReadableStream to send data back to the client
		const stream = new ReadableStream({
			async start(controller) {
				let partialMessage = '';

				// Stream the data in chunks
				while (true) {
					const { done, value } = await reader.read();
					if (done || signal.aborted) {
						abortController.abort();
						break;
					}

					// Decode and process each chunk
					const responseChunk = decoder.decode(value, { stream: true });
					const parts = responseChunk.split('\n').filter(Boolean);

					// Parse each JSON object in the chunk
					for (const part of parts) {
						if (done || signal.aborted) {
							abortController.abort();
							break;
						}

						let text = part;

						if (part.startsWith('data: ')) {
							text = part.replace(/^data: /, '');
						}

						try {
							console.log('Chunk:', text);
							const json = JSON.parse(text);

							if (json.message && json.message.content) {
								// Append the chunk to the assistant message
								partialMessage += json.message.content;

								if (!signal.aborted) {
									controller.enqueue(
										new TextEncoder().encode(
											JSON.stringify({
												chunk: json,
												finalMessage: partialMessage
											}) + '\n'
										)
									);
								} else {
									controller.close();
									abortController.abort();
								}
							}
						} catch (e) {
							console.error('Error parsing JSON chunk:', e);
							controller.error(e);
							abortController.abort();
						}
					}
				}
				// If we exited because the client aborted, close the controller immediately
				if (signal.aborted) {
					controller.close();
					abortController.abort();
					console.log('Stream closed due to client abort.');
					return;
				}

				// End the stream with the final assistant message
				controller.enqueue(
					new TextEncoder().encode(
						JSON.stringify({
							chunk: null,
							finalMessage: partialMessage
						}) + '\n'
					)
				);

				// Close the stream
				controller.close();
			}
		});

		// Return the stream as a response to the client
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
