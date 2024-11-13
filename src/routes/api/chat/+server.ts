import { LLAMA_API_URL, LLAMA_API_KEY } from '$env/static/private';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	// Parse incoming data from client
	const { userMessage, messages } = await request.json();

	if (!userMessage.trim()) {
		return new Response('Empty message', { status: 400 });
	}

	try {
		// Start the request to the external API with streaming enabled
		const response = await fetch(LLAMA_API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${LLAMA_API_KEY}`
			},
			body: JSON.stringify({
				model: 'meta-llama/Meta-Llama-3.1-70B-Instruct',
				stream: true,
				messages: [...messages, { content: userMessage, role: 'user' }]
			})
		});

		// Check if the response supports streaming
		// Create a readable stream to handle and pass data chunks as they arrive
		const stream = new ReadableStream({
			async start(controller) {
				if (!response || !response.body) {
					return new Response('Stream not supported', { status: 500 });
				}

				const reader = response.body.getReader();

				// Read data from the response body in chunks
				while (true) {
					const { done, value } = await reader.read();
					if (done) break;

					// Pass each chunk to the client
					controller.enqueue(value);
				}

				// Close the stream
				controller.close();
			}
		});

		// Return the streaming response to the client
		return new Response(stream, {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (error) {
		console.error('Error in sendMessage:', error);
		return new Response('Internal server error', { status: 500 });
	}
};
