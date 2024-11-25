import {
	parseCulturalEvent,
	parseSenderoRoute,
	type CulturalEvent,
	type CulturalEventRaw,
	type SenderoRoute,
	type SenderoRouteRaw
} from '$lib';
import type { PageServerLoad } from './$types';

// Define cache objects
let culturalAgendaCache: CulturalEvent[] | null = null;
let pathwaysCache: SenderoRoute[] | null = null;

// Define cache expiration timestamps
let culturalAgendaCacheTimestamp = 0;
let pathwaysCacheTimestamp = 0;

// Cache duration (24h in milliseconds)
const CACHE_DURATION = 24 * 60 * 60 * 1000;

export const load: PageServerLoad = async () => {
	const headers = new Headers();
	headers.append('Content-Type', 'application/json');

	// Current timestamp
	const now = Date.now();

	// Fetch and cache culturalAgenda if not cached or expired
	if (!culturalAgendaCache || now - culturalAgendaCacheTimestamp > CACHE_DURATION) {
		culturalAgendaCache = await fetch(
			'https://www.opendatabizkaia.eus/es/dump/19c581fc-7690-45d8-9634-afbd95a7b90b/agenda-cultural-bizkaikoa-2023?format=json',
			{
				headers,
				method: 'GET',
				mode: 'no-cors'
			}
		)
			.then((response) => response.json())
			.then((data) => data.records.map((event: CulturalEventRaw) => parseCulturalEvent(event)));
		culturalAgendaCacheTimestamp = now; // Update cache timestamp
	}

	// Fetch and cache pathways if not cached or expired
	if (!pathwaysCache || now - pathwaysCacheTimestamp > CACHE_DURATION) {
		pathwaysCache = await fetch(
			'https://www.opendatabizkaia.eus/es/dump/5ae0df1b-1f39-4faf-baf5-055f99fa313a/rutas-senderismo?format=json',
			{
				headers,
				method: 'GET',
				mode: 'no-cors'
			}
		)
			.then((response) => response.json())
			.then((data) => data.records.map((pathway: SenderoRouteRaw) => parseSenderoRoute(pathway)));
		pathwaysCacheTimestamp = now; // Update cache timestamp
	}
	return {
		pathways: pathwaysCache,
		culturalAgenda: culturalAgendaCache
	};
};
