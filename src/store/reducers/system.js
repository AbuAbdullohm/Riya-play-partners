import config from "config";
import systemActions from "../actions/system";

const initialState = {
	currentLangCode: config.DEFAULT_LANGUAGE,
	callback: false,
	theme: null,
	rates: [],
	downloadFile: [],
	addDay: []
};

export default (state = initialState, action) => {
	switch (action.type) {
		case systemActions.Callback.SUCCESS: {
			return {
				...state,
				callback: true
			};
		}
		case systemActions.Callback.FAILURE: {
			return {
				...state,
				callback: false
			};
		}

		case systemActions.ChangeLanguage.TRIGGER: {
			return { ...state, currentLangCode: action.payload };
		}

		case systemActions.ChangeTheme.TRIGGER: {
			return { ...state, theme: action.payload };
		}
		case systemActions.GetRates.SUCCESS: {
			return { ...state, rates: action.payload };
		}
		case systemActions.GetRates.FAILURE: {
			return { ...state, rates: [] };
		}
		case systemActions.GetDownloadFile.SUCCESS: {
			return { ...state, downloadFile: action.payload };
		}
		case systemActions.GetAddDay.SUCCESS: {
			return { ...state, addDay: action.payload };
		}
		default:
			return state;
	}
};
