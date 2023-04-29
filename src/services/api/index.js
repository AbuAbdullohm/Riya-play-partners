import axios from "axios";
import get from "lodash/get";
// import * as Sentry from "@sentry/browser";
import config from "config";
import storage from "../storage";
let timestamp = new Date().getTime();

const request = axios.create({
	baseURL: config.API_ROOT_V1
});

request.defaults.params = {};
request.defaults.params["_f"] = "json";
request.defaults.params["t"] = timestamp;
request.defaults.headers.common["Accept"] = "application/json";
request.defaults.headers.common["Cache-Control"] = "no-cache";
request.defaults.headers.common["Content-Type"] = "application/json; charset=utf-8";

const requestv1 = axios.create({
	baseURL: config.API_ROOT_V1
});

requestv1.defaults.params = {};
requestv1.defaults.params["_f"] = "json";
requestv1.defaults.params["t"] = timestamp;
requestv1.defaults.headers.common["Accept"] = "application/json";
requestv1.defaults.headers.common["Cache-Control"] = "no-cache";
requestv1.defaults.headers.common["Content-Type"] = "application/json; charset=utf-8";

let token = storage.get("token");

const requestv2 = axios.create({
	baseURL: config.API_ROOT_V2
});

requestv2.defaults.params = {};
requestv2.defaults.params["_f"] = "json";
requestv2.defaults.params["t"] = timestamp;
requestv2.defaults.headers.common["Accept"] = "application/json";
requestv2.defaults.headers.common["Cache-Control"] = "no-cache";
requestv2.defaults.headers.common["Content-Type"] = "application/json; charset=utf-8";

const subscribe = store => {
	let state = store.getState();

	// request.defaults.params['_l'] = state.system.currentLangCode;
	request.defaults.params["t"] = timestamp;
	if (get(state, "auth.token")) token = get(state, "auth.token");
	if (token) {
		requestv2.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		requestv1.defaults.headers.common["Authorization"] = `Bearer ${token}`;
		request.defaults.headers.common["Authorization"] = `Bearer ${token}`;
	}
};

export default {
	request,
	requestv1,
	requestv2,
	subscribe
};
