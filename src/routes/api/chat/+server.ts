import { OLLAMA_URL, OLLAMA_TOKEN, OLLAMA_MODEL } from '$env/static/private';

export async function POST({ request }: { request: Request }) {
	const { messages } = await request.json();

	// Prepare headers for the request to Ollama API
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');

	if (OLLAMA_TOKEN) headers.append('Authorization', OLLAMA_TOKEN);

	try {
		// Initiate a streaming request to the Ollama API
		const response = await fetch(OLLAMA_URL, {
			method: 'POST',
			headers,
			body: JSON.stringify({
				stream: true,
				model: OLLAMA_MODEL,
				messages
			})
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
					if (done) break;

					// Decode and process each chunk
					const responseChunk = decoder.decode(value, { stream: true });
					const parts = responseChunk.split('\n').filter(Boolean);

					// Parse each JSON object in the chunk
					for (const part of parts) {
						try {
							const json = JSON.parse(part);

							if (json.message && json.message.content) {
								// Append the chunk to the assistant message
								partialMessage += json.message.content;

								controller.enqueue(
									new TextEncoder().encode(
										JSON.stringify({
											chunk: json,
											finalMessage: partialMessage
										}) + '\n'
									)
								);
							}
						} catch (e) {
							console.error('Error parsing JSON chunk:', e);
						}
					}
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
