type Locales = 'en' | 'es' | 'eu';

const translations: Record<Locales, Record<string, string>> = {
	en: {
		en: 'English',
		es: 'Spanish',
		eu: 'Basque',
		'homepage.title': 'Welcome to Bizkaia LLM 🌍',

		'questionnaire.question1': 'Do you prefer mountain or beach destinations?',
		'questionnaire.question1.answer1.text': 'Mountain',
		'questionnaire.question1.answer1.value': 'mountain',
		'questionnaire.question1.answer2.text': 'Beach',
		'questionnaire.question1.answer2.value': 'beach',

		'questionnaire.question2': 'Do you like a fast or relaxed pace?',
		'questionnaire.question2.answer1.text': 'Fast',
		'questionnaire.question2.answer1.value': 'fast',
		'questionnaire.question2.answer2.text': 'Relaxed',
		'questionnaire.question2.answer2.value': 'relaxed',

		'questionnaire.question3': 'Are you traveling solo or in a group?',
		'questionnaire.question3.answer1.text': 'Solo',
		'questionnaire.question3.answer1.value': 'solo',
		'questionnaire.question3.answer2.text': 'Group',
		'questionnaire.question3.answer2.value': 'in group',

		'questionnaire.results': 'See recommendations',

		'chat.initial.systemPrompt':
			"You are a helpful agent helping people find the best tourist destinations in Bizkaia for them. Answer exclusively in English. Here's a list of attractions:",

		'chat.initial.userMessage':
			'Can you recommend some tourist destinations in Bizkaia? When I travel, I prefer to go to the {{preference}}, I prefer a {{pace}} pace and I am going to travel {{groupSize}}. Based on that, what tourist destinations in Bizkaia do you recommend?'
	},
	es: {
		en: 'Inglés',
		es: 'Español',
		eu: 'Euskera',
		'homepage.title': 'Bienvenido a Bizkaia LLM 🌍',

		'questionnaire.question1': '¿Prefieres destinos de montaña o playa?',
		'questionnaire.question1.answer1.text': 'Montaña',
		'questionnaire.question1.answer1.value': 'montaña',
		'questionnaire.question1.answer2.text': 'Playa',
		'questionnaire.question1.answer2.value': 'playa',

		'questionnaire.question2': '¿Te gusta un ritmo rápido o relajado?',
		'questionnaire.question2.answer1.text': 'Rápido',
		'questionnaire.question2.answer1.value': 'rápido',
		'questionnaire.question2.answer2.text': 'Relajado',
		'questionnaire.question2.answer2.value': 'relajado',

		'questionnaire.question3': '¿Haces el viaje solo o en grupo?',
		'questionnaire.question3.answer1.text': 'Solo',
		'questionnaire.question3.answer1.value': 'solo',
		'questionnaire.question3.answer2.text': 'Grupo',
		'questionnaire.question3.answer2.value': 'en grupo',

		'questionnaire.results': 'Ver recomendaciones',

		'chat.initial.systemPrompt':
			'Eres un agente servicial que ayuda a las personas a encontrar los mejores destinos turísticos en Bizka. Responde exclusivamente en español. Aquí tienes una lista de atracciones:',

		'chat.initial.userMessage':
			'¿Puedes recomendar algunos destinos turísticos en Bizkaia? Cuando viajo, prefiero ir a la {{preference}}, prefiero un ritmo {{pace}} y voy a viajar {{groupSize}}. Basándote en eso, ¿qué destinos turísticos en Bizkaia recomiendas?'
	},
	eu: {
		en: 'Ingelesa',
		es: 'Espainiera',
		eu: 'Euskara',
		'homepage.title': 'Ongi etorri Bizkaia LLM 🌍',

		'questionnaire.question1': 'Mendia edo hondartzako helmugak hobetzen dituzu?',
		'questionnaire.question1.answer1.text': 'Mendia',
		'questionnaire.question1.answer1.value': 'mendia',
		'questionnaire.question1.answer2.text': 'Hondartza',
		'questionnaire.question1.answer2.value': 'hondartza',

		'questionnaire.question2': 'Azkarra edo lasaiagoa zaude gustuko?',
		'questionnaire.question2.answer1.text': 'Azkarra',
		'questionnaire.question2.answer1.value': 'azkarra',
		'questionnaire.question2.answer2.text': 'Lasaiagoa',
		'questionnaire.question2.answer2.value': 'lasaiagoa',

		'questionnaire.question3': 'Bakarrik edo taldean bidaiatzen zara?',
		'questionnaire.question3.answer1.text': 'Bakarrik',
		'questionnaire.question3.answer1.value': 'bakarrik',
		'questionnaire.question3.answer2.text': 'Taldea',
		'questionnaire.question3.answer2.value': 'taldea',

		'questionnaire.results': 'Aholkuak ikusi',

		'chat.initial.systemPrompt':
			'Bizkaian turismo helmugak aurkitzeko laguntzaile zintzo bat zara. Erantzun soilik euskaraz. Hemen daude jarduera batzuk:',

		'chat.initial.userMessage':
			'Zerrenda bat eman dezakezu Bizkaian turismo helmugak gomendatzen? Niretzat, {{preference}} aukeratzen dut, {{pace}} erritmoa gustatzen zait eta {{groupSize}} taldearekin bidaiatuko naiz. Horretan oinarrituta, zer turismo helmugak gomendatzen dituzu Bizkaian?'
	}
};

export default translations;
export type { Locales };
