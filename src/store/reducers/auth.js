import authActions from "../actions/auth";
import { storage } from "services";

const token = storage.get("token");

const initialState = {
	isFetched: true,
	isAuthenticated: !!token,
	data: {},
	token: ""
	// token: "JWEOoc6STR0VPKZsWruK4txN6cRMbLo9" // for dev
};

export default (state = initialState, action) => {
	switch (action.type) {
		case authActions.GetMe.REQUEST:
			return {
				...state,
				isFetched: false
			};

		case authActions.Login.SUCCESS:
			return {
				...state,
				isFetched: true,
				isAuthenticated: true,
				token: action.payload.token,
				data: action.payload
			};

		case authActions.GetMe.SUCCESS:
			return {
				...state,
				isFetched: true,
				isAuthenticated: true,
				data: action.payload.data,
				token: action.payload.token
			};

		case authActions.Logout.REQUEST:
		case authActions.Logout.FAILURE:
		case authActions.Login.FAILURE:
		case authActions.GetMe.FAILURE:
			return {
				...state,
				isFetched: true,
				isAuthenticated: false,
				token: "",
				data: {}
			};

		default:
			return state;
	}
};
