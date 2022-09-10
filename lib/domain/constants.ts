enum CaseNames {
	NIMETAV = 'nimetav',
	OMASTAV = 'omastav',
	OSASTAV = 'osastav',
	LÜHIKE_SISSEÜTLEV = 'lühike sisseütlev',
	SISSEÜTLEV = 'sisseütlev',
	SEESÜTLEV = 'seesütlev',
	SEESTÜTLEV = 'seestütlev',
	ALALEÜTLEV = 'alaleütlev',
	ALALÜTLEV = 'alalütlev',
	ALALTÜTLEV = 'alaltütlev',
	SAAV = 'saav',
	RAJAV = 'rajav',
	OLEV = 'olev',
	ILMAÜTLEV = 'ilmaütlev',
	KAASAÜTLEV = 'kaasaütlev',
}

enum caseQuestions {
	NIMETAV = 'Kes? Mis?',
	OMASTAV = 'Kelle? Mille?',
	OSASTAV = 'Keda? Mida?',
	LÜHIKE_SISSEÜTLEV = 'Kuhu',
	SISSEÜTLEV = 'Kellesse? Millesse?',
	SEESÜTLEV = 'Kelles? Milles?',
	SEESTÜTLEV = 'Kellest? Millest?',
	ALALEÜTLEV = 'Kellele? Millele?',
	ALALÜTLEV = 'Kellel? Millel?',
	ALALTÜTLEV = 'Kellelt? Millelt?',
	SAAV = 'Kelleks? Milleks?',
	RAJAV = 'Kelleni? Milleni?',
	OLEV = 'Kellena? Millena?',
	ILMAÜTLEV = 'Kelleta? Milleta?',
	KAASAÜTLEV = 'Kellega? Millega?',
}

type caseKeys = keyof typeof caseQuestions;

export { CaseNames, caseQuestions, caseKeys };
