export enum PreferenceType {
	mountain = 0,
	beach = 1
}

export enum PaceType {
	fast = 0,
	slow = 1
}

export enum GroupSizeType {
	solo = 0,
	group = 1
}

export type Preferences = {
	preference: PreferenceType;
	pace: PaceType;
	groupSize: GroupSizeType;
};

export type SenderoRouteRaw = {
	'IBILBIDEA/RECORRIDO': string;
	'UDALERRIA_KODEA/COD_MUNICIPIO': number;
	'ESKUALDEA/COMARCA': string;
	'IBILBIDEEKIN LOTURA/ENLACE CIRCUITOS': string;
	'MOTA/TIPO': string;
	'KOMUNAK/ASEOS': string;
	'UTM Y': string;
	'UTM X': string;
	'KODEA/CODIGO': string;
	'ZIRKUITOA_CAS/CIRCUITO_CAS': string;
	'LUZERA (KM)/LONGITUD (KM)': string;
	'IZENA/NOMBRE': string;
	'ITURRIAK/FUENTES': string;
	'IRTEERA/SALIDA': string;
	latitude: string;
	'DENBORA (OO:MM)/DURACION (HH:MM)': string;
	'ZAILTASUNA/DIFICULTAD': string;
	'ATERPEA/COBIJO': string;
	'MAILA-ALDAKETA METATUA (M)/DESNIVEL ACUMULADO (M)': string;
	'SEGURTASUNA/SEGURIDAD': string;
	'ESERLEKUAK/BANCOS': string;
	'ERAGILE ARDURADUN/PROMOTOR RESPONSABLE': string;
	'UDALERRIA/MUNICIPIO': string;
	longitude: string;
	'IRISGARRITASUNA/ACCESIBILIDAD': string;
	'HELDUERA/LLEGADA': string;
	_id: number;
	'URLA/URL': string;
	'ZIRKUITOA_EU/CIRCUITO_EU': string;
};

export type SenderoRoute = {
	recorrido: string;
	codigoMunicipio: number;
	comarca: string;
	longitud: string;
	nombre: string;
	duracion: string;
	desnivel: string;
	dificultad: string;
};

export function parseSenderoRoute(raw: SenderoRouteRaw): SenderoRoute {
	return {
		recorrido: raw['IBILBIDEA/RECORRIDO'],
		codigoMunicipio: raw['UDALERRIA_KODEA/COD_MUNICIPIO'],
		comarca: raw['ESKUALDEA/COMARCA'],
		longitud: raw['LUZERA (KM)/LONGITUD (KM)'],
		nombre: raw['IZENA/NOMBRE'],
		duracion: raw['DENBORA (OO:MM)/DURACION (HH:MM)'],
		desnivel: raw['MAILA-ALDAKETA METATUA (M)/DESNIVEL ACUMULADO (M)'],
		dificultad: raw['ZAILTASUNA/DIFICULTAD']
	};
}

export type CulturalEventRaw = {
	'ZENBATEKOA_EU/PRECIO_EU': string;
	'IZENBURUA_EU/TITULO_EU': string;
	'LEKUA_CAS/LUGAR_CAS': string;
	'GEOLOKALIZAZIOA/GEOLOCALIZACION': string;
	'LINK/LINK': string;
	'ORDUTEGIA_EU/HORARIO_EU': string;
	'EKITALDI MOTA/TIPO EVENTO': string;
	'DESKRIPZIOA_CAS/DESCRIPCION_CAS': string;
	'EKITALDIAREN KATEGORIA/CATEGORIA EVENTO': string;
	'ORDUTEGIA_CAS/HORARIO_CAS': string;
	'IRUDIAREN URL_CAS/URL IMAGEN_CAS': string;
	'IZENBURUA_CAS/TITULO_CAS': string;
	'URL KANONIKOA_EU/URL CANONICA_EU': string;
	'HIZKUNTZA/IDIOMA': string;
	'DESKRIPZIOA_EU/DESCRIPCION_EU': string;
	'EKITALDIA/EJERCICIO': number;
	'IRUDIAREN URL_EU/URL IMAGEN_EU': string;
	'ZENBATEKOA_CAS/PRECIO_CAS': string;
	'AMAIERA DATA/FECHA FIN': string;
	'URL KANONIKOA_CAS/URL CANONICA_CAS': string;
	'SARRERAK_CAS/ENTRADAS_CAS': string;
	'UDALERRIA/MUNICIPIO': string;
	'LEKUA_EU/LUGAR_EU': string;
	'HASIERA DATA/FECHA INICIO': string;
	_id: number;
	'SARRERAK_EU/ENTRADAS_EU': string;
};

export type CulturalEvent = {
	precio: string;
	nombre: string;
	lugar: string;
	horario: string;
	url_canonica: string;
	idioma: string;
	municipio: string;
	fecha_inicio: string;
};

export function parseCulturalEvent(raw: CulturalEventRaw): CulturalEvent {
	return {
		precio: raw['ZENBATEKOA_EU/PRECIO_EU'],
		nombre: raw['IZENBURUA_EU/TITULO_EU'],
		lugar: raw['LEKUA_EU/LUGAR_EU'],
		horario: raw['ORDUTEGIA_EU/HORARIO_EU'],
		url_canonica: raw['URL KANONIKOA_EU/URL CANONICA_EU'],
		idioma: raw['HIZKUNTZA/IDIOMA'],
		municipio: raw['UDALERRIA/MUNICIPIO'],
		fecha_inicio: raw['HASIERA DATA/FECHA INICIO']
	};
}
