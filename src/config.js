const { REACT_APP_API_ROOT_V1, REACT_APP_API_ROOT_V2 } = process.env;

const config = {
	API_ROOT_V1: REACT_APP_API_ROOT_V1,
	API_ROOT_V2: REACT_APP_API_ROOT_V2,
	// DEFAULT_COUNTRY: 'uz',
	DEFAULT_LANGUAGE: "ru",
	DEFAULT_THEME: "light",
	API_LANGUAGES: [
		{ id: 1, code: "uz", title: "O'zbek" },
		{ id: 2, code: "ru", title: "Русский" }
		// { id: 3, code: "en", title: "English" }
	],
	THEMES: [
		{ id: 1, theme: "light" },
		{ id: 2, theme: "dark" }
	],
	INTERACTIVE_SERVICES_TYPE: 1,
	COMPANIES_CERTIFICATE_TYPE: 2,
	CATEGORY_TYPE_COMPANY: 1,
	CATEGORY_TYPE_POST: 2,
	CATEGORY_TYPE_PREFERENCE: 3,
	CATEGORY_TYPE_EVENT: 4
};

export default config;
